const csjs = require('csjs')

const Enum = require('enum')

module.exports = csjs`
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
