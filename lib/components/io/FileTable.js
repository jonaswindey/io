import React, {Component, PropTypes} from 'react'
import {Table} from 'react-bootstrap'

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
          <Table striped bordered condensed hover>
            <thead>
            <tr>
              <th></th>
              <th>File</th>
              <th>Download</th>
              <th>Preview</th>
            </tr>
            </thead>
            <tbody>
            {this.props.files.map(file => {
              if (file.name.toLowerCase().lastIndexOf(this.props.filterText.toLowerCase()) > -1)

                return (
                  <tr key={file._id} style={{cursor: 'pointer'}}>
                    <td className="col-md-3" style={{maxWidth:140}}>
                      <img
                        style={{width: file.conversionId ? 50 : 140}}
                        src={'http://io-api.3nit.io/out/testproject/'+file.fileId+'/img_fit/280x280'} />
                    </td>
                    <td className="col-md-5">
                      <h4 style={{marginTop: 5}}><small>{file.project}</small> / {file.name}</h4>
                    </td>
                    <td className="col-md-1" style={{maxWidth: '80px'}}>
                      <a target="_blank"
                      href={'http://io-api.3nit.io/out/testproject/'+file.fileId}>
                      {file.conversionId ?
                        <span style={{fontSize: 10}}>Conversion</span> :
                          <span style={{fontSize: 16}}>Download</span>
                        }
                      </a>
                    <br />
                    </td>
                    <td className="col-md-1" style={{maxWidth: '30px'}}>
                      <a target="_blank"
                      href={'http://io-api.3nit.io/out/testproject/'+file.fileId+'/img_fit/x500'}>Preview</a>
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
