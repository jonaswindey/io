export function put (key, value) {
  try {
    window.localStorage.setItem(key, value)
  }
  catch (e) {return null}
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
  try {
    return window.localStorage.removeItem(key)
  }
  catch (e) {return null}
}

export function clear () {
  try {
    window.localStorage.clear()
  }
  catch (e) {return null}
}
