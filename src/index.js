const csjs = require('csjs')
const yo = require('yo-yo')
const hyper = require('hyperhtml')

const Event = require('geval')
const window = require('global/window')
const document = require('global/document')
const location = window.location

const api = require('api')

const normalize = require('./styles/normalize.js')
const layoutStyles = require('./styles/layout.js')

const onHashChange = Event(broadcast => {
  window.onhashchange = broadcast
})

document.addEventListener('DOMContentLoaded', () => {
  const styleElement = yo`<style>
    ${csjs.getCss(normalize)}
    ${csjs.getCss(layoutStyles)}
  </style>`
  document.head.appendChild(styleElement)

  const rootElement = layout()
  document.body.appendChild(rootElement)

  onHashChange(() => {
    yo.update(rootElement, layout())
  })
})

function layout (render) {
  return render`
<div class="${layoutStyles.row}">

  <div class="${layoutStyles.col} ${layoutStyles.col3}">
    ${navigation()}
  </div>

  <div class="${layoutStyles.col} ${layoutStyles.col9}">
    ${routeView()}
  </div>

</div>`
}

function routeView () {
  return yo`
  <div>
    ${getView()}
  </div>`

  function getView() {
    switch (location.hash.slice(1)) {
      case '':         return indexView()
      case '/systems': return systemsView()
      default:         return notFoundView()
    }
  }
}

function indexView () {
  return yo`
  <div>
    <h4>Index</h4>
  </div>`
}

function notFoundView () {
  return yo`
  <div>
    <h4>Not found</h4>
  </div>`
}

function systemsView (state = {systems: []}) {
  const id = Math.random().toString()
  const element = yo`
  <div id="${id}">
    <h2>systems ${state.inited ? '[loaded]' : '[loading]'}</h2>
    <div>
      ${state.systems.map(system => yo`
        <h3>${system.title}</h3>
      `)}
    </div>
  </div>`

  if (!state.inited) {
    init()
  }

  return element

  function init () {
    api.systems.list()
      .then(systems => {
        const newElement = systemsView({
          inited: true,
          systems
        })
        yo.update(element, newElement)
      })
  }
}

function navigation () {
  const nodes = [
    {title: 'Systems', path: '/systems'},
    {title: 'Environments', path: '/environments'},
    {title: 'Releases', path: '/releases'},
  ]
  return yo`
<div>
  ${nodes.map(node => yo`
    <a class="${layoutStyles.row}"
       href="#${node.path}"
       title="${node.title}">${node.title}</a>
  `)}
</div>
`
}
