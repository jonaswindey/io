import React, {Component} from 'react'
import FileTable from './FileTable'
//import {Link} from 'react-router'
import {Form, Row, Col, FormControl, FormGroup} from 'react-bootstrap'
import Loader from 'react-loader'
import * as fileActions from 'actions/files'

class SearchableFileTable extends Component {
  state = {
    filterText: '',
    reference: '',
  }

  onFilterChange(e) {
    this.setState({
      filterText: e.currentTarget.value
    })
  }

  onReferenceChange(e) {
    this.setState({
      reference: e.currentTarget.value
    })
  }

  onProjectChange(e) {
    this.props.dispatch(fileActions.changeProject(e.currentTarget.value))
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={4} style={{paddingTop: 10, paddingBottom: 10}}>
            <FormControl type="text" placeholder="Search..."
                   value={this.state.filterText}
                   onChange={::this.onFilterChange}
              />
          </Col>
          <Col xs={8} style={{textAlign: 'right', paddingTop: 10}}>
                  <Form inline>
                  <FormGroup controlId="formControlsSelect" >
                    <FormControl componentClass="select"
                      value={this.state.project}
                      placeholder="Project" onChange={(e) => this.onProjectChange(e)}>
                      <option value="jonas">Jonas (sandbox)</option>
                      <option value="vdz">Vander Zijpen</option>
                      <option value="aaa">AAA Finance</option>
                      <option value="vsm">Vue Sur Mer</option>
                    </FormControl>
                  </FormGroup>
                  </Form>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <div style={{minHeight: 150}}>
            <Loader loaded={this.props.filesLoaded} lines={10} radius={10} length={7} color="#999" width={3}  />
            <FileTable filterText={this.state.filterText}
                          files={this.props.files}/>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default SearchableFileTable
