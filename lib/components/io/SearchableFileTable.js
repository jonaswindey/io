import React, {Component} from 'react'
import FileTable from './FileTable'
//import {Link} from 'react-router'
import {Form, Row, Col, FormControl, Button, FormGroup} from 'react-bootstrap'
import Loader from 'react-loader'

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

  render() {
    return (
      <div>
        <Row>
          <Col md={4} style={{paddingTop: 10, paddingBottom: 10}}>
            <FormControl type="text" placeholder="Search..."
                   value={this.state.filterText}
                   onChange={::this.onFilterChange}
              />
          </Col>
          <Col md={8} style={{textAlign: 'right', paddingTop: 10}}>
              <Row>
                <Col>
                  <Form inline>
                  <FormGroup controlId="formControlsSelect" >
                    <FormControl componentClass="select" placeholder="Project">
                      <option value="select">Select project</option>
                      <option value="other">...</option>
                    </FormControl>
                    <Button style={{marginLeft: 10, marginRight: 15}}
                      onClick={() => this.props.createProduct(this.state.reference)}>Filter</Button>
                  </FormGroup>
                  </Form>
                </Col>
              </Row>
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