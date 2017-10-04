const csjs = require('csjs')

const styles = require('styles')
const SimpleTable = require('components/simple_table')

module.exports = {
  getStyleElement: function (document) {
    const el = document.createElement('style')
    el.textContent = [
      csjs.getCss(styles.normalize),
      csjs.getCss(styles.base),
      csjs.getCss(styles.layout),
      csjs.getCss(styles.common),

      csjs.getCss(SimpleTable.style),
    ].join('\n')

    return el
  }
}
