import { h } from 'preact'

import { Preview } from '../preview.js'

export default {
  parameters: {
    fixedWidth: true
  },
  title: 'Components/Preview'
}

export const Default = function () {
  return <Preview>foo</Preview>
}

export const Overflow = function () {
  return (
    <Preview>
      foo
      <br />
      bar
      <br />
      baz
      <br />
      qux
      <br />
      quux
      <br />
      quuux
      <br />
      quuuux
      <br />
      quuuuux
      <br />
      quuuuuux
    </Preview>
  )
}
