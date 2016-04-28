export default function logger ({}) {
  return next => action => {
    next(action)
    /*console.group()
    console.log('will dispatch', action)*/
    //const result = next(action)
    // console.log('state after dispatch', getState())
    //console.groupEnd()
    // return result
  }
}
