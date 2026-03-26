const VALID_SKILLS = new Set(['ux', '3d', 'game', 'brand'])
const VALID_SIZES = new Set(['featured', 'half', 'small'])
const COLOR_KEY_RE = /^ana-(?:[1-9]|1[0-2])$/

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function isOptionalString(value) {
  return value === undefined || value === null || isNonEmptyString(value)
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

export function validateProjects(data) {
  const errors = []

  if (!Array.isArray(data)) {
    return { ok: false, errors: ['projects: expected array'] }
  }

  const ids = new Set()
  const nums = new Set()

  data.forEach((project, index) => {
    const basePath = `projects[${index}]`

    if (!isPlainObject(project)) {
      pushError(errors, basePath, 'expected object')
      return
    }

    if (!isNonEmptyString(project.id)) {
      pushError(errors, `${basePath}.id`, 'expected non-empty string')
    } else if (ids.has(project.id)) {
      pushError(errors, `${basePath}.id`, `duplicate id "${project.id}"`)
    } else {
      ids.add(project.id)
    }

    if (!isNonEmptyString(project.num)) {
      pushError(errors, `${basePath}.num`, 'expected non-empty string')
    } else if (!/^\d{2}$/.test(project.num)) {
      pushError(errors, `${basePath}.num`, 'expected two-digit string')
    } else if (nums.has(project.num)) {
      pushError(errors, `${basePath}.num`, `duplicate num "${project.num}"`)
    } else {
      nums.add(project.num)
    }

    if (!isNonEmptyString(project.category)) {
      pushError(errors, `${basePath}.category`, 'expected non-empty string')
    }

    if (!isNonEmptyString(project.title)) {
      pushError(errors, `${basePath}.title`, 'expected non-empty string')
    }

    if (!isOptionalString(project.desc)) {
      pushError(errors, `${basePath}.desc`, 'expected string or null')
    }

    validateStringArray(project.tags, `${basePath}.tags`, errors)

    if (!Array.isArray(project.skills)) {
      pushError(errors, `${basePath}.skills`, 'expected array of strings')
    } else if (project.skills.length === 0) {
      pushError(errors, `${basePath}.skills`, 'expected at least one skill')
    } else {
      project.skills.forEach((skill, sIndex) => {
        if (!VALID_SKILLS.has(skill)) {
          pushError(errors, `${basePath}.skills[${sIndex}]`, 'invalid skill')
        }
      })
    }

    if (!VALID_SIZES.has(project.size)) {
      pushError(errors, `${basePath}.size`, 'expected featured, half, or small')
    }

    if (!isNonEmptyString(project.colorKey) || !COLOR_KEY_RE.test(project.colorKey)) {
      pushError(errors, `${basePath}.colorKey`, 'expected ana-1 through ana-12')
    }

    if (!isOptionalString(project.role)) {
      pushError(errors, `${basePath}.role`, 'expected string or null')
    }

    if (!isOptionalString(project.duration)) {
      pushError(errors, `${basePath}.duration`, 'expected string or null')
    }

    if (!isOptionalString(project.type)) {
      pushError(errors, `${basePath}.type`, 'expected string or null')
    }

    if (!isOptionalString(project.brief)) {
      pushError(errors, `${basePath}.brief`, 'expected string or null')
    }

    if (!isOptionalString(project.heroImage)) {
      pushError(errors, `${basePath}.heroImage`, 'expected string or null')
    }

    if (!isOptionalString(project.behanceUrl)) {
      pushError(errors, `${basePath}.behanceUrl`, 'expected string or null')
    }
  })

  return { ok: errors.length === 0, errors }
}
