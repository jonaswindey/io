import React, {Component} from 'react'
import {Well, Button, Row, Col, FormGroup, FormControl} from 'react-bootstrap'
import {Form} from 'formsy-react'
//import ElementInput from 'components/shared/ElementInput'
import {connect} from 'react-redux'
import * as fileActions from 'actions/files'
import debug from 'debug'
import Dropzone from 'react-dropzone'
import Cropper from 'react-cropper'
import cloud from 'assets/images/cloud.png'
import Loader from 'react-loader'

/*const preloader = () => {
  return (<div style={{position: 'relative'}}>
    <Loader loaded={false} lines={10} radius={10} length={7} color="#999" width={3}  />
    <div className="text-center" style={{paddingTop: 80}}>Generating preview</div>
  </div>)
}*/

@connect(state => ({
  files: state.files,
}))
class FileAdder extends Component {

  state = {
    src: null,
    preview: null,
    productPreview: null,
    selection: [],
    fileId: null,
  }

  componentDidMount() {
    //this.props.dispatch(productActions.fetchProduct(this.props.params.id))
  }

  componentWillReceiveProps() {
    /*if (props.params.id !== this.props.params.id)
      this.props.dispatch(productActions.fetchProduct(props.params.id))

    if (props.products.fileAdding !== this.props.products.fileadding)
      this.cancelCrop()

    if (props.products.product.preview)
      this.setState({productPreview: props.products.product.preview})

    if (props.products.preselect !== this.props.products.preselect)
      this.setState({productPreview: props.products.preselect.fileId})

    if (props.products.categoryTree.length > 0 && props.products.product._id)
      this.setTreeSelection(props)

    if (props.products.product.categories)
      this.setState({selection: props.products.product.categories})*/
  }

  onPreviewChange(e) {
    this.setState({productPreview: e.currentTarget.value})
  }

  handleSubmit(data) {
    debug('dev')('handleSubmit:')
    debug('dev')(data)
  }

  /*shouldComponentUpdate(nextProps, nextState) {
    return nextProps.products.product !== this.props.products.product
    || nextProps.products.fileAdding !== this.props.products.fileAdding
    || nextState.src !== this.state.src
    || nextState.preview !== this.state.preview
    || nextState.showPreview !== this.state.showPreview
    || nextState.fileName !== this.state.fileName
    || nextState.productPreview !== this.state.productPreview
    || nextState.selection.length !== this.state.selection.length
  }*/

  saveCrop() {
    this.setState({showPreview: true, showCrop: false})
  }

  crop(){
    try {
      this.setState({
        preview: this.refs.cropper.getCroppedCanvas().toDataURL()
      })
    } catch (e) {}
  }

  cancelCrop() {
    try {
      this.setState({
        //src: null,
        preview: null,
        showCrop: false
      })
    } catch (e) {}
  }

  reset() {
    try {
      this.setState({
        src: null,
        preview: null,
        showCrop: false
      })
    } catch (e) {}
  }

  onPictureChange(e){
    e.preventDefault()
    let files
    if (e.dataTransfer)
      files = e.dataTransfer.files
    else if (e.target)
      files = e.target.files

    let reader = new FileReader()
    reader.onload = () => {
      this.setState({src: reader.result, showPreview: false})
    }
    reader.readAsDataURL(files[0])
  }

  onDrop(files, type) {
    window.scrollTo(0,0)

    if (files.length > 1)
      this.props.dispatch(fileActions.uploadFiles(files))
    else {
      const fileType = files[0].type
      if (type === 'video' && fileType.lastIndexOf('video/') > -1)
        this.setState({videoFileName: files[0].name, video: files[0]})
      else if (type === 'image' && fileType.lastIndexOf('image/') > -1) {
        this.setState({fileName: files[0].name})
        let reader = new FileReader()
        reader.onload = () => {
          this.setState({src: reader.result, showPreview: false})
        }
        reader.readAsDataURL(files[0])
      }
    }
  }

  onFileIdChange(e) {
    this.setState({fileId: e.currentTarget.value})
  }

  onUpload() {
    const src = this.state.preview ? this.state.preview : this.state.src
    const base64str = src.split(',')[1]
    const binary = atob(base64str.replace(/\s/g, ''))
    const len = binary.length
    const buffer = new ArrayBuffer(len)
    const view = new Uint8Array(buffer)
    for (let i = 0; i < len; i++)
      view[i] = binary.charCodeAt(i)

    const blob = new Blob( [view], { fileName: this.state.fileName, type: 'image/jpg' })
    this.props.dispatch(fileActions.uploadFile(blob, this.state.fileName, this.state.fileId))
    this.setState({showPreview: false, src: null,preview: null, fileId: null})

  }


  renderImageDropzone() {
    if (!this.state.src) return (
      <div className="mobile">
        <Dropzone className="none"
                onDrop={(files) => this.onDrop(files, 'image')}>
        <div className="text-center drop" style={{cursor: 'pointer'}}>
          <img className="cloud" src={cloud} style={{width: '100px'}}/>
          <div className="drop-button">
            <Button bsStyle="primary">Drop file or click here</Button>
          </div>
        </div>
      </Dropzone>
      </div>
    )
  }

  renderCropper() {
    const result = []
    if (this.state.src) {

      if (!this.state.showCrop && !this.state.preview)
        result.push(
          <img key="preview" src={this.state.src} className="img-responsive"/>
        )


      if (true) {
        let cropperStyle = {}
        if (!this.state.showPreview) cropperStyle = {height: 400, width: '100%'}
        else cropperStyle= {display: 'none'}

        if (!this.state.showCrop) {
          cropperStyle.height = 0
          cropperStyle.display = 'none'
        }
        if (this.state.showCrop)
          result.push(
            <div
              key='cropper'
              style={{height: '100%', width: '100%'}}>
              <Cropper
                ref='cropper'
                src={this.state.src}
                style={cropperStyle}
                guides
                responsive
                crop={::this.crop} />
            </div>
        )
        if (this.state.showCrop)
          result.push(
            <div key='cropButtons' style={{paddingTop: 10, clear: 'both', height: 50, width: '100%'}}>
              <Button bsStyle="primary" style={{float: 'left', marginRight: 5}}
                onClick={() => {this.cancelCrop()}}>Cancel crop</Button>
              <Button bsStyle="success" style={{marginRight: 5, float: 'right'}} onClick={::this.saveCrop}>Crop</Button>
            </div>
          )
      }

      // buttons

      if (!this.state.showCrop)
        if (!this.state.showPreview)
          result.push(
            <div key='default' style={{paddingTop: 10}}>
              <Row>
                <Col lg={12}>
                  <FormGroup bsSize="sm">
                    <FormControl value={this.state.fileId}
                      type="text" onChange={::this.onFileIdChange}
                      style={{width: 200}} placeholder="Specify file id"/>
                  </FormGroup>
                </Col>
              </Row>
              <Button bsStyle="success" style={{marginRight: 5}} onClick={::this.onUpload}>Upload</Button>
              <Button bsStyle="info" style={{marginRight: 5}}
                onClick={() => this.setState({showCrop: true})}>Crop image</Button>
              <Button bsStyle="primary" onClick={::this.reset}>Change image</Button>
            </div>
          )
        else
          result.push(
            <div key='change'>
              <img style={{width: '100%'}} src={this.state.preview}/>
              <div style={{paddingTop: 10}}>
                <Button bsStyle="success" style={{marginRight: 5}} onClick={::this.onUpload}>Upload</Button>
                <Button bsStyle="primary" onClick={::this.reset}>Change image</Button>
              </div>
            </div>
          )
    }
    return result
  }

  render() {
    const {fileAdding} = this.props.files
    //if (!productLoaded) return <div />
    return (
        <div style={{fontSize: 12}} className="fileAdder">
          <Form onSubmit={::this.handleSubmit}>
              <Well style={{minHeight: 60, paddingTop: 0, paddingBottom: 0}}>
                    {
                      fileAdding ?
                        <div style={{paddingTop: 40, paddingBottom: 40, position: 'relative'}}>
                          <Loader loaded={this.props.productsLoaded}
                            lines={10} radius={10} length={7} color="#999" width={3}  />
                        </div>
                        :
                        <div>
                          {this.renderImageDropzone()}
                          {this.renderCropper()}
                        </div>
                    }
             </Well>
          </Form>
        </div>
    )
  }
}

export default FileAdder
