import React, {Component} from 'react'
import {connect} from 'react-redux'
import * as reportActions from 'actions/reporting'
import Loader from 'react-loader'
import ReportingMenu from 'components/admin/reporting/ReportingMenu'
import TurnOver from 'components/admin/reporting/TurnOver'
import StandNames from 'components/admin/reporting/StandNames'
import FoodBank from 'components/admin/reporting/FoodBank'
import Exhibitors from 'components/admin/reporting/Exhibitors'

@connect(state => ({
  reporting: state.reporting,
}))
class Products extends Component {

  componentDidMount() {
    this.props.dispatch(reportActions.fetchReport('main'))
  }

  render() {
    let report

    switch (this.props.params.report) {
      case 'turnover':
        report = (<TurnOver {...this.props.reporting}/>)
        break
      case 'standnames':
        report = (<StandNames {...this.props.reporting}/>)
        break
      case 'foodbank':
        report = (<FoodBank {...this.props.reporting}/>)
        break
      case 'exhibitors':
        report = (<Exhibitors {...this.props.reporting}/>)
        break
    }

    return (
      <div className="wrap">
        <div className="container">
          <div className="paper paper-curve-horiz request">
            <div className="row">
              <div className="col-md-2">
                <ReportingMenu />
              </div>
              <div className="col-md-10">
                {!this.props.reporting.reportLoaded &&
                  <div style={{padding: 40}}>
                    <Loader loaded={this.props.reporting.reportLoaded}
                      lines={10} radius={10} length={7} color="#999" width={3}  />
                  </div>
                }
                {this.props.reporting.reportLoaded && report}
              </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default Products
