import React, {Component, PropTypes} from 'react'
import Dropzone from 'react-dropzone'
import {Button} from 'react-bootstrap'
import request from 'superagent'
import debug from 'debug'
import {constants} from 'config/constants'
import * as storage from 'persistence/storage'

class File extends Component {
  state = {file: {}, uploading: false};

  static propTypes = {
    path: PropTypes.string,
    user: PropTypes.any
  };

  componentWillReceiveProps() {
    const path = encodeURIComponent(
      this.props.path.replace('{recordId}', this.props.user.reference))
    const req = request
      .get(constants.API + '/files/filemaker/' + path + '?json=true')
      .set('Authorization',
      'bearer ' + storage.get('token'))
    req.end((e, res) => {
      if (e) debug('dev')(e)
      else
        if (res.body.name)
          this.setState({
            file: {
              name: res.body.name,
              preview: constants.API + '/files/filemaker/' + path
            }
          })
    })
  }

  onDrop(files) {
    this.setState({file: files[0], uploading: true})
    const path = encodeURIComponent(
      this.props.path.replace('{recordId}', this.props.user.reference))
    const req = request
      .post(constants.API + '/files/' + path)
      .set('Authorization', storage.get('token'))
    files.forEach((file)=> {
      req.attach(file.name, file)
    })
    req.end((e) => {
      this.setState({uploading: false})
      debug('dev')(e)
    })
  }

  render() {
    return (
      <div>
        { this.state.file.preview ?
          <img className="img-responsive" src={this.state.file.preview}
               style={{marginBottom: '20px'}}/> :
          <div />
        }
        <Dropzone className="none" multiple={false}
                  onDrop={(files) => this.onDrop(files)}>
          <div className="text-center"><Button bsStyle="primary">Drop file or
            click here</Button></div>
        </Dropzone>
        { this.state.uploading && <div>Uploading...</div> }
      </div>
    )
  }
}

class FileZone extends Component {

  state = {comment: ''};

  render() {
    let component = <div />
    if (!this.props.new)
      component = (
        <div className="ibox float-e-margins">
          <div className="ibox-title">
            <h5>Files ({this.props.files.length})</h5>
          </div>
          <div>
            <div className="ibox-content">
              {this.props.files.map(file =>
                  <div key={file.path}>
                    <h2>{file.name}</h2>
                    <File {...this.props} path={file.path}/>

                    <div className="hr-line-dashed"></div>
                  </div>
              )}
            </div>
          </div>
        </div>
      )
    return component
  }
}

export default FileZone
