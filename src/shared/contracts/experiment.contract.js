const YEAR_RE = /^\d{4}$/

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function pushError(errors, path, message) {
  errors.push(`${path}: ${message}`)
}

function validateStringArray(value, path, errors) {
  if (!Array.isArray(value)) {
    pushError(errors, path, 'expected array of strings')
    return
  }

  value.forEach((entry, index) => {
    if (!isNonEmptyString(entry)) {
      pushError(errors, `${path}[${index}]`, 'expected non-empty string')
    }
  })
}

export function validateExperiments(data) {
  const errors = []

  if (!Array.isArray(data)) {
    return { ok: false, errors: ['experiments: expected array'] }
  }

  const ids = new Set()

  data.forEach((experiment, index) => {
    const basePath = `experiments[${index}]`

    if (!isPlainObject(experiment)) {
      pushError(errors, basePath, 'expected object')
      return
    }

    if (!isNonEmptyString(experiment.id)) {
      pushError(errors, `${basePath}.id`, 'expected non-empty string')
    } else if (ids.has(experiment.id)) {
      pushError(errors, `${basePath}.id`, `duplicate id "${experiment.id}"`)
    } else {
      ids.add(experiment.id)
    }

    if (!isNonEmptyString(experiment.title)) {
      pushError(errors, `${basePath}.title`, 'expected non-empty string')
    }

    if (!isNonEmptyString(experiment.description)) {
      pushError(errors, `${basePath}.description`, 'expected non-empty string')
    }

    if (!isNonEmptyString(experiment.url)) {
      pushError(errors, `${basePath}.url`, 'expected non-empty string')
    } else if (!/^https?:\/\//.test(experiment.url)) {
      pushError(errors, `${basePath}.url`, 'expected http(s) URL')
    }

    validateStringArray(experiment.tags, `${basePath}.tags`, errors)

    if (!isNonEmptyString(experiment.year)) {
      pushError(errors, `${basePath}.year`, 'expected non-empty string')
    } else if (!YEAR_RE.test(experiment.year)) {
      pushError(errors, `${basePath}.year`, 'expected 4 digit year')
    }
  })

  return { ok: errors.length === 0, errors }
}
