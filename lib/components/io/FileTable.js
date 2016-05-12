import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {Table, Button, Image, Glyphicon, Modal} from 'react-bootstrap'
import {PhotoSwipe} from 'react-photoswipe'
import * as fileActions from 'actions/files'
import {constants} from 'config/constants'
const {API} = constants
import {withRouter} from 'react-router'
import {Icon} from 'react-fa'

class FileTable extends Component {

  state = {
    isOpen: false,
    items: [],

    options: {
      closeOnScroll: false,
      shareButtons: [],
      index: -1,
    },

    showInfoModal: false,
    currentFile: {},
  }

  static contextTypes = {
    store: PropTypes.any,
  }

  onRowClick(id) {
    this.props.router.push(null, '/admin/product/'+id )
  }

  openPhotoSwipe = (index) => {
    return (e) => {
      e.preventDefault()
      let {options} = this.state
      options.index = index
      options.getThumbBoundsFn = (index) => {
        let thumbnail = ReactDOM.findDOMNode(this.refs['thumbnail' + index])
        //let img = thumbnail.getElementsByTagName('img')[0]
        let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
        let rect = thumbnail.getBoundingClientRect()
        return {x: rect.left+5, y: rect.top + pageYScroll + 5, w: rect.width-10, h: rect.width-5}
      }
      this.setState({
        options,
        isOpen: true
      })
    }
  }

  handleClose = () => {
    this.setState({
      isOpen: false
    })
  }

  componentWillReceiveProps(props) {
    if (props.files && (props.files.length !== this.props.files.length)) {
      const items = props.files.map(file => {
        const rotate =
          file.info.Orientation && (file.info.Orientation === 'LeftBottom' || file.info.Orientation === 'RightTop')
        return {
          thumb: `${API}/out/${file.project}/${file.fileId}/img_fit/x200`,
          msrc: `${API}/out/${file.project}/${file.fileId}/img_fit/x200`,
          src: `${API}/out/${file.project}/${file.fileId}/img_fit/x800`,
          w: rotate ? file.info.size.height : file.info.size.width,
          h: rotate ? file.info.size.width : file.info.size.height,
          title: file.name,
          name: file.name,
          fileId: file.fileId,
          info: file.info,
          project: file.project,
          conversionId: file.conversionId ? file.conversionId : null,
          _id: file._id,
        }
      }).filter((file => file.conversionId === null))
      this.setState({items})
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const should =  nextProps.files.length !== this.props.files.length ||
      nextState.isOpen !== this.state.isOpen ||
      nextState.options.index !== this.state.options.index ||
      nextProps.filterText !== this.props.filterText ||
      nextState.items.length !== this.state.items.length ||
      nextState.showInfoModal !== this.state.showInfoModal ||
      nextState.currentFile !== this.state.currentFile
    return should
  }

  remove(id) {
    this.context.store.dispatch(fileActions.remove(id))
  }

  showInfoModal(currentFile) {
    this.setState({currentFile, showInfoModal: true})
  }

  closeInfoModal() {
    this.setState({showInfoModal: false})
  }

  render() {
    let {isOpen, items, options} = this.state
    return (
          <div style={{fontSize: 13}}>
            <PhotoSwipe id="my-photoswipe"
              isOpen={isOpen}
              items={items}
              options={options}
              beforeChange={this.handleBeforeChange}
              onClose={this.handleClose}/>
            <Table striped>
              <tbody>
              {this.state.items.map((file, index) => {
                let url = file.thumb
                if (file.modified) url += '?time=' + new Date().getTime()
                return (
                  <tr key={file._id}>
                    <td className="col-md-3 col-sm-4 col-xs-4 text-center">
                      <Image
                        ref={'thumbnail' + index}
                        style={{cursor: 'pointer', maxHeight: 95}}
                        onClick={this.openPhotoSwipe(index)}
                        thumbnail responsive
                        src={url} />
                    </td>
                    <td className="col-md-6 col-sm-4 col-xs-3">
                      <div style={{marginTop: 0, marginBottom: 0, }}>
                        <h6>{file.name}</h6>
                        {file.info &&
                          <div>
                          <small style={{paddingRight : 5}}>
                            {file.w} x {file.h} ({file.info.format}) - {file.info.Filesize}
                          </small>
                          <Button bsStyle="info"
                            onClick={() => this.showInfoModal(file)}
                            style={{marginTop: -2}}
                            bsSize="xs"><Icon name="info" /></Button>
                          </div>
                        }
                        <small style={{color: '#666'}}>{file.fileId}</small>
                      </div>
                    </td>
                    <td className="col-md-3 col-sm-4 col-xs-5">
                      <Button bsStyle="danger"
                        onClick={() => this.remove(file._id)}
                        style={{float: 'right', marginLeft: 7, marginTop: 4}}
                        bsSize="xs"><Glyphicon glyph="remove" /></Button>
                      <a target="_blank"
                        style={{float: 'right'}}
                        href={`${API}/out/${file.project}/${file.fileId}`}>
                        <Button bsSize="sm" bsStyle="primary"
                          style={{marginBottom: 10}}>Download</Button>
                      </a>
                    </td>
                  </tr>
                )
              })}
              </tbody>
            </Table>
            <Modal show={this.state.showInfoModal} onHide={() => this.closeInfoModal()}>
              <Modal.Header closeButton>
                <Modal.Title>File info</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <pre style={{width: '100%'}}>{JSON.stringify(this.state.currentFile.info, null, 2) }</pre>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={() => this.closeInfoModal()}>Close</Button>
              </Modal.Footer>
            </Modal>
          </div>
        )

  }
}

export default withRouter(FileTable)
