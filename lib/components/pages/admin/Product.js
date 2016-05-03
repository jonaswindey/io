import React, {Component} from 'react'
import {Well, Button, Row, Col, Tabs, Tab} from 'react-bootstrap'
import {Form} from 'formsy-react'
import ElementInput from 'components/shared/ElementInput'
import {connect} from 'react-redux'
import * as productActions from 'actions/products'
import debug from 'debug'
import Dropzone from 'react-dropzone'
import Cropper from 'react-cropper'
import cloud from 'assets/images/cloud.png'
import {constants} from 'config/constants'
const {API, DEFAULT_PROJECT} = constants
import * as storage from 'persistence/storage'
import Loader from 'react-loader'
import ImageLoader from 'react-imageloader'
import TreeMenu from 'components/shared/treemenu/TreeMenu'
import TreeMenuUtils from 'components/shared/treemenu/TreeMenuUtils'

const preloader = () => {
  return (<div style={{position: 'relative'}}>
    <Loader loaded={false} lines={10} radius={10} length={7} color="#999" width={3}  />
    <div className="text-center" style={{paddingTop: 80}}>Generating preview</div>
  </div>)
}

@connect(state => ({
  products: state.products,
}))
class Product extends Component {

  state = {
    src: null,
    preview: null,
    productPreview: null,
    selection: [],
  }

  componentDidMount() {
    this.props.dispatch(productActions.fetchProduct(this.props.params.id))
  }

  componentWillReceiveProps(props) {
    if (props.params.id !== this.props.params.id)
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
      this.setState({selection: props.products.product.categories})
  }

  onPreviewChange(e) {
    this.setState({productPreview: e.currentTarget.value})
  }

  handleSubmit(data) {
    debug('dev')('handleSubmit:')
    debug('dev')(data)

    const product = this.props.products.product

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

    this.props.dispatch(productActions.updateProduct(product))
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.products.product !== this.props.products.product
    || nextProps.products.fileAdding !== this.props.products.fileAdding
    || nextState.src !== this.state.src
    || nextState.preview !== this.state.preview
    || nextState.showPreview !== this.state.showPreview
    || nextState.fileName !== this.state.fileName
    || nextState.productPreview !== this.state.productPreview
    || nextState.selection.length !== this.state.selection.length
  }

  saveCrop() {
    this.setState({showPreview: true})
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

    const base64str = this.refs.cropper.getCroppedCanvas().toDataURL().split(',')[1]
    const binary = atob(base64str.replace(/\s/g, ''))
    const len = binary.length
    const buffer = new ArrayBuffer(len)
    const view = new Uint8Array(buffer)
    for (let i = 0; i < len; i++)
      view[i] = binary.charCodeAt(i)

    const blob = new Blob( [view], { fileName: this.state.fileName, type: 'image/jpg' })
    this.props.dispatch(productActions.addFile(this.props.params.id, blob, this.state.fileName))
  }

  setTreeSelection(props) {
    const categoryTree = props.products.categoryTree
    const product = props.products.product

    const check = (items) => {
      items.forEach(item => {
        if (product.categories && product.categories.includes(item._id)) item.checked = true
        else item.checked = false
        check(item.children)
      })
    }

    check(categoryTree)
  }

  treeChange(propName, lineage) {
    const tree = TreeMenuUtils.getNewTreeState(lineage, this.props.products.categoryTree, propName)

    const selection = []
    const check = (items) => {
      items.forEach(item => {
        if (item.checked)
          selection.push(item._id)
        check(item.children)
      })
    }
    check(tree)
    // filter products based on selection
    /*this.state.products.forEach(product => {
      product.filter = false
      product.categories.forEach(category => {
        if (selection.includes(category) || selection.length === 0)
          product.filter = true
      })
    })*/

    this.setState({selection})
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
      if (!this.state.showPreview)
        result.push(
          <div key='Cropper' style={{paddingTop: 10}}>
              <Button bsStyle="success" style={{marginRight: 5}} onClick={::this.saveCrop}>Crop image</Button>
              <Button bsStyle="primary" onClick={::this.cancelCrop}>Cancel</Button>
          </div>
        )
      else
        result.push(
          <div key='change'>
            <img style={{width: '100%'}} src={this.state.preview}/>
              <div style={{paddingTop: 10}}>
                <Button bsStyle="success" style={{marginRight: 5}} onClick={::this.onUpload}>Upload</Button>
                  <Button bsStyle="primary" onClick={::this.cancelCrop}>Change image</Button>
              </div>
          </div>
        )
    }
    return result
  }

  render() {
    const {product, productLoaded, fileAdding} = this.props.products
    if (!productLoaded) return <div />
    return (
        <div style={{fontSize: 12}}>
          <Form onSubmit={::this.handleSubmit}>
            <Tabs defaultActiveKey={1} id="productTab">
               <Tab eventKey={1} title="Product info">
                 <div style={{marginTop: 20}}>
                   <Row>
                       <Col lg={12}>
                         <div className="form-horizontal">
                           <ElementInput type="text" label="Reference" name="reference"
                                         required
                                         value={product.reference || ''}/>
                         </div>
                         <div className="form-horizontal">
                           <ElementInput type="text" label="Nom (fr)" name="fr"
                                         icon={'https://s3.amazonaws.com/3nit-cdn/assets/flags/fra.svg'}
                                         value={product.fr || ''}/>
                         </div>
                         <div className="form-horizontal">
                           <ElementInput type="text" label="Naam (nl)" name="nl"
                                         icon={'https://s3.amazonaws.com/3nit-cdn/assets/flags/nld.svg'}
                                         value={product.nl || ''}/>
                         </div>
                         <div className="form-horizontal">
                           <ElementInput type="text" label="Name (pl)" name="pl"
                                         icon={'https://s3.amazonaws.com/3nit-cdn/assets/flags/pol.svg'}
                                         value={product.pl || ''}/>
                         </div>
                         <div className="form-horizontal">
                           <ElementInput type="text" label="Name (en)" name="en"
                                         icon={'https://s3.amazonaws.com/3nit-cdn/assets/flags/usa.svg'}
                                         value={product.en || ''}/>
                         </div>
                         <div className="form-horizontal">
                           <ElementInput type="text" label="Name (it)" name="it"
                                         icon={'https://s3.amazonaws.com/3nit-cdn/assets/flags/ita.svg'}
                                         value={product.it || ''}/>
                         </div>
                         <div className="form-horizontal">
                           <ElementInput type="text" label="Dimensions" name="dimensions"
                                         value={product.dimensions || ''} />
                         </div>

                       </Col>
                       <div className="col-xs-12">
                         <Button bsStyle="primary" className="pull-right" type="submit">Save
                           product</Button>
                       </div>
                   </Row>
                 </div>
               </Tab>
               <Tab eventKey={2} title="Price & stock">
                 <div style={{marginTop: 20}}>
                   <Row>
                       <Col lg={12}>
                         <div className="form-horizontal">
                           <ElementInput type="text" label="Prix (€)" name="price"
                                         required
                                         value={product.variants[0].price || ''}/>
                         </div>
                         <div className="form-horizontal">
                           <ElementInput type="text" label="Stock" name="stock" required
                                         value={product.variants[0].stock || ''}/>
                         </div>
                         <div className="form-horizontal">
                           <ElementInput type="checkbox" label="Stock illimité" name="unlimited"
                               checkboxLabel="Yes"
                               value={product.unlimitedStock} />
                         </div>
                       </Col>
                       <div className="col-xs-12">
                         <Button bsStyle="primary" className="pull-right" type="submit">Save
                           product</Button>
                       </div>
                   </Row>
                 </div>
               </Tab>
               <Tab eventKey={3} title="Files" style={{paddingTop: 20}}>
                 {!this.state.src &&
                 <Well>
                      <div className="form-horizontal">
                        <ElementInput type="select" label="Preview file" name="preview"
                          onValueChange={(e) => this.onPreviewChange(e)}
                                      value={this.state.productPreview}>
                          <option key='' value=''>No preview</option>
                          {product.files.map(file => {
                            return (<option key={file.fileId}
                              value={file.fileId}>{file.name}</option>)
                          })}
                        </ElementInput>
                      </div>

                      <Row>
                        <Col mdOffset={4} style={{padding: 15, height: 190}}>
                          {this.state.productPreview &&
                            <ImageLoader
                              src={
                                constants.API + '/out/' +
                                DEFAULT_PROJECT +'/' + this.state.productPreview + '/img_fit/x400'}
                                wrapper={React.DOM.div}
                                imgProps={{alt: 'Preview', className: 'img-responsive', style: {maxHeight: 150}}}
                                preloader={preloader}
                                />
                          }
                        </Col>
                      </Row>

                      <Row>
                        <Col md={12}>
                        <Button bsStyle="primary" className="pull-right" type="submit">Save
                          product</Button>
                        </Col>
                      </Row>
                  </Well>
                  }
                  <Well>
                    <Row style={{display: 'none'}}>
                      <Col lg={12}>
                        <h4 style={{paddingLeft: 15}}>Files</h4>
                        <div style={{paddingLeft: 15}}>
                        <ul>
                          {product.files.map(file => {
                            const link =
                              `${API}/files/products/${file.fileId}?token=${storage.get('token').split(' ')[1]}`
                            return (
                              <li key={file.fileId}>
                                <a target="_blank"
                                  href={link}>
                                  {file.name}
                                </a>
                              </li>
                            )
                          })}
                        </ul>
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
               <Tab eventKey={4} title="Categories" style={{paddingTop: 20, height: 510, overflow: 'scroll'}}>
                 <Row>
                   <Col md={12}>
                   <Button bsStyle="primary" className="pull-right" type="submit">Save
                     product</Button>
                   </Col>
                 </Row>
                 <TreeMenu
                   expandIconClass="fa fa-chevron-right"
                   collapseIconClass="fa fa-chevron-down"
                   onTreeNodeCollapseChange={this.treeChange.bind(this,
                     'collapsed')}
                     onTreeNodeCheckChange={this.treeChange.bind(this,
                       'checked')}
                       data={this.props.products.categoryTree}/>
               </Tab>
             </Tabs>
          </Form>
        </div>
    )
  }
}

export default Product
