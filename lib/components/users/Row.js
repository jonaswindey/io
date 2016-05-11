import React, {Component, PropTypes} from 'react'
// import moment from 'moment'
import debug from 'debug'

class Row extends Component {
  static contextTypes = {
  };

  static propTypes = {
    group: PropTypes.any,
    user: PropTypes.any,
    columns: PropTypes.array
  };

  _tableClick(user) {
    debug('dev')('row :: _tableClick : ' + this.props.group + ' - ' + user._id)
    /*this.context.router
      .transitionTo('/users/' + this.props.group + '/detail/'+user._id)*/
    this.history.push('/users/' + this.props.group + '/detail/'+user._id)
  }

  _getAttribute(key) {
    const attribute = this.props.user.attributes.find(_attribute => {
      return _attribute.attribute.key === key
    })
    if (attribute) return attribute.value
  }

  render() {
    return (
      <tr style={{cursor: 'pointer'}}
          onClick={() => this._tableClick(this.props.user)}>
        {
          this.props.columns.map((column) => {
            if (column.type === 'field')
              return (<td key={column.key}>{this.props.user[column.key]}</td>)
            else if (column.type === 'attribute')
              return (<td key={column.key}>{this._getAttribute(column.key)}</td>)
            else
              return (<td key={column.key}>Column type: {column.type}</td>)
          })}
      </tr>
    )
  }
}

export default Row
