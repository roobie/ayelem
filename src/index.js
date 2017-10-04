const csjs = require('csjs')
const yo = require('yo-yo')
const hyper = require('hyperhtml/index')
const {bind, wire} = hyper
const _ = require('lodash')

const Event = require('geval')
const window = require('global/window')
const document = require('global/document')
const location = window.location

const api = require('api')
const {className} = require('utility')
const navigation = require('navigation')

const styles = require('styles')

const SimpleTable = require('components/simple_table')

const onHashChange = Event(broadcast => {
  window.onhashchange = broadcast
})

document.addEventListener('DOMContentLoaded', () => {
  const styleElement = yo`<style>
    ${csjs.getCss(styles.normalize)}
    ${csjs.getCss(styles.base)}
    ${csjs.getCss(styles.layout)}
    ${csjs.getCss(styles.common)}
    ${csjs.getCss(SimpleTable.style)}
  </style>`
  document.head.appendChild(styleElement)

  if (location.hash.length <= 1) {
    location.hash = '#/'
  }

  update()
  onHashChange(update)
})

function update () {
  bind(document.body)`${Layout()}`
}

function Layout () {
  return wire()`
<div class="${styles.layout.row}">

  <div class="${styles.layout.col3}">
    ${Navigation()}
  </div>

  <div class="${styles.layout.col9}">
    ${CurrentView()}
  </div>

</div>`
}

function CurrentView () {
  return wire()`
    ${getView()}`

  function getView () {
    switch (location.hash.slice(1)) {
      case '/': return IndexView()
      case '/systems': return SystemsView()
      default: return NotFoundView()
    }
  }
}

function SystemsView (props = {}) {
  if (!props.initialized) {
    init()
  }

  return wire()`
    ${{
      any: api.systems.list()
        .then(result => new SimpleTable({
          items: result,
          columns: [
            {title: 'Title', property: 'title'},
            {title: 'created'}
          ]
        })),
      placeholder: 'Loading'
    }}`

  function init() {

  }
}

function NotFoundView () {
  return wire()`
  <div>
    <h1>Nothing to see here</h1>
  </div>`
}

function IndexView () {
  return wire()`
  <div>
    <h1>Index</h1>
  </div>`
}

function Navigation (props) {
  return wire()`
  <div>
    ${navigation.map(NavigationNode)}
  </div>`
}

function NavigationNode (props) {
  const route = `#${props.route}`
  return wire()`
  <a href="${route}" class="${getClasses()}">
    ${props.title}
  </a>`

  function getClasses () {
    return className({
      [styles.layout.row]: true,
      [styles.common.selected]: route === location.hash
    })
  }
}
