import React, {Component, PropTypes} from 'react'
import t from 'tcomb-form'
import FileZone from './Filezone'
import classNames from 'classnames'
import { fetchOnUpdate } from 'decorators'
import Spinner from 'components/shared/Spinner'

const Form = t.form.Form

@fetchOnUpdate(['_id'], (params, actions) => {
  const { _id } = params
  if (_id !== 'new') actions.fetchUser(_id /*, {populate: 'creator contributors activity.user'} */)
  else actions.clearUser()
})
export default class Detail extends Component {

  static contextTypes = {
    router: PropTypes.any,
    intl: PropTypes.object
  };

  static propTypes = {
    users: PropTypes.any,
    actions: PropTypes.any,
    new: PropTypes.any,
    params: PropTypes.any
  };

  _submit(e) {
    let model = this.refs.form.getValue()
    e.preventDefault()
    if (model) {
      e.preventDefault()
      const userAttributes = this.props.users.userAttributes
      const user = this.props.users.user
      if (this.props.new)
        this.props.actions.create(model, userAttributes, this.context.router)
      else
        this.props.actions.update(user, model, userAttributes)
    }
  }

  _renderForm(model) {
    let component
    if (this.props.users.userLoaded && model)
      if (model.Model && model.Model)
        component = (
          <div className="ibox float-e-margins">
            <div className="ibox-title">
              <h5>{this.props.new ?
                'Create user' :
                'Update user'}
              </h5>
            </div>
            <div className="ibox-content">
              <div>
                <div className="form-horizontal">
                  <Form type={model.Model}
                        ref="form"
                        options={model.Options}
                        value={this.props.users.formValue}
                    />
                </div>
                <div className="row">
                  <p className='text-center'>
                    <button className="btn btn-primary" type="submit">
                      {this.props.new ?
                        'Create new' :
                        'Update'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
        else component = (<div></div>)
    else component = (<div>Loading...</div>)
    return component
  }

  render() {
    let component = <div />
    const model = require('./../../models/users/' + this.props.params.group + '_detail')
    const classes = classNames({
      'col-md-10': this.props.new,
      'col-md-offset-1': this.props.new,
      'col-md-6': !this.props.new
    })

    if (this.props.users.userLoaded)
      component = (
        <div className="wrapper">
          <form onSubmit={(e) => this._submit(e)}>
            <div className="row">
              <div className={classes}>
                {this._renderForm(model)}
              </div>
              <div className="col-md-6">
                <FileZone {...this.props}
                  userUpdating={this.props.users.userUpdating}
                  files={model.Files ? model.Files : []}
                  user={this.props.users.user}
                />
              </div>
            </div>
          </form>
        </div>
      )
      else component = (<div style={{width: '100px', marginLeft: 'auto', marginRight: 'auto'}}>
        <Spinner active dark />
      </div>)

    return component
  }
}
