const xtend = require('xtend')

const crud = (initialData = []) => {
  const data = initialData.slice(0)

  return {
    list: (predicate) => new Promise((resolve, reject) => {
      resolve(data.filter(predicate || (x => x)))
    }),
    single: (predicate) => new Promise((resolve, reject) => {
      const item = data.filter(predicate)[0]
      if (item) {
        resolve(item)
      } else {
        reject(new Error('not found'))
      }
    }),
    create: (model) => new Promise((resolve, reject) => {
      data.push(model)
      resolve()
    }),
    update: (id, model) => new Promise((resolve, reject) => {
      if (!data[id]) {
        reject(new Error('not found'))
      } else {
        data[id] = model
        resolve()
      }
    }),
    patch: (id, partial) => new Promise((resolve, reject) => {
      if (!data[id]) {
        reject(new Error('not found'))
      } else {
        xtend(data[id], partial)
        resolve()
      }
    }),
    delete: (id) => new Promise((resolve, reject) => {
      if (!data[id]) {
        reject(new Error('not found'))
      } else {
        data.splice(id, 1, null)
        resolve()
      }
    })
  }
}

module.exports = {
  systems: crud([
    {title: 'System A'},
    {title: 'System B'},
    {title: 'System C'},
    {title: 'System D'},
  ])
}
