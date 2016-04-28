import React, {Component, PropTypes} from 'react'
import Inquiry from 'components/inquiries/Inquiry'
import {Link} from 'react-router'
import {Button, Glyphicon, OverlayTrigger, Popover} from 'react-bootstrap'
import {FormattedMessage} from 'react-intl'
import {connect} from 'react-redux'
import * as inquiryActions from 'actions/inquiries'
import debug from 'debug'

@connect(state => ({
  inquiries: state.inquiries,
  products: state.products,
}))
class Request extends Component {

  static contextTypes = {
    history: PropTypes.any
  }

  componentDidMount() {
    this.props.dispatch(inquiryActions.fetchInquiry(this.props.params.id))
  }

  deleteInquiry() {
    debug('dev')('delete inquiry')
    const {history} = this.context
    this.props.dispatch(inquiryActions.updateInquiryStatus(this.props.params.id, 'deleted', history))
  }

  render() {
    debug('dev')('admin :: Request :: render')
    debug('dev')(this.props)
    return (
      <div className="wrap">
        <div className="container">
          <div className="paper paper-curve-horiz request">
            <h3>
              <Link to="admin/requests"><FormattedMessage id='header.requests' /></Link>/ &nbsp;
                <OverlayTrigger trigger='click' rootClose placement='bottom'
                  overlay={
                    <Popover id="confirm" title='Confirm'>
                      <div style={{textAlign: 'center'}}>
                        <p><FormattedMessage id='global.sure' />?</p>
                        <Button
                          bsSize="xsmall" key="delete" onClick={::this.deleteInquiry} bsStyle="danger">
                          <FormattedMessage id='global.yes' />
                        </Button>
                      </div>
                    </Popover>
                  }>
                  <Button bsStyle='danger' bsSize="xsmall">
                    <FormattedMessage id='global.remove' />&nbsp;
                      <Glyphicon glyph="remove"/>
                    </Button>
                  </OverlayTrigger>
                </h3>
                {
                  this.props.inquiries.inquiryLoaded &&
                  <Inquiry admin
                    inquiry={this.props.inquiries.inquiry}
                    user={this.props.inquiries.inquiry.creator}
                    orders={this.props.inquiries.orders}
                    products={this.props.products.products}
                    productsLoaded={this.props.products.productsLoaded}
                    productCategories={this.props.products.productCategories}
                    orderAttributesUpdating={this.props.inquiries.orderAttributesUpdating}
                    />
                }
          </div>
        </div>
      </div>
    )
  }
}

export default Request
