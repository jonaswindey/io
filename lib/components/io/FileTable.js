import React, {Component, PropTypes} from 'react'
import {Table, Button, Image} from 'react-bootstrap'
import {constants} from 'config/constants'
const {DEFAULT_PROJECT} = constants
import {PhotoSwipe} from 'react-photoswipe'
import debug from 'debug'

class FileTable extends Component {

  /*items = []

  isOpen: false

  state = {
    isOpen: false,
    items: []
  }*/

  state = {
    isOpen: false,
    /*items: [
      {
        src: 'http://lorempixel.com/1200/900/sports/1',
        w: 1200,
        h: 900,
        title: 'Image 1'
      },
      {
        src: 'http://lorempixel.com/1200/900/sports/2',
        w: 1200,
        h: 900,
        title: 'Image 2'
      },
      {
        src: 'http://lorempixel.com/1200/900/sports/3',
        w: 1200,
        h: 900,
        title: 'Image 3'
      }
    ],*/
    options: {
      closeOnScroll: false,
      shareButtons: [],
      index: -1,
    }
  }

  static contextTypes = {
    history: PropTypes.any
  }

  onRowClick(id) {
    this.context.history.pushState(null, '/admin/product/'+id )
  }

  openPhotoSwipe = (index) => {
    return (e) => {
      e.preventDefault()
      let {options} = this.state
      options.index = index
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
    if (props.files && props.files.length !== this.props.files.length) {
      debug('dev')(props)
      const items = props.files.map(file => {
        return {
          src: `http://io-api.3nit.io/out/${DEFAULT_PROJECT}/${file.fileId}/img_fill/800x800`,
          w: 800,
          h: 800,
          title: file.name
        }
      })
      this.setState({items})
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.files.length !== this.props.files.length ||
      nextState.isOpen !== this.state.isOpen ||
      nextState.options.index !== this.state.options.index
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
          <Table hover striped>
            <thead>
            <tr>
              <th></th>
              <th>File</th>
              <th>Download</th>
            </tr>
            </thead>
            <tbody>
            {this.props.files.map((file, index) => {
              if (file.name.toLowerCase().lastIndexOf(this.props.filterText.toLowerCase()) > -1
            && !file.conversionId) {
                let url = `http://io-api.3nit.io/out/${DEFAULT_PROJECT}/${file.fileId}/img_fill/280x280`
                if (file.modified) url += '?time=' + new Date().getTime()
                return (
                  <tr key={file._id}>
                    <td className="col-md-3 col-sm-2 col-xs-4">
                      <Image
                        thumbnail
                        src={url} />
                    </td>
                    <td className="col-md-8">
                      <p style={{marginTop: 0, marginBottom: 0, }}>
                        <small>{file.project}<br /></small>
                        <h5>{file.name}</h5>
                        {file.fileId}
                      </p>
                    </td>
                    <td className="col-md-2 text-center" style={{width: '100px'}}>
                        {file.conversionId ?
                          <pre style={{whiteSpace: 'pre-wrap', fontSize: 6, padding: 5, height: 40}}>
                            {JSON.stringify(file.conversion)}</pre> :
                            <div>
                              <a target="_blank"
                                style={{display: 'block'}}
                                href={'http://io-api.3nit.io/out/'+DEFAULT_PROJECT+'/'+file.fileId}>
                                <Button bsSize="sm" bsStyle="primary"
                                  style={{marginBottom: 10}}>Download</Button>
                              </a>
                              <Button
                                onClick={this.openPhotoSwipe(index)}
                                bsSize="xs">Preview</Button>
                            </div>
                          }
                      </td>
                  </tr>
                )
              }
            })}
            </tbody>
          </Table>
            </div>
        )

  }
}

export default FileTable
