import React, {Component} from 'react'
import {Well, Button, Row, Col, Tabs, Tab} from 'react-bootstrap'
import {Form} from 'formsy-react'
//import ElementInput from 'components/shared/ElementInput'
import {connect} from 'react-redux'
import * as fileActions from 'actions/files'
import debug from 'debug'
import Dropzone from 'react-dropzone'
import Cropper from 'react-cropper'
import cloud from 'assets/images/cloud.png'
//const API = constants.API
//import * as storage from 'persistence/storage'
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
class Product extends Component {

  state = {
    src: null,
    preview: null,
    productPreview: null,
    selection: [],
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

    /*const product = this.props.products.product

    product.reference = data.reference

    product.translations.forEach(translation => {
      translation.value = data[translation.key]
    })

    product.variants[0].price = parseFloat(data.price)
    product.variants[0].stock = parseInt(data.stock)
    product.variants[0].unlimited = data.unlimited

    const dimensions = product.attributes.forEach(
      attribute => attribute.attribute === constants.PRODUCT_ATTRIBUTE_DIMENSIONS)

    if (dimensions) dimensions.value = data.dimensions
    else product.attributes.push({attribute: constants.PRODUCT_ATTRIBUTE_DIMENSIONS, value: data.dimensions})

    const preview = product.attributes.forEach(
      attribute => attribute.attribute === constants.PRODUCT_ATTRIBUTE_MAIN_PREVIEW)

    if (preview) preview.value = data.preview
    else product.attributes.push({attribute: constants.PRODUCT_ATTRIBUTE_MAIN_PREVIEW, value: data.preview})

    product.categories = this.state.selection

    this.props.dispatch(productActions.updateProduct(product))*/
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
        src: null,
        preview: null
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

  onUpload() {
    debugger
    let base64str
    if (this.refs.cropper)
      base64str = this.refs.cropper.getCroppedCanvas().toDataURL().split(',')[1]
    else
      base64str = this.state.src

    const binary = atob(base64str).replace(/\s/g, '')
    const len = binary.length
    const buffer = new ArrayBuffer(len)
    const view = new Uint8Array(buffer)
    for (let i = 0; i < len; i++)
      view[i] = binary.charCodeAt(i)

    const blob = new Blob( [view], { fileName: this.state.fileName, type: 'image/jpg' })
    this.props.dispatch(fileActions.addFile('testproject', blob, this.state.fileName))

    this.setState({showPreview: false, src: null,preview: null})
  }


  renderImageDropzone() {
    if (!this.state.src) return (
      <div>
        <Dropzone className="none" multiple={false}
                onDrop={(files) => this.onDrop(files, 'image')}>
        <div className="text-center" style={{paddingTop: 10, paddingBottom: 10, cursor: 'pointer'}}>
          <img src={cloud} style={{width: '100px'}}/>
          <div style={{clear: 'both', marginTop: '10px'}}>
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

      if (!this.state.showCrop)
        result.push(
          <img src={this.state.src} className="img-responsive"/>
        )

      if (true || this.state.showCrop) {
        let cropperStyle = {}
        if (!this.state.showPreview) cropperStyle = {height: 400, width: '100%'}
        else cropperStyle= {display: 'none'}
        result.push(
          <Cropper
            key='cropper'
            ref='cropper'
            src={this.state.src}
            style={cropperStyle}
            guides
            responsive
            crop={::this.crop} />
        )
        result.push(
          <div style={{paddingTop: 10}}>
            <Button bsStyle="info" style={{marginRight: 5}} onClick={::this.saveCrop}>Crop</Button>
            <Button bsStyle="info" style={{marginRight: 5}}
              onClick={() => {this.setState({showCrop: false})}}>Cancel</Button>
          </div>
        )
      }

      // buttons

      if (!this.state.showCrop)
        if (!this.state.showPreview)
          result.push(
            <div key='Cropper' style={{paddingTop: 10}}>
              <Button bsStyle="success" style={{marginRight: 5}} onClick={::this.onUpload}>Upload</Button>
              <Button bsStyle="info" style={{marginRight: 5}}
                onClick={() => this.setState({showCrop: true})}>Crop image</Button>
              <Button bsStyle="primary" onClick={::this.cancelCrop}>Cancel</Button>
            </div>
          )
        else
          result.push(
            <div key='change'>
              <img style={{width: '100%'}} src={this.state.preview}/>
              <div style={{paddingTop: 10}}>
                <Button bsStyle="success" style={{marginRight: 5}} onClick={::this.onUpload}>Upload</Button>
                <Button bsStyle="info" style={{marginRight: 5}}
                  onClick={() => this.setState({showCrop: true})}>Crop image</Button>
                <Button bsStyle="primary" onClick={::this.cancelCrop}>Change image</Button>
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
        <div style={{fontSize: 12}}>
          <Form onSubmit={::this.handleSubmit}>
            <Tabs defaultActiveKey={1} id="productTab">
               <Tab eventKey={1} title="Files" style={{paddingTop: 20}}>
                  <Well>
                    <Row style={{display: 'none'}}>
                      <Col lg={12}>
                        <h4 style={{paddingLeft: 15}}>Files</h4>
                        <div style={{paddingLeft: 15}}>
                        </div>
                      </Col>
                    </Row>
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
               </Tab>
             </Tabs>
          </Form>
        </div>
    )
  }
}

export default Product
