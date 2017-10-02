
const baseModel = model(null, {
  id: value(Number, {sequential: true, primaryKey: true, auto: true}),
  uuid: value(UUID, {unique: true, auto: true})
})

const system = model(baseModel, {
  parent: reference('self', {optional: true}),
  title: value(String)
})

const environment = model(baseModel, {
  system: reference(system),
  title: value(String)
})

const configuration = model(baseModel, {
  environment: reference(environment),
  key: value(String),
  value: value(String)
})

const release = model(baseModel, {
  system: reference(system),
  targetVersion: value(String)
})

const upgrade = model(baseModel, {
  release: reference(release),
  fromVersion: value(String),
  targetVersion: computed('release.targetVersion')
})

const upgradeAction = model(baseModel, {
  upgrade: reference(upgrade),
  notes: value(String)
})

const deploy = model(baseModel, {
  release: reference(release),
  environment: reference(environment),
  completed: value(Date),
  successful: value(Boolean)
})

const documentation = model(baseModel, {
  release: reference(release),
  notes: value(String)
})

const file = model(baseModel, {
  data: value(Binary)
})

const documentation_file = model(baseModel, {
  documentation: reference(documentation),
  file: reference(file)
})

const upgradeAction_file = model(baseModel, {
  upgradeAction: reference(upgradeAction),
  file: reference(file)
})

module.exports = {
  system,
  environment,
  configuration,
  release,
  deploy,
  upgrade,
  documentation,
  file,
  documentation_file,
  upgradeAction,
  upgradeAction_file,
}

function UUID () { }
function Binary () { }

function reference (ref, constraints = {}) {
  return true
}

function value (type, constraints = {}) {
  return true
}

function computed (path) {
  return true
}

function model (base, model, constraints = {}) {
  return true
}
