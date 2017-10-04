
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
    const html = this.html.bind(this)
    return html`
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
            const classes = [styles.states.clickable, styles.states.unselectable].join(' ')
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
        [styles.states.clickable]: true,
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
