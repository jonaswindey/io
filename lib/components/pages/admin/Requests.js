import React, {Component} from 'react'
import SearchableRequestTable from 'components/admin/requests/SearchableRequestTable'
import {connect} from 'react-redux'
import * as inquiryActions from 'actions/inquiries'
import debug from 'debug'

@connect(state => ({
  inquiries: state.inquiries,
}))
class Requests extends Component {

  componentDidMount() {
    debug('dev')('Requests :: componentDidMount()')
    this.props.dispatch(inquiryActions.fetchInquiries())
  }

  render() {
    debug('dev')('Requests :: render()')
    return (
      <div className="wrap">
        <div className="container">
          <div className="paper paper-curve-horiz request">
            <SearchableRequestTable
              inquiries={this.props.inquiries.inquiries}
              inquiriesLoaded={this.props.inquiries.inquiriesLoaded}/>
          </div>
        </div>
      </div>
    )
  }
}

export default Requests
