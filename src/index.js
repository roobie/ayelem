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
const navigation = require('navigation')

const normalize = require('./styles/normalize.js')
const layoutStyles = require('./styles/layout.js')
const statesStyles = require('./styles/states.js')

const onHashChange = Event(broadcast => {
  window.onhashchange = broadcast
})

document.addEventListener('DOMContentLoaded', () => {
  const styleElement = yo`<style>
    ${csjs.getCss(normalize)}
    ${csjs.getCss(layoutStyles)}
    ${csjs.getCss(statesStyles)}
  </style>`
  document.head.appendChild(styleElement)

  if (location.hash.length <= 1) {
    location.hash = '#/'
  }

  update()
  onHashChange(update)

  function update () {
    bind(document.body)`${Layout()}`
  }
})

function Layout () {
  return wire()`
<div class="${layoutStyles.row}">

  <div class="${layoutStyles.col3}">
    ${Navigation()}
  </div>

  <div class="${layoutStyles.col9}">
    ${CurrentView()}
  </div>

</div>`
}

function CurrentView () {
  return wire()`
  <div>
    ${getView()}
  </div>`

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
  <div>
    ${{
      any: api.systems.list()
        .then(result => new SimpleCrudList({
          items: result,
          columns: ['title', 'created']
        })),
      placeholder: 'Loading'
    }}
  </div>`

  function init() {

  }
}


class SimpleCrudList extends hyper.Component {
  get defaultState () {
    return {
      items: [],
      columns: [],
      lastSortedBy: null,
      sortedBy: null,
      descending: false,
    }
  }

  constructor (props) {
    super()
    this.setState(props)
  }

  render() {
    return this.html`
    <table>
      <thead>
        ${HRow.call(this, this.state.columns)}
      </thead>
      <tbody>
        ${getData.call(this).map(item => BRow({item, columns: this.state.columns}))}
      </tbody>
    </table>`

    function getData () {
      let result = _(this.state.items)
        .sortBy(this.state.sortedBy || this.state.columns[0])

      if (this.state.descending) {
        result = result.reverse()
      }

      return result.valueOf()
    }

    function HRow (columns) {
      return wire()`
        <tr>
          ${columns.map(th => wire()`<th onclick=${click(th).bind(this)}>${th}</th>`)}
        </tr>`

      function click (th) {
        return function () {
          this.setState({
            sortedBy: th,
            lastSortedBy: this.state.sortedBy,
            descending: th === this.state.sortedBy ? !this.state.descending : true
          })
        }
      }
    }

    function BRow ({item, columns}) {
      return wire()`
        <tr>
          ${columns.map(col => `<td>${item[col]}</td>`)}
        </tr>`
    }
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
    return [
      layoutStyles.row,
      route === location.hash ? statesStyles.selected: null
    ].filter(Boolean).join(' ')
  }
}
