import React, {Component} from 'react'
import ResponsiveFixedDataTable from 'responsive-fixed-data-table'
import {Column} from 'fixed-data-table'
import {Doughnut} from 'react-chartjs'
import {Well} from 'react-bootstrap'
import {SortHeaderCell, DataListWrapper, sortIndexes, TextCell} from 'utils/tablehelper'
import {Row, Col, Form, FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap'

const progressOptions = {
  animationSteps: 3,
  showTooltips:true,
  maintainAspectRatio: true,
  segmentStrokeWidth : 1,
}

class TurnOver extends Component {
  constructor(props) {
    super(props)

    this._dataList = props.report
    this._defaultIndexes = []

    const size = this._dataList.length
    for (let index = 0; index < size; index++)
      this._defaultIndexes.push(index)

    this.state = {
      dataList: new DataListWrapper(this._defaultIndexes, this._dataList),
      colSortDirs: {},
      filter: '',
      language: '',
      status: ''
    }
  }

  filterData(filter) {
    const size = this._dataList.length
    const indexes = []

    for (let index = 0; index < size; index++) {
      const {exhibitorName, sector} = this._dataList[index]
      if (exhibitorName.toLowerCase().indexOf(filter) > -1 ||
          sector.toLowerCase().indexOf(filter) > -1)
        indexes.push(index)
    }

    this.setState({
      indexes,
      filter,
      dataList: new DataListWrapper(indexes, this._dataList),
    })
    return indexes
  }

  filterChange(e) {
    if (!e.target.value)
      this.setState({
        filteredDataList: this._dataList,
      })

    const filter = e.target.value.toLowerCase()
    this.filterData(filter)
  }

  clearFilter() {
    this.filterData('')
  }

  sortChange(columnKey, sortDir) {
    const indexes = this.filterData(this.state.filter)
    sortIndexes(this._dataList, indexes, columnKey, sortDir)

    this.setState({
      indexes,
      dataList: new DataListWrapper(indexes, this._dataList),
      colSortDirs: {
        [columnKey]: sortDir,
      },
    })
  }

  render() {
    const {dataList, colSortDirs} = this.state
    const {report, totals} = this.props

    if (report && report.length > 0)
      return (
        <div>
          <Well>
            <Row>
              <Col md={8}>
                <Form inline>
                  <FormGroup>
                    <ControlLabel style={{width: 100}}>Filter</ControlLabel>
                    <FormControl type="text" placeholder="Filter users"
                           value={this.state.filter}
                           onChange={::this.filterChange} />
                  </FormGroup>
                  &nbsp;<Button onClick={::this.clearFilter}>Clear</Button>
                </Form>
              </Col>
              {this.props.usersLoaded &&
                <Col md={4} className="text-right" style={{fontSize: 12, lineHeight: '14px'}}>
                  Total users: {this._dataList.length}<br />
                  Result: {dataList.getSize()}
                </Col>
              }
            </Row>
        </Well>
          <div className="row">
            <div className="col-sm-9" style={{height: 600, fontSize: 11}}>
              <ResponsiveFixedDataTable
                rowHeight={24}
                rowsCount={report.length}
                headerHeight={30}>
                <Column
                  columnKey="sector"
                  header={
                    <SortHeaderCell onSortChange={::this.sortChange} sortDir={colSortDirs.sector}>
                      Sector
                    </SortHeaderCell>
                  }
                  fixed
                  cell={<TextCell data={dataList} />}
                  width={150}
                />
                <Column
                  columnKey="exhibitorName"
                  header={
                    <SortHeaderCell onSortChange={::this.sortChange} sortDir={colSortDirs.exhibitorName}>
                      Exposant
                    </SortHeaderCell>
                  }
                  fixed
                  cell={<TextCell data={dataList} />}
                  width={200}
                />
                <Column
                  columnKey="order_0.placementPreference"
                  header={
                    <SortHeaderCell onSortChange={::this.sortChange}
                      sortDir={colSortDirs['order_0.placementPreference']}>
                      Stand nr.
                    </SortHeaderCell>
                  }
                  cell={<TextCell data={dataList} />}
                  width={80}
                  />
                <Column
                    columnKey="order_0.standType"
                    header={
                      <SortHeaderCell onSortChange={::this.sortChange}
                        sortDir={colSortDirs['order_0.standType']}>
                        Stand type
                      </SortHeaderCell>
                    }
                    cell={<TextCell data={dataList} />}
                    width={80}
                    />
                <Column
                    columnKey="order_0.surfaceArea"
                    header={
                      <SortHeaderCell onSortChange={::this.sortChange}
                        sortDir={colSortDirs['order_0.surfaceArea']}>
                        Surface area
                      </SortHeaderCell>
                    }
                    cell={<TextCell data={dataList} suffix=" m²" />}
                    width={80}
                    />
                <Column
                    columnKey="order_0.reference"
                    header={
                      <SortHeaderCell onSortChange={::this.sortChange}
                        sortDir={colSortDirs['order_0.reference']}>
                        Order nr. (1)
                      </SortHeaderCell>
                    }
                    cell={<TextCell data={dataList} />}
                    width={120}
                    />
                <Column
                    columnKey="order_0.basePrice"
                    header={
                      <SortHeaderCell onSortChange={::this.sortChange}
                        sortDir={colSortDirs['order_0.basePrice']}>
                        Stand price
                      </SortHeaderCell>
                    }
                    cell={<TextCell data={dataList} prefix="€ " />}
                    width={150}
                    />
                <Column
                    columnKey="order_0.complementaryPrice"
                    header={
                      <SortHeaderCell onSortChange={::this.sortChange}
                        sortDir={colSortDirs['order_0.complementaryPrice']}>
                        Comp. price
                      </SortHeaderCell>
                    }
                    cell={<TextCell data={dataList} prefix="€ " />}
                    width={150}
                    />
                <Column
                    columnKey="order_0.totalInvoicePrice"
                    header={
                      <SortHeaderCell onSortChange={::this.sortChange}
                        sortDir={colSortDirs['order_0.totalInvoicePrice']}>
                        Total invoice price
                      </SortHeaderCell>
                    }
                    cell={<TextCell data={dataList} prefix="€ " />}
                    width={150}
                    />
                <Column
                    columnKey="order_1.reference"
                    header={
                      <SortHeaderCell onSortChange={::this.sortChange}
                        sortDir={colSortDirs['order_1.reference']}>
                        Order nr. (2)
                      </SortHeaderCell>
                    }
                    cell={<TextCell data={dataList} />}
                    width={120}
                    />
                <Column
                    columnKey="order_1.complementaryPrice"
                    header={
                      <SortHeaderCell onSortChange={::this.sortChange}
                        sortDir={colSortDirs['order_1.complementaryPrice']}>
                        Comp. price
                      </SortHeaderCell>
                    }
                    cell={<TextCell data={dataList} prefix="€ " />}
                    width={150}
                    />
                <Column
                    columnKey="order_2.reference"
                    header={
                      <SortHeaderCell onSortChange={::this.sortChange}
                        sortDir={colSortDirs['order_2.reference']}>
                        Order nr. (3)
                      </SortHeaderCell>
                    }
                    cell={<TextCell data={dataList} />}
                    width={120}
                    />
                <Column
                    columnKey="order_2.complementaryPrice"
                    header={
                      <SortHeaderCell onSortChange={::this.sortChange}
                        sortDir={colSortDirs['order_2.complementaryPrice']}>
                        Comp. price
                      </SortHeaderCell>
                    }
                    cell={<TextCell data={dataList} prefix="€ " />}
                    width={150}
                    />
              </ResponsiveFixedDataTable>
            </div>
            <div className="col-sm-3">
              <Well style={{paddingTop: 0}}>
                <h1>Turnover</h1>
                <h5>Stands: <br />
                  <span style={{color: '#333', fontSize: '22'}}>
                    € {totals.totalBasePrice}
                  </span>
                </h5>
                <h5>Complementary items: <br />
                  <span style={{color: '#333', fontSize: '22'}}>
                    € {totals.totalComplementaryPrice}
                  </span>
                </h5>
                <div style={{paddingTop: 10, width: '100%', textAlign: 'center'}}>
                <Doughnut data=
                {
                  [
                    {value: totals.basePriceRatio,
                      color:'#1ab394', highlight: '#1ab394', label:'Stands'},
                    {value: totals.complementaryPriceRatio,
                      color: '#ddd',  highlight: '#ddd', label:'Complementary'},
                  ]
                }
                options={progressOptions} width="100" height="60"/>
              </div>
              </Well>
            </div>
          </div>
        </div>
      )
  }
}

export default TurnOver
