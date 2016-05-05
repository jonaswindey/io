import React, {Component, PropTypes} from 'react'
import {Table, Button, Image} from 'react-bootstrap'
import {constants} from 'config/constants'
const {DEFAULT_PROJECT} = constants
import {PhotoSwipe} from 'react-photoswipe'

class FileTable extends Component {

  state = {
    isOpen: false,
    items: [],

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
    if (props.files && (props.files.length !== this.props.files.length)) {
      const items = props.files.map(file => {
        return {
          src: `http://io-api.3nit.io/out/${DEFAULT_PROJECT}/${file.fileId}/img_fill/800x800`,
          w: 800,
          h: 800,
          title: file.name,
          name: file.name,
          fileId: file.fileId,
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
      nextState.items.length !== this.state.items.length
    return should
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
            {this.state.items.map((file, index) => {
              let url = file.src
              if (file.modified) url += '?time=' + new Date().getTime()
              return (
                <tr key={file._id}>
                  <td className="col-md-3 col-sm-3 col-xs-4">
                    <Image
                      thumbnail
                      src={url} />
                  </td>
                  <td className="col-md-8">
                    <div style={{marginTop: 0, marginBottom: 0, }}>
                      <small>{file.project}<br /></small>
                      <h5>{file.name}</h5>
                      {file.fileId}
                    </div>
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
            })}
            </tbody>
          </Table>
            </div>
        )

  }
}

export default FileTable
