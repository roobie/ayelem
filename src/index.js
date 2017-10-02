const csjs = require('csjs')
const yo = require('yo-yo')

const Event = require('geval')
const window = require('global/window')
const document = require('global/document')
const location = window.location

const Enum = require('enum')

const api = require('./api.js')

const normalize = require('./styles/normalize.js')

const onHashChange = Event(broadcast => {
  window.onhashchange = broadcast
})

const styles = csjs`
* {
  box-sizing: border-box;
}

.flex {
  display: flex;
  border: 1px solid red;
}

.horizontal {
  flex-direction: row;
}

.vertical {
  flex-direction: column;
}

.row extends .flex, .horizontal { }
.col extends .flex, .vertical { }

${Enum.Range(1, 13).map((_, n) => `.col${n + 1} {
  flex: ${n + 1};
}`).join('')}
`


document.addEventListener('DOMContentLoaded', () => {
  const styleElement = yo`<style>
    ${csjs.getCss(normalize)}
    ${csjs.getCss(styles)}
  </style>`
  document.head.appendChild(styleElement)

  const rootElement = layout()
  document.body.appendChild(rootElement)

  onHashChange(() => {
    yo.update(rootElement, layout())
  })
})

function layout () {
  return yo`
<div class="${styles.row}">

  <div class="${styles.col} ${styles.col3}">
    ${navigation()}
  </div>

  <div class="${styles.col} ${styles.col9}">
    ${routeView()}
  </div>

</div>`
}

function routeView () {
  return yo`<div>
${(() => {
  switch (location.hash) {
    case '#/systems': return systemsView()
    default: return 'empty'
  }
})()}
</div>`
}

function systemsView (state = {systems: []}) {
  if (!state.inited) {
    init()
  }

  const element = yo`
<div>
  <h2>systems ${state.inited ? '[loaded]' : '[loading]'}</h2>
  <div>
    ${state.systems.map(system => yo`
      <h3>${system.title}</h3>
    `)}
  </div>
</div>
`
  return element

  function init () {
    api.systems.list()
      .then(systems => {
        const newEl = systemsView({
          inited: true,
          systems
        })
        yo.update(element, newEl)
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
    <a class="${styles.row}"
       href="#${node.path}"
       title="${node.title}">${node.title}</a>
  `)}
</div>
`
}
