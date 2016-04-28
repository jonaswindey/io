export function getValue(report, index, key) {
  return report[index][key]
}

export function getValueBoolean(report, index, orderIndex, key) {
  try {
    if (report[index]['order_'+orderIndex][key] === true) return 'yes'
    //else return 'no'
  }
  catch (e) { return '' }
}

export function getOrderValue(report, index, orderIndex, key, prefix = '', suffix = '') {
  try {
    let value = report[index]['order_'+orderIndex][key]
    if (prefix.length > 0) value = prefix + value
    if (suffix.length > 0) value = value + suffix
    return value
  }
  catch (e) { return '-' }
}

export function getProductValue(report, index, id) {
  try {
    let value = report[index]['products'][id]
    if (!value) value = 0
    return value
  }
  catch (e) { return '-' }
}
