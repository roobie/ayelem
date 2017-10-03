const csjs = require('csjs')

const _ = require('lodash')

module.exports = csjs`
* {
  box-sizing: border-box;
}

html, body {
  font-family: monospace;
}

table {
  width: 100%;
}

a,
a:visited {
  color: indigo;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

.flex {
  display: flex;
  border: 1px solid silver;
}

.horizontal {
  flex-direction: row;
}

.vertical {
  flex-direction: column;
}

.row extends .flex, .horizontal { }
.col extends .flex, .vertical { }

${_.range(1, 13).map((_, n) => `.col${n + 1} extends .col {
  flex: ${n + 1};
}`).join('')}
`
