import React, {Component} from 'react'
import {Link} from 'react-router'
import ResponsiveFixedDataTable from 'responsive-fixed-data-table'
import {Column, Cell} from 'fixed-data-table'
import {FormGroup, ControlLabel, FormControl, Row, Col, Well, Button, Form} from 'react-bootstrap'
import RadioGroup from 'react-radio-group'
import Loader from 'react-loader'
import {SortHeaderCell, DataListWrapper, TextCell, CheckboxCell, sortIndexes} from 'utils/tablehelper'

class UserTable extends Component {

  constructor(props) {
    super(props)

    this._dataList = props.users
    this._defaultIndexes = []

    this.state = {
      dataList: new DataListWrapper(this._defaultIndexes, this._dataList),
      colSortDirs: {},
      filter: '',
      language: '',
      status: ''
    }
  }

  componentWillReceiveProps(props) {
    this._dataList = props.users

    this._defaultIndexes = []
    const size = this._dataList.length
    for (let index = 0; index < size; index++)
      this._defaultIndexes.push(index)

    this.setState({
      dataList: this.state.indexes ?
        new DataListWrapper(this.state.indexes, this._dataList) :
        new DataListWrapper(this._defaultIndexes, this._dataList),
      colSortDirs: this.state.colSortDirs,
    })
  }

  onChange(e, user, checked) {
    this.props.selectionChange([user], checked)
  }

  onRowClick(data, index) {
    this.props.selectionChange([data.getObjectAt(index)], !data.getObjectAt(index).checked)
  }

  filterData(filter, language, status) {
    const size = this._dataList.length
    const indexes = []

    for (let index = 0; index < size; index++) {
      const {firstName, lastName, email, exhibitorName, locale, lastOrderStatus} = this._dataList[index]
      if (firstName.toLowerCase().indexOf(filter) > -1 ||
          lastName.toLowerCase().indexOf(filter) > -1 ||
          email.toLowerCase().indexOf(filter) > -1 ||
          exhibitorName.toLowerCase().indexOf(filter) > -1) {
        let languageMatch = true, statusMatch = true
        if (language.length > 0 && locale)
          languageMatch = language.toLowerCase() === locale.toLowerCase()
        if (status.length > 0 && lastOrderStatus)
          statusMatch = status.toLowerCase() === lastOrderStatus.toLowerCase()
        if (languageMatch && statusMatch) indexes.push(index)
      }
    }

    this.setState({
      indexes,
      language,
      filter,
      status,
      dataList: new DataListWrapper(indexes, this._dataList),
    })
    return indexes
  }

  languageChange(value) {
    const language = value
    this.filterData(this.state.filter, language, this.state.status)
  }

  statusChange(value) {
    const status = value
    this.filterData(this.state.filter, this.state.language, status)
  }

  filterChange(e) {
    if (!e.target.value)
      this.setState({
        filteredDataList: this._dataList,
      })

    const filter = e.target.value.toLowerCase()
    this.filterData(filter, this.state.language, this.state.status)
  }

  clearFilter() {
    this.filterData('', this.state.language, this.state.status)
  }

  sortChange(columnKey, sortDir) {
    const indexes = this.filterData(this.state.filter, this.state.language, this.state.status)
    sortIndexes(this._dataList, indexes, columnKey, sortDir)

    this.setState({
      indexes,
      dataList: new DataListWrapper(indexes, this._dataList),
      colSortDirs: {
        [columnKey]: sortDir,
      },
    })
  }

  selectAll() {
    const {dataList} = this.state
    const users = []
    dataList._indexMap.forEach(index => {
      users.push(dataList._data[index])
    })
    this.props.selectionChange(users, true)
  }

  render() {
    const {dataList, colSortDirs} = this.state
    return (
      <div>
        <Loader loaded={this.props.usersLoaded} lines={10} radius={10} length={7} color="#999" width={3}  />
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
          <Row>
            <Col md={12}>
              <Form inline>
                <FormGroup style={{float: 'left', lineHeight: '35px'}}>
                  <ControlLabel style={{width: 100}}>Language</ControlLabel>
                </FormGroup>
                <div style={{marginLeft: '-10px', float: 'left', fontSize: 12}}>
                  <RadioGroup name="language" selectedValue={this.state.language} onChange={::this.languageChange}>
                    {Radio => (
                      <div>
                        <div style={{paddingLeft: 10, paddingTop: 10, float: 'left'}}>
                          <label style={{fontWeight: 'normal'}}>
                            <Radio value="" />&nbsp;All
                          </label>
                        </div>
                        <div style={{paddingLeft: 10, paddingTop: 10, float: 'left'}}>
                          <label style={{fontWeight: 'normal'}}>
                            <Radio value="nl" />&nbsp;NL
                          </label>
                        </div>
                        <div style={{paddingLeft: 10, paddingTop: 10, float: 'left'}}>
                          <label style={{fontWeight: 'normal'}}>
                            <Radio value="fr" />&nbsp;FR
                          </label>
                        </div>
                      </div>
                    )}
                  </RadioGroup>
                </div>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form inline>
                <FormGroup style={{float: 'left', lineHeight: '35px'}}>
                  <ControlLabel style={{width: 100}}>Last order</ControlLabel>
                </FormGroup>
                <div style={{marginLeft: '-10px', float: 'left', fontSize: 12}}>
                  <RadioGroup name="status" selectedValue={this.state.status} onChange={::this.statusChange}>
                    {Radio => (
                      <div>
                        <div style={{paddingLeft: 10, paddingTop: 10, float: 'left'}}>
                          <label style={{fontWeight: 'normal'}}>
                            <Radio value="" />&nbsp;All
                          </label>
                        </div>
                        <div style={{paddingLeft: 10, paddingTop: 10, float: 'left'}}>
                          <label style={{fontWeight: 'normal'}}>
                            <Radio value="-" />&nbsp;None
                          </label>
                        </div>
                        <div style={{paddingLeft: 10, paddingTop: 10, float: 'left'}}>
                          <label style={{fontWeight: 'normal'}}>
                            <Radio value="requested" />&nbsp;Requested
                          </label>
                        </div>
                        <div style={{paddingLeft: 10, paddingTop: 10, float: 'left'}}>
                          <label style={{fontWeight: 'normal'}}>
                            <Radio value="approved" />&nbsp;Approved
                          </label>
                        </div>
                        <div style={{paddingLeft: 10, paddingTop: 10, float: 'left'}}>
                          <label style={{fontWeight: 'normal'}}>
                            <Radio value="accepted" />&nbsp;Accepted
                          </label>
                        </div>
                        <div style={{paddingLeft: 10, paddingTop: 10, float: 'left'}}>
                          <label style={{fontWeight: 'normal'}}>
                            <Radio value="declined" />&nbsp;Declined
                          </label>
                        </div>
                        <div style={{paddingLeft: 10, paddingTop: 10, float: 'left'}}>
                          <label style={{fontWeight: 'normal'}}>
                            <Radio value="closed" />&nbsp;Closed
                          </label>
                        </div>
                      </div>
                    )}
                  </RadioGroup>
                </div>
              </Form>
            </Col>
          </Row>
        </Well>
        <Row>
          <Col md={12} style={{height: 400, fontSize: 12}}>
            <ResponsiveFixedDataTable
              rowHeight={24}
              rowsCount={dataList.getSize()}
              rowClassNameGetter={() => 'hoverTable'}
              headerHeight={40}
              onRowClick={(e, index) => this.onRowClick(dataList, index)}
              {...this.props}>
              <Column
                columnKey="_id"
                cell={<CheckboxCell data={dataList} />}
                header={
                  <div style={{padding: 5}}>
                    <Button onClick={() => this.selectAll()} bsSize="small">All</Button>
                  </div>
                }
                width={45}
              />
              <Column
                columnKey="exhibitorName"
                header={
                  <SortHeaderCell
                    onSortChange={::this.sortChange}
                    sortDir={colSortDirs.exhibitorName}>
                    Exhibitor
                  </SortHeaderCell>
                }
                cell={<TextCell data={dataList} />}
                flexGrow={2}
                width={150}
              />
              <Column
                columnKey="firstName"
                header={
                  <SortHeaderCell
                    onSortChange={::this.sortChange}
                    sortDir={colSortDirs.firstName}>
                    First Name
                  </SortHeaderCell>
                }
                cell={<TextCell data={dataList} />}
                flexGrow={1}
                width={100}
                />
              <Column
                columnKey="lastName"
                header={
                  <SortHeaderCell
                    onSortChange={::this.sortChange}
                    sortDir={colSortDirs.lastName}>
                    Last Name
                  </SortHeaderCell>
                }
                cell={<TextCell data={dataList} />}
                flexGrow={1}
                width={100}
              />
              <Column
                columnKey="locale"
                header={
                  <SortHeaderCell
                    onSortChange={::this.sortChange}
                    sortDir={colSortDirs.locale}>
                    Language
                  </SortHeaderCell>
                }
                cell={<TextCell data={dataList} />}
                flexGrow={1}
                width={55}
              />
              <Column
                columnKey="lastOrderStatus"
                header={
                  <SortHeaderCell
                    onSortChange={::this.sortChange}
                    sortDir={colSortDirs.lastOrderStatus}>
                    Last order
                  </SortHeaderCell>
                }
                cell={<TextCell data={dataList} />}
                flexGrow={1}
                width={55}
                />
              <Column
                cell={({rowIndex, ...props}) => (
                  <Cell {...props}>
                    <Link onClick={(e) => e.stopPropagation()} to={'/admin/user/'+dataList.getObjectAt(rowIndex)._id}>
                      Edit
                    </Link>
                  </Cell>
                )}
                width={40}
              />
            </ResponsiveFixedDataTable>
          </Col>
        </Row>
      </div>
      )
  }
}

export default UserTable
