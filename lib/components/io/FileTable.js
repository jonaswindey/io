import React, {Component, PropTypes} from 'react'
import {Table, Button} from 'react-bootstrap'

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
          <Table bordered condensed hover>
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
            && !file.conversionId)

                return (
                  <tr key={file._id} style={{cursor: 'pointer'}}>
                    <td className="col-md-1"  style={{width: '110px'}}>
                      <img
                        style={{height: file.conversionId ? 50 : 100}}
                        src={'http://io-api.3nit.io/out/testproject/'+file.fileId+'/img_fill/280x280'} />
                    </td>
                    <td className="col-md-9">
                      <h5 style={{marginTop: 0, marginBottom: 0, }}>
                        <small style={{fontSize: 12}}>{file.project}<br /></small>
                        {file.name}
                        </h5>
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

            })}
            </tbody>
          </Table>
            </div>
        )

  }
}

export default FileTable
