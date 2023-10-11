import { ComponentChildren, h, RefObject } from 'preact'
import { useCallback, useRef, useState } from 'preact/hooks'

import menuStyles from '../../../css/menu.module.css'
import { useMouseDownOutside } from '../../../hooks/use-mouse-down-outside.js'
import { IconMenuCheckmarkChecked16 } from '../../../icons/icon-16/icon-menu-checkmark-checked-16.js'
import { Event, EventHandler } from '../../../types/event-handler.js'
import { FocusableComponentProps } from '../../../types/focusable-component-props'
import { createClassName } from '../../../utilities/create-class-name.js'
import { createComponent } from '../../../utilities/create-component.js'
import { getCurrentFromRef } from '../../../utilities/get-current-from-ref.js'
import { noop } from '../../../utilities/no-op'
import { computeNextValue } from '../private/compute-next-value.js'
import { isKeyCodeCharacterGenerating } from '../private/is-keycode-character-generating.js'
import textboxStyles from '../textbox/textbox.module.css'
import textboxAutocompleteStyles from './textbox-autocomplete.module.css'

const EMPTY_STRING = ''
const INVALID_ID = null
const ITEM_ID_DATA_ATTRIBUTE_NAME = 'data-textbox-autocomplete-item-id'
const MENU_VERTICAL_MARGIN = 8

export interface TextboxAutocompleteProps
  extends FocusableComponentProps<HTMLInputElement> {
  disabled?: boolean
  filter?: boolean
  icon?: ComponentChildren
  onInput?: EventHandler.onInput<HTMLInputElement>
  onKeyDown?: EventHandler.onKeyDown<HTMLInputElement>
  onMouseDown?: EventHandler.onMouseDown<HTMLInputElement>
  onPaste?: EventHandler.onPaste<HTMLInputElement>
  onValueInput?: EventHandler.onValueChange<string>
  options: Array<TextboxAutocompleteOption>
  placeholder?: string
  revertOnEscapeKeyDown?: boolean
  spellCheck?: boolean
  strict?: boolean
  top?: boolean
  value: string
  variant?: TextboxAutocompleteVariant
}
export type TextboxAutocompleteOption =
  | TextboxAutocompleteOptionHeader
  | TextboxAutocompleteOptionValue
  | TextboxAutocompleteOptionSeparator
export type TextboxAutocompleteOptionHeader = {
  header: string
}
export type TextboxAutocompleteOptionValue = {
  value: string
  disabled?: boolean
}
export type TextboxAutocompleteOptionSeparator = {
  separator: true
}
export type TextboxAutocompleteVariant = 'border' | 'underline'

type Option =
  | TextboxAutocompleteOptionHeader
  | OptionValueWithId
  | TextboxAutocompleteOptionSeparator
type OptionValueWithId = TextboxAutocompleteOptionValue & {
  id: string
}
type Id = typeof INVALID_ID | string

export const TextboxAutocomplete = createComponent<
  HTMLInputElement,
  TextboxAutocompleteProps
>(function (
  {
    disabled = false,
    filter = false,
    icon,
    onInput = noop,
    onKeyDown = noop,
    onMouseDown = noop,
    onPaste = noop,
    onValueInput = noop,
    placeholder,
    propagateEscapeKeyDown = true,
    revertOnEscapeKeyDown = false,
    spellCheck = false,
    strict = false,
    top = false,
    value,
    variant,
    ...rest
  },
  ref
) {
  if (typeof icon === 'string' && icon.length !== 1) {
    throw new Error(`String \`icon\` must be a single character: ${icon}`)
  }

  const rootElementRef: RefObject<HTMLDivElement> = useRef(null)
  const inputElementRef: RefObject<HTMLInputElement> = useRef(null)
  const menuElementRef: RefObject<HTMLDivElement> = useRef(null)

  const [originalValue, setOriginalValue] = useState<string>(EMPTY_STRING) // Value of the textbox when the menu is shown
  const [editedValue, setEditedValue] = useState<string>(EMPTY_STRING) // Value being edited that does not match any of the options
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<Id>(INVALID_ID)

  const options =
    filter === true
      ? filterOptions(createOptions(rest.options), value, editedValue)
      : createOptions(rest.options)

  // Uncomment to debug
  // console.table([{ editedValue, isMenuVisible, originalValue, selectedId, value }])

  const triggerMenuUpdateScrollPosition = useCallback(function (id: Id) {
    // Adjust the menu scroll position so that the selected option is always visible
    const menuElement = getCurrentFromRef(menuElementRef)
    if (id === INVALID_ID) {
      menuElement.scrollTop = 0
      return
    }
    const selectedElement = menuElement.querySelector<HTMLDivElement>(
      `[${ITEM_ID_DATA_ATTRIBUTE_NAME}='${id}']`
    )
    if (selectedElement === null) {
      throw new Error('`selectedElement` is `null`')
    }
    const y =
      selectedElement.getBoundingClientRect().y -
      menuElement.getBoundingClientRect().y
    if (y < menuElement.scrollTop) {
      menuElement.scrollTop = y
      return
    }
    const offsetBottom = y + selectedElement.offsetHeight
    if (offsetBottom > menuElement.scrollTop + menuElement.offsetHeight) {
      menuElement.scrollTop = offsetBottom - menuElement.offsetHeight
    }
  }, [])

  // Functions to imperatively update the UI state
  const updateSelectedId = useCallback(
    function (value: string) {
      const id = getIdByValue(options, value)
      if (id === INVALID_ID) {
        setEditedValue(value)
      }
      setSelectedId(id)
      triggerMenuUpdateScrollPosition(id)
    },
    [options, triggerMenuUpdateScrollPosition]
  )
  const updateTextboxValue = useCallback(function (value: string) {
    const inputElement = getCurrentFromRef(inputElementRef)
    inputElement.value = value
    const inputEvent = new window.Event('input', {
      bubbles: true,
      cancelable: true
    })
    inputElement.dispatchEvent(inputEvent)
  }, [])
  const triggerTextboxSelect = useCallback(function () {
    getCurrentFromRef(inputElementRef).select()
  }, [])
  const triggerTextboxBlur = useCallback(function () {
    getCurrentFromRef(inputElementRef).blur()
  }, [])
  const triggerMenuHide = useCallback(function () {
    setIsMenuVisible(false)
    // Unset `originalValue` on blur
    setOriginalValue(EMPTY_STRING)
  }, [])
  const triggerMenuShow = useCallback(
    function () {
      updateMenuElementMaxHeight(
        getCurrentFromRef(rootElementRef),
        getCurrentFromRef(menuElementRef),
        top
      )
      // Copy `value` to `originalValue` on focus
      setOriginalValue(value)
      updateSelectedId(value)
      setIsMenuVisible(true)
    },
    [top, updateSelectedId, value]
  )

  const handleTextboxInput = useCallback(
    function (event: Event.onInput<HTMLInputElement>) {
      onInput(event)
      const newValue = event.currentTarget.value
      updateSelectedId(newValue)
      onValueInput(newValue)
      if (isMenuVisible === true) {
        return
      }
      triggerMenuShow()
    },
    [isMenuVisible, onInput, onValueInput, triggerMenuShow, updateSelectedId]
  )

  const handleTextboxKeyDown = useCallback(
    function (event: Event.onKeyDown<HTMLInputElement>) {
      onKeyDown(event)
      const inputElement = event.currentTarget
      const key = event.key
      if (key === 'ArrowUp' || key === 'ArrowDown') {
        event.preventDefault()
        if (isMenuVisible === false) {
          triggerMenuShow()
          return
        }
        if (options.length === 0) {
          return
        }
        const id =
          key === 'ArrowUp'
            ? computePreviousId(options, selectedId)
            : computeNextId(options, selectedId)
        if (id === INVALID_ID) {
          // Reached beginning/end of list of `options`, so just restore `editedValue`
          setSelectedId(INVALID_ID)
          updateTextboxValue(editedValue)
          triggerTextboxSelect()
          triggerMenuUpdateScrollPosition(INVALID_ID)
          return
        }
        // Set the selected option to `id`
        setSelectedId(id)
        const optionValue = findOptionValueById(options, id)
        if (optionValue === null) {
          throw new Error('`optionValue` is `null`')
        }
        // Imperatively set the textbox value
        updateTextboxValue(optionValue.value)
        triggerTextboxSelect()
        triggerMenuUpdateScrollPosition(id)
        return
      }
      if (key === 'Escape') {
        event.preventDefault()
        if (propagateEscapeKeyDown === false) {
          event.stopPropagation()
        }
        if (revertOnEscapeKeyDown === true) {
          updateTextboxValue(originalValue)
        }
        // Hide the menu if it is visible, else blur the textbox
        if (isMenuVisible === true) {
          triggerMenuHide()
          return
        }
        triggerTextboxBlur()
        return
      }
      if (key === 'Enter') {
        event.preventDefault()
        triggerTextboxSelect()
        // Toggle visibility of the menu
        if (isMenuVisible === true) {
          triggerMenuHide()
          return
        }
        triggerMenuShow()
        return
      }
      if (key === 'Tab') {
        triggerMenuHide()
        return
      }
      if (strict === false) {
        return
      }
      if (event.ctrlKey === true || event.metaKey === true) {
        return
      }
      if (isKeyCodeCharacterGenerating(event.keyCode) === true) {
        // Piece together `newValue`, and stop the `keyDown` event if `newValue` is invalid
        const nextValue = computeNextValue(inputElement, event.key)
        if (isValidValue(options, nextValue) === true) {
          return
        }
        event.preventDefault()
      }
    },
    [
      editedValue,
      isMenuVisible,
      onKeyDown,
      options,
      originalValue,
      propagateEscapeKeyDown,
      revertOnEscapeKeyDown,
      selectedId,
      strict,
      triggerMenuHide,
      triggerMenuShow,
      triggerMenuUpdateScrollPosition,
      triggerTextboxBlur,
      triggerTextboxSelect,
      updateTextboxValue
    ]
  )

  const handleTextboxMouseDown = useCallback(
    function (event: Event.onMouseDown<HTMLInputElement>) {
      onMouseDown(event)
      if (isMenuVisible === true) {
        return
      }
      event.preventDefault()
      triggerTextboxSelect()
      triggerMenuShow()
    },
    [isMenuVisible, onMouseDown, triggerTextboxSelect, triggerMenuShow]
  )

  const handleTextboxPaste = useCallback(
    function (event: Event.onPaste<HTMLInputElement>) {
      onPaste(event)
      // Piece together the `nextValue`, and stop the `paste` event (by
      // calling `event.preventDefault()`) if `nextValue` is found to
      // be invalid
      if (strict === false) {
        return
      }
      if (event.clipboardData === null) {
        throw new Error('`event.clipboardData` is `null`')
      }
      const nextValue = computeNextValue(
        event.currentTarget,
        event.clipboardData.getData('Text')
      )
      if (isValidValue(options, nextValue) === true) {
        return
      }
      event.preventDefault()
    },
    [onPaste, options, strict]
  )

  const handleOptionChange = useCallback(
    function (event: Event.onChange<HTMLInputElement>) {
      const id = event.currentTarget.getAttribute(ITEM_ID_DATA_ATTRIBUTE_NAME)
      if (id === null) {
        throw new Error('`id` is `null`')
      }
      // Set the selected option to `id`
      setSelectedId(id)
      const optionValue = findOptionValueById(options, id)
      if (optionValue === null) {
        throw new Error('`optionValue` is `null`')
      }
      // Imperatively set the textbox value
      updateTextboxValue(optionValue.value)
      // Select the textbox, then hide the menu
      triggerTextboxSelect()
      triggerMenuHide()
    },
    [options, triggerMenuHide, triggerTextboxSelect, updateTextboxValue]
  )

  const handleOptionMouseMove = useCallback(
    function (event: Event.onMouseMove<HTMLInputElement>) {
      // Set the selected option to the one being moused over
      const id = event.currentTarget.getAttribute(ITEM_ID_DATA_ATTRIBUTE_NAME)
      if (id === null) {
        throw new Error('`id` is `null`')
      }
      if (id === selectedId) {
        return
      }
      setSelectedId(id)
    },
    [selectedId]
  )

  const handleMouseDownOutside = useCallback(
    function () {
      if (isMenuVisible === false) {
        return
      }
      triggerMenuHide()
      triggerTextboxBlur()
    },
    [isMenuVisible, triggerTextboxBlur, triggerMenuHide]
  )
  useMouseDownOutside({
    onMouseDownOutside: handleMouseDownOutside,
    ref: rootElementRef
  })

  const refCallback = useCallback(
    function (inputElement: null | HTMLInputElement) {
      inputElementRef.current = inputElement
      if (ref === null) {
        return
      }
      if (typeof ref === 'function') {
        ref(inputElement)
        return
      }
      ref.current = inputElement
    },
    [ref]
  )

  return (
    <div
      ref={rootElementRef}
      class={createClassName([
        textboxStyles.textbox,
        typeof variant === 'undefined'
          ? null
          : variant === 'border'
          ? textboxStyles.hasBorder
          : null,
        typeof icon === 'undefined' ? null : textboxStyles.hasIcon,
        disabled === true ? textboxStyles.disabled : null
      ])}
    >
      <div class={textboxStyles.inner}>
        <input
          {...rest}
          ref={refCallback}
          class={textboxStyles.input}
          disabled={disabled === true}
          onInput={handleTextboxInput}
          onKeyDown={handleTextboxKeyDown}
          onMouseDown={handleTextboxMouseDown}
          onPaste={handleTextboxPaste}
          placeholder={placeholder}
          spellcheck={spellCheck}
          tabIndex={0}
          type="text"
          value={value}
        />
        {typeof icon === 'undefined' ? null : (
          <div class={textboxStyles.icon}>{icon}</div>
        )}
        <div class={textboxStyles.border} />
        {variant === 'underline' ? (
          <div class={textboxStyles.underline} />
        ) : null}
        <div
          ref={menuElementRef}
          class={createClassName([
            menuStyles.menu,
            disabled === true || isMenuVisible === false
              ? menuStyles.hidden
              : null,
            top === true
              ? textboxAutocompleteStyles.top
              : textboxAutocompleteStyles.bottom
          ])}
        >
          {options.map(function (option: Option, index: number) {
            if ('separator' in option) {
              return <hr key={index} class={menuStyles.optionSeparator} />
            }
            if ('header' in option) {
              return (
                <h1 key={index} class={menuStyles.optionHeader}>
                  {option.header}
                </h1>
              )
            }
            return (
              <label
                key={index}
                class={createClassName([
                  menuStyles.optionValue,
                  option.disabled === true
                    ? menuStyles.optionValueDisabled
                    : null,
                  option.disabled !== true && option.id === selectedId
                    ? menuStyles.optionValueSelected
                    : null
                ])}
              >
                <input
                  checked={value === option.value}
                  class={menuStyles.input}
                  disabled={option.disabled === true}
                  onChange={handleOptionChange}
                  onMouseMove={handleOptionMouseMove}
                  tabIndex={-1}
                  type="radio"
                  value={`${option.value}`}
                  {...{ [ITEM_ID_DATA_ATTRIBUTE_NAME]: option.id }}
                />
                {option.value === originalValue ? ( // Show check icon if option matches `originalValue`
                  <div class={menuStyles.checkIcon}>
                    <IconMenuCheckmarkChecked16 />
                  </div>
                ) : null}
                {option.value}
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
})

// Add an `id` attribute to all the `TextboxAutocompleteOptionValue` items in `options`
function createOptions(
  options: Array<TextboxAutocompleteOption>
): Array<Option> {
  return options.map(function (
    option: TextboxAutocompleteOption,
    index: number
  ): Option {
    if ('value' in option) {
      const optionValueWithId: OptionValueWithId = {
        ...option,
        id: `${index}`
      }
      return optionValueWithId
    }
    return option
  })
}

function filterOptions(
  options: Array<Option>,
  value: string,
  editedValue: string
): Array<Option> {
  if (value === EMPTY_STRING) {
    return options
  }
  const id = getIdByValue(options, value)
  if (id === INVALID_ID) {
    // `value` does not match any option in `options`
    return options.filter(function (option: Option): boolean {
      if ('value' in option) {
        return doesStringContainSubstring(option.value, value) === true
      }
      return false
    })
  }
  // `value` matches one of the options in `options`
  if (editedValue === EMPTY_STRING) {
    return options
  }
  // Filter `options` by `editedValue`
  return options.filter(function (option: Option): boolean {
    if ('value' in option) {
      return doesStringContainSubstring(option.value, editedValue) === true
    }
    return false
  })
}

// Returns `true` if `string` contains `substring`, else `false`
function doesStringContainSubstring(
  string: string,
  substring: string
): boolean {
  return string.toLowerCase().indexOf(substring.toLowerCase()) !== -1
}

// Returns the `id` of an `OptionValueWithId` in `options` with the given `value`
function getIdByValue(options: Array<Option>, value: string): Id {
  for (const option of options) {
    if ('value' in option) {
      if (option.value === value) {
        return option.id
      }
    }
  }
  return INVALID_ID
}

// Returns `true` if `value` is a substring of `options[i].value` in `options`, else `false`
function isValidValue(options: Array<Option>, value: string): boolean {
  if (value === EMPTY_STRING) {
    return true
  }
  for (const option of options) {
    if ('value' in option) {
      if (option.value.toLowerCase().indexOf(value.toLowerCase()) === 0) {
        return true
      }
    }
  }
  return false
}

// Returns the `OptionValueWithId` in `options` with the given `id`, else `null`
function findOptionValueById(
  options: Array<Option>,
  id: string
): null | OptionValueWithId {
  for (const option of options) {
    if ('id' in option && option.id === id) {
      return option
    }
  }
  return null
}

// Returns the index of the `OptionValueWithId` in `options` with the given `id`, else `-1`
function getIndexById(options: Array<Option>, id: string): number {
  let index = 0
  for (const option of options) {
    if ('id' in option && option.id === id) {
      return index
    }
    index += 1
  }
  return -1
}

// Returns the `Id` of the `OptionValueWithId` _before_ the `OptionValueWithId` in `options` with the given `id`
function computePreviousId(options: Array<Option>, id: Id): Id {
  if (id === INVALID_ID) {
    const result = findOptionValueAtOrBeforeIndex(options, options.length - 1)
    return result === null ? null : result.id
  }
  const index = getIndexById(options, id)
  if (index === -1) {
    throw new Error(`No option with \`id\` ${id}`)
  }
  if (index === 0) {
    return null
  }
  const result = findOptionValueAtOrBeforeIndex(options, index - 1)
  return result === null ? null : result.id
}

// Returns the `Id` of the `OptionValueWithId` _after_ the `OptionValueWithId` in `options` with the given `id`
function computeNextId(options: Array<Option>, id: Id): Id {
  if (id === INVALID_ID) {
    const result = findOptionValueAtOrAfterIndex(options, 0)
    return result === null ? null : result.id
  }
  const index = getIndexById(options, id)
  if (index === -1) {
    throw new Error(`No option with \`id\` ${id}`)
  }
  if (index === options.length - 1) {
    return null
  }
  const result = findOptionValueAtOrAfterIndex(options, index + 1)
  return result === null ? null : result.id
}

// Returns the `OptionValueWithId` in `options` at or _before_ the `index`, else `null`
function findOptionValueAtOrBeforeIndex(
  options: Array<Option>,
  index: number
): null | OptionValueWithId {
  if (index < 0) {
    throw new Error('`index` < 0')
  }
  if (index > options.length - 1) {
    throw new Error('`index` > `options.length` - 1')
  }
  return findLastOptionValue(options.slice(0, index + 1))
}

// Returns the `OptionValueWithId` in `options` at or _after_ the `index`, else `null`
function findOptionValueAtOrAfterIndex(
  options: Array<Option>,
  index: number
): null | OptionValueWithId {
  if (index < 0) {
    throw new Error('`index` < 0')
  }
  if (index > options.length - 1) {
    throw new Error('`index` > `options.length` - 1')
  }
  return findFirstOptionValue(options.slice(index))
}

// Returns the first `OptionValueWithId` encountered in `options`, else `null`
function findFirstOptionValue(
  options: Array<Option>
): null | OptionValueWithId {
  for (const option of options) {
    if ('id' in option && option.disabled !== true) {
      return option
    }
  }
  return null
}

// Returns the last `OptionValueWithId` encountered in `options`, else `null`
function findLastOptionValue(options: Array<Option>): null | OptionValueWithId {
  return findFirstOptionValue(options.slice().reverse())
}

function updateMenuElementMaxHeight(
  rootElement: HTMLDivElement,
  menuElement: HTMLDivElement,
  top: boolean
) {
  const rootElementTop = rootElement.getBoundingClientRect().top
  const maxHeight =
    top === true
      ? rootElementTop - MENU_VERTICAL_MARGIN
      : window.innerHeight -
        rootElementTop -
        rootElement.offsetHeight -
        MENU_VERTICAL_MARGIN
  menuElement.style.maxHeight = `${maxHeight}px`
}
