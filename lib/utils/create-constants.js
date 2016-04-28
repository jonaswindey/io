export default function createConstants (...constants) {
  return constants.reduce((acc, constant) => {
    return Object.assign(acc, {
      [constant] : constant
    })
  }, {})
}
