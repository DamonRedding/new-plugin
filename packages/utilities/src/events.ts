const eventHandlers: {
  [id: string]: {
    eventName: string
    eventHandler: (...args: Array<any>) => void
  }
} = {}

let currentId = 0

/**
 * Registers an `eventHandler` for the given `eventName`.
 *
 * @returns Returns a function for deregistering the `eventHandler`.
 * @category Events
 */
export function on(
  eventName: string,
  eventHandler: (...args: Array<any>) => void
): () => void {
  const id = `${currentId++}`
  eventHandlers[id] = { eventHandler, eventName }
  return function () {
    delete eventHandlers[id]
  }
}

/**
 * Registers an `eventHandler` that will run at most once for the given
 * `eventName`.
 *
 * @returns Returns a function for deregistering the `eventHandler`.
 * @category Events
 */
export function once(
  eventName: string,
  eventHandler: (...args: Array<any>) => void
): () => void {
  let done = false
  return on(eventName, function (...args) {
    if (done === true) {
      return
    }
    done = true
    eventHandler(...args)
  })
}

/**
 * Calling `emit` in the main context invokes the event handler for the
 * matching `eventName` in your UI. Correspondingly, calling `emit` in your
 * UI invokes the event handler for the matching `eventName` in the main
 * context.
 *
 * All `args` passed after `eventName` will be directly applied on the
 * event handler.
 *
 * @category Events
 */
export const emit: (eventName: string, ...args: Array<any>) => void =
  typeof window === 'undefined'
    ? function (...args) {
        figma.ui.postMessage(args)
      }
    : function (...args) {
        window.parent.postMessage(
          {
            pluginMessage: args
          },
          '*'
        )
      }

function invokeEventHandler(eventName: string, args: Array<any>) {
  for (const id in eventHandlers) {
    if (eventHandlers[id].eventName === eventName) {
      eventHandlers[id].eventHandler.apply(null, args)
    }
  }
}

if (typeof window === 'undefined') {
  figma.ui.onmessage = function ([eventName, ...args]: [
    string,
    Array<any>
  ]): void {
    invokeEventHandler(eventName, args)
  }
} else {
  window.onmessage = function (event: MessageEvent): void {
    if (typeof event.data.pluginMessage === 'undefined') {
      return
    }
    const [eventName, ...args]: [string, Array<any>] = event.data.pluginMessage
    invokeEventHandler(eventName, args)
  }
}