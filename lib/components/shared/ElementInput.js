'use strict'

const React = require('react')
const Formsy = require('formsy-react')
const {FormControl, FormGroup, ControlLabel, Col, InputGroup, Checkbox} = require('react-bootstrap')

import { FormattedMessage } from 'react-intl'
import europe from 'config/europe'

module.exports = React.createClass({
  mixins: [Formsy.Mixin],
  changeValue(event) {
    if (this.props.type === 'checkbox')
      this.setValue(!this.getValue())

    else
      this.setValue(event.currentTarget.value)

    if (this.props.onSelectChange) this.props.onSelectChange(event)
    if (this.props.onValueChange) this.props.onValueChange(event)
  },
  validate() {
    if (!this.props.validationCountry) return true
    else {
      const country = europe.find(country => country.value === this.props.validationCountry)
      if (country)
        return this.getValue().length === country.length ||
         country.length === 0 ||
         (country.length instanceof Array && country.length.indexOf(this.getValue().length) > -1)
      return false
    }
  },
  componentWillReceiveProps(props) {
    if (props.validationCountry) {
      const country = europe.find(country => country.value === this.props.validationCountry)
      this.setState({country})
    }
  },
  getDefaultProps() {
    return {
      labelClassName: 'col-xs-4',
      wrapperClassName: 'col-xs-8'
    }
  },
  renderIcon() {
    if (this.props.icon)
      return <div>{this.props.label}&nbsp;&nbsp;<img width="25" src={this.props.icon} /></div>

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
    const validationState = this.showRequired() ? 'warning' : this.showError() ? 'error' : null
    /* success */
    const errorMessage = this.getErrorMessage()

    return (
      <div className={className}>
        <FormGroup controlId="formHorizontalEmail" validationState={validationState}>
          <Col componentClass={ControlLabel} className={this.props.labelClassName}>
            {this.renderLabel()}
          </Col>
          <Col className={this.props.wrapperClassName}>
            {this.props.type !== 'select' && this.props.type !== 'checkbox' &&
              <InputGroup>
                {this.state.country  && <InputGroup.Addon>{this.state.country.code}</InputGroup.Addon>}
                <FormControl
                  hasFeedback
                  multiple={false}
                  type={this.props.type}
                  onChange={this.changeValue} value={this.getValue()}
                  checked={this.getValue() === true}
                  disabled={this.props.disabled}
                  help={errorMessage}>
                  {this.props.children}
                </FormControl>
              </InputGroup>
            }
            {this.props.type === 'select' &&
              <FormControl
                hasFeedback
                multiple={false}
                componentClass="select"
                onChange={this.changeValue} value={this.getValue()}
                checked={this.getValue() === true}
                disabled={this.props.disabled}
                help={errorMessage}>
                {this.props.children}
              </FormControl>
            }
            {this.props.type === 'checkbox' &&
              <Checkbox
                hasFeedback
                multiple={false}
                componentClass="select"
                onChange={this.changeValue} value={this.getValue()}
                checked={this.getValue() === true}
                disabled={this.props.disabled}
                help={errorMessage}>
                {this.props.checkboxLabel}
              </Checkbox>
            }
          </Col>
        </FormGroup>
      </div>
    )
  }
})
