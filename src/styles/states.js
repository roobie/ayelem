const csjs = require('csjs')

const vars = require('./vars')

module.exports = csjs`
a.selected {
  color: seagreen;
}

table tbody tr td {
  padding: 0 ${vars.spacing.minor};
}
table tbody tr:hover td {
  background: silver;
}

table thead th {
  border-bottom: 1px solid silver;
}
table thead th:not(:last-child) {
  border-right: 1px solid silver;
}
`
