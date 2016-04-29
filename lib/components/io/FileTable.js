import React, {Component, PropTypes} from 'react'
import {Table, Button, Image} from 'react-bootstrap'

class FileTable extends Component {

  static contextTypes = {
    history: PropTypes.any
  }

  onRowClick(id) {
    this.context.history.pushState(null, '/admin/product/'+id )
  }

  render() {
    return (
          <div style={{fontSize: 13}}>
          <Table hover striped>
            <thead>
            <tr>
              <th></th>
              <th>File</th>
              <th>Download</th>
            </tr>
            </thead>
            <tbody>
            {this.props.files.map(file => {
              if (file.name.toLowerCase().lastIndexOf(this.props.filterText.toLowerCase()) > -1
            && !file.conversionId) {
                let url = 'http://io-api.3nit.io/out/testproject/'+file.fileId+'/img_fill/280x280'
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
                      <a target="_blank"
                        style={{display: 'block'}}
                        href={'http://io-api.3nit.io/out/testproject/'+file.fileId}>
                        {file.conversionId ?
                          <pre style={{whiteSpace: 'pre-wrap', fontSize: 6, padding: 5, height: 40}}>
                            {JSON.stringify(file.conversion)}</pre> :
                            <div>
                              <Button bsSize="sm" bsStyle="primary" style={{marginBottom: 10}}>Download</Button>
                              <Button bsSize="xs">Preview</Button>
                            </div>
                          }
                        </a>
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
