import debug from 'debug'
import {find} from 'lodash'
import moment from 'moment'

export function getAttributes(model, attributes, attributeValues = []) {
  debug('dev')('AttributeHelper :: getAttributes()')

  const findAttribute = (key) => {
    return find(attributes, attribute => {
      return attribute.key === key
    })
  }

  const findAttributeValue = (id) => {
    return find(attributeValues, value => {
      return value.attribute === id
    })
  }

  const _attributes = attributeValues
  for (let key in model)
    if (key && key.lastIndexOf('step_') === -1) // don't update the 'step'-attributes
    {
      const attribute = findAttribute(key)
      if (attribute) {
        // check current attributes if value exists
        const attributeValue = findAttributeValue(attribute._id)
        if (attributeValue)
          attributeValue.value = model[key]
        else
          _attributes.push({
            attribute,
            value: model[key]
          })
      }
    }

  return _attributes
}

export function flattenAttributes(model) {
  model.attributes.forEach(attribute => {
    if (attribute.attribute._id) attribute.attribute = attribute.attribute._id.toString()
  })
}

export function formatDates(model, format) {
  model.attributes.forEach(attribute => {
    if (attribute.value instanceof Date) attribute.value = moment(attribute.value).format(format)
  })
}
