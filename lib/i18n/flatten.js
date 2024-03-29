export default function flattenMessages(nestedMessages, prefix = '') {

  //console.log('nestedMessages:')
  //console.log(nestedMessages)

  const messages =  Object.keys(nestedMessages).reduce((messages, key) => {
    let value = nestedMessages[key]
    let prefixedKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'string')
      messages[prefixedKey] = value
    else
      Object.assign(messages, flattenMessages(value, prefixedKey))
    return messages
  }, {})

  //console.log('messages:')
  //console.log(messages)

  return messages
}
