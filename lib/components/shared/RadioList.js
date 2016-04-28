import React from 'react'
import Formsy from 'formsy-react'
import RadioGroup from 'react-radio-group'
import {FormattedMessage} from 'react-intl'

module.exports = React.createClass({
  mixins: [Formsy.Mixin],

  changeValue(value) {
    this.setValue(value)
    this.setState({selectedValue: value})

    const event = {
      currentTarget: {
        value
      }
    }

    if (this.props.onSelectChange) this.props.onSelectChange(event)
    if (this.props.onValueChange) this.props.onValueChange(event)
  },

  renderLabel() {
    if (this.props.icon)
      return this.renderIcon()

    else if (this.props.translation)
      return <FormattedMessage id={this.props.translation} />
    else
      return this.props.label

  },

  render() {
    const className = this.showRequired() ? 'required' : this.showError() ? 'error' : null
    return (
      <div className="form-group">
        <label className="control-label col-xs-4">{this.renderLabel()}</label>
        <div className="col-xs-7">
          <div className={className} style={{paddingTop: 8}}>
            <RadioGroup name={this.props.key} selectedValue={this.state.selectedValue} onChange={this.changeValue}>
              {Radio => (
                <div>
                  {this.props.values.map(value => {
                    return (<div style={{float: 'left', marginRight: 10}}>
                            <label style={{fontWeight: 'normal'}}><Radio value={value} />&nbsp;{value}m</label></div>)
                  })}
                </div>
              )}
            </RadioGroup>
          </div>
        </div>
      </div>
    )
  }
})
