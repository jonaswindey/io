import React, {Component, PropTypes} from 'react'
import {Well, Button, Row, Col} from 'react-bootstrap'
import {Form} from 'formsy-react'
import ElementInput from 'components/shared/ElementInput'
import {connect} from 'react-redux'
import * as actions from 'actions/users'
import debug from 'debug'

@connect(state => ({
  users: state.users,
}))
class User extends Component {

  static contextTypes = {
    history: PropTypes.any
  }

  componentDidMount() {
    this.props.dispatch(actions.fetchUser(this.props.params.id))
  }

  componentWillReceiveProps(props) {
    debug('dev')(props)
    if (props.params.id !== this.props.params.id)
      this.props.dispatch(actions.fetchUser(props.params.id))
  }

  handleSubmit(data) {
    debug('dev')('handleSubmit:')
    debug('dev')(data)

    /*const product = this.props.products.product

    product.reference = data.reference

    product.translations.forEach(translation => {
      translation.value = data[translation.key]
    })

    product.variants[0].price = parseInt(data.price)
    product.variants[0].stock = parseInt(data.stock)
    product.variants[0].unlimited = data.unlimited

    this.props.dispatch(productActions.updateProduct(product))*/
  }

  remove() {
    this.props.dispatch(actions.remove(this.props.params.id))
    this.goBack()
  }

  goBack() {
    this.context.history.pushState(null, '/admin/users')
  }

  render() {
    if (!this.props.users.userLoaded) return <div />
    return (
      <div className="col-md-5">
        <Well>
          <Row>
            <Form onSubmit={::this.handleSubmit}>
              <Col lg={12}>
                <div className="form-horizontal">
                  <ElementInput type="text" label="First name" name="firstName"
                                required
                                value={this.props.users.user.firstName || ''}/>
                  <ElementInput type="text" label="First name" name="lastName"
                    required
                    value={this.props.users.user.lastName || ''}/>
                  <ElementInput type="text" label="E-mail" name="email"
                    required
                    value={this.props.users.user.email || ''}/>
                </div>
              </Col>
              <div className="col-xs-12">
                <Button bsStyle="primary" className="pull-right" onClick={() => this.goBack()}
                  style={{marginLeft: 5}}>Close</Button>
                <Button bsStyle="success" className="pull-right" type="submit"
                  style={{marginLeft: 5}}>Save user</Button>
                <Button bsStyle="warning" className="pull-right" onClick={::this.remove}
                  type="button">Remove</Button>
              </div>
            </Form>
          </Row>
        </Well>
      </div>
    )
  }
}

export default User
