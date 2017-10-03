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

const styles = require('styles')

const onHashChange = Event(broadcast => {
  window.onhashchange = broadcast
})

document.addEventListener('DOMContentLoaded', () => {
  const styleElement = yo`<style>
    ${_.values(styles).map(csjs.getCss)}
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
        .then(result => new SimpleCrudList({
          items: result,
          columns: ['title', 'created']
        })),
      placeholder: 'Loading'
    }}`

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
      selectedItems: [],
    }
  }

  constructor (props) {
    super()
    this.setState(props)
  }

  render() {
    return this.html`
    <div>
      <aside>
        <button type="button">+ Create</button>
        <button type="button">⧉ Open</button>
        <button type="button">✎ Edit</button>
        <button type="button">× Delete</button>
      </aside>
      <table>
        <thead>
          ${HRow.call(this, this.state.columns)}
        </thead>
        <tbody>
          ${getData.call(this).map(item => BRow.call(this, {item, columns: this.state.columns}))}
        </tbody>
      </table>
    </div>`

    function getData () {
      let result = _(this.state.items)
        .orderBy([this.state.sortedBy || this.state.columns[0]], [this.state.descending ? 'desc' : 'asc'])

      return result.valueOf()
    }

    function HRow (columns) {
      return wire()`
        <tr>
          <th>☐</th>
          ${columns.map(th => {
            const classes = [styles.states.clickable].join(' ')
            return wire()`<th class=${classes} onclick=${click(th).bind(this)}>${th}</th>`
          })}
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
      const isSelected = _.includes(this.state.selectedItems, item)
      const classes = className({
        [styles.states.selected]: isSelected
      })

      return wire()`
        <tr class=${classes} onclick=${click.bind(this)}>
          <td>${isSelected ? '✓' : ''}</td>
          ${columns.map(col => `<td>${item[col]}</td>`)}
        </tr>`

      function click () {
        this.toggleSelected(item)
      }
    }
  }

  toggleSelected (item) {

    const isSelected = this.state.selectedItems.indexOf(item) !== -1
    if (isSelected) {
      this.setState({selectedItems: this.state.selectedItems.filter(x => x !== item)})
    } else {
      this.setState({selectedItems: this.state.selectedItems.concat([item])})
    }
  }
}

function className (hash) {
  const result = []
  for (let k in hash) {
    if (hash[k]) {
      result.push(k)
    }
  }
  return result.join(' ')
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
      styles.layout.row,
      route === location.hash ? styles.states.selected: null
    ].filter(Boolean).join(' ')
  }
}
