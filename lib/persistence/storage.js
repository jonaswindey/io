export function put (key, value) {
  window.localStorage.setItem(key, value)
}

export function get (key) {
  try {
    return window.localStorage.getItem(key)
  }
  catch (e) {
    return ''
  }
}

export function remove (key) {
  return window.localStorage.removeItem(key)
}

export function clear () {
  window.localStorage.clear()
}
