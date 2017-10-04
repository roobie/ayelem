const csjs = require('csjs')
const hyper = require('hyperhtml/index')
const {bind, wire} = hyper
const _ = require('lodash')

const Event = require('geval')
const window = require('global/window')
const document = require('global/document')
const location = window.location

const styleHandler = require('./style_handler')

const Layout = require('Layout')

const onHashChange = Event(broadcast => {
  window.onhashchange = broadcast
})

const onDOMContentLoaded = Event(broadcast => {
  document.addEventListener('DOMContentLoaded', broadcast)
})

function update () {
  bind(document.body)`${Layout()}`
}

onHashChange(update)
onDOMContentLoaded(() => {
  document.head.appendChild(styleHandler.getStyleElement(document))

  if (location.hash.length <= 1) {
    location.hash = '#/'
  }

  update()
})
