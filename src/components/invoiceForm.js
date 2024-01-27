import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';
import InputGroup from 'react-bootstrap/InputGroup';
import numberToWords from 'number-to-words';



class InvoiceForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currency: '₹',
      currentDate: '',
      invoiceNumber: 1,
      billTo: '',
      billToEmail: '',
      billToAddress: '',
      billToGst: '',
      billFrom: '',
      billFromEmail: '',
      billFromAddress: '',
      notes: '',
      total: '0.00',
      subTotal: '0.00',
      taxRate: '',
      taxAmmount: '0.00',
      discountRate: '',
      signature: '',
      modeOfPayment: '',
      discountAmmount: '0.00'
    };
    this.state.items = [
      {
        id: 0,
        name: '',
        description: '',
        price: '1.00',
        quantity: 1
      }
    ];
    this.editField = this.editField.bind(this);
  }
  componentDidMount(prevProps) {
    this.handleCalculateTotal()
  }
  handleRowDel(items) {
    var index = this.state.items.indexOf(items);
    this.state.items.splice(index, 1);
    this.setState(this.state.items);
  };
  handleAddEvent(evt) {
    var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var items = {
      id: id,
      name: '',
      price: '1.00',
      description: '',
      quantity: 1
    }
    this.state.items.push(items);
    this.setState(this.state.items);
  }
  handleCalculateTotal() {
    var items = this.state.items;
    var subTotal = 0;

    items.map(function (items) {
      subTotal = parseFloat(subTotal + (parseFloat(items.price).toFixed(2) * parseInt(items.quantity))).toFixed(2)
    });

    this.setState({
      subTotal: parseFloat(subTotal).toFixed(2)
    }, () => {
      this.setState({
        taxAmmount: parseFloat(parseFloat(subTotal) * (this.state.taxRate / 100)).toFixed(2)
      }, () => {
        this.setState({
          discountAmmount: parseFloat(parseFloat(subTotal) * (this.state.discountRate / 100)).toFixed(2)
        }, () => {
          this.setState({
            total: ((subTotal - this.state.discountAmmount) + parseFloat(this.state.taxAmmount))
          });
        });
      });
    });

  };
  onItemizedItemEdit(evt) {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
    var items = this.state.items.slice();
    var newItems = items.map(function (items) {
      for (var key in items) {
        if (key == item.name && items.id == item.id) {
          items[key] = item.value;
        }
      }
      return items;
    });
    this.setState({ items: newItems });
    this.handleCalculateTotal();
  };
  editField = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
    this.handleCalculateTotal();
  };



  openModal = (event) => {
    event.preventDefault()
    this.handleCalculateTotal()
    this.setState({ isOpen: true })
  };
  closeModal = (event) => this.setState({ isOpen: false });

  handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {

      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        const reader = new FileReader();

        reader.onloadend = () => {
          this.setState({ signature: reader.result });
        };

        reader.readAsDataURL(file);
      } else {

        alert('Please upload a PNG or JPG file.');

      }
    }
  };





  render() {
    const amountInWords = numberToWords.toWords(this.state.total || 0);
    return (<Form onSubmit={this.openModal}>
      <Row>
        <Col md={8} lg={9}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4">
            <div className="d-flex flex-row align-items-start justify-content-between mb-3">
              <div class="d-flex flex-column">
                <div className="d-flex flex-column">
                  <div class="mb-2">
                    <span className="fw-bold">Invoice&nbsp;Date:&nbsp;</span>
                    <span className="current-date">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div class="mb-2 text-info">
                    <span>(MM/DD/YYYY)</span>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row align-items-center">
                <span className="fw-bold  me-2">Invoice&nbsp;Number:&nbsp;</span>
                <Form.Control type="text" value={this.state.invoiceNumber} name={"invoiceNumber"} onChange={(event) => this.editField(event)} style={{
                  maxWidth: '70px'
                }} required="required" />
              </div>
            </div>
            <hr className="my-4 text-success" />

            <Row className="mb-5">
              <Col>
                <Form.Label className="fw-bold">Sold By:</Form.Label>
                <Form.Control placeholder={"Company's name"} rows={3} value={this.state.billTo} type="text" name="billTo" className="my-2" onChange={(event) => this.editField(event)} autoComplete="name" required="required" />
                <Form.Control placeholder={"Email address"} value={this.state.billToEmail} type="email" name="billToEmail" className="my-2" onChange={(event) => this.editField(event)} autoComplete="email" required="required" />
                <Form.Control placeholder={"Company's address"} value={this.state.billToAddress} type="text" name="billToAddress" className="my-2" autoComplete="address" onChange={(event) => this.editField(event)} required="required" />
                <Form.Control placeholder={"GST registration number"} value={this.state.billToGst} type="text" name="billToGst" className="my-2" autoComplete="gst" onChange={(event) => this.editField(event)} required="required" />
              </Col>
              <Col>
                <Form.Label className="fw-bold">Billing Address:</Form.Label>
                <Form.Control placeholder={"Customer's name"} rows={3} value={this.state.billFrom} type="text" name="billFrom" className="my-2" onChange={(event) => this.editField(event)} autoComplete="name" required="required" />
                <Form.Control placeholder={"Email address"} value={this.state.billFromEmail} type="email" name="billFromEmail" className="my-2" onChange={(event) => this.editField(event)} autoComplete="email" required="required" />
                <Form.Control placeholder={"Customer's address"} value={this.state.billFromAddress} type="text" name="billFromAddress" className="my-2" autoComplete="address" onChange={(event) => this.editField(event)} required="required" />
              </Col>
            </Row>
            <InvoiceItem onItemizedItemEdit={this.onItemizedItemEdit.bind(this)} onRowAdd={this.handleAddEvent.bind(this)} onRowDel={this.handleRowDel.bind(this)} currency={this.state.currency} items={this.state.items} />

            <Row className="mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:
                  </span>
                  <span>{this.state.currency}
                    {this.state.subTotal}</span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Discount:</span>
                  <span>
                    <span className="small ">({this.state.discountRate || 0}%)</span>
                    {this.state.currency}
                    {this.state.discountAmmount || 0}</span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Tax:
                  </span>
                  <span>
                    <span className="small ">({this.state.taxRate || 0}%)</span>
                    {this.state.currency}
                    {this.state.taxAmmount || 0}</span>
                </div>
                <hr className="text-info" />
                <div className="d-flex flex-row align-items-start justify-content-between" style={{
                  fontSize: '1.125rem'
                }}>
                  <span className="fw-bold">Total:
                  </span>
                  <span className="fw-bold">{this.state.currency}
                    {this.state.total || 0}</span>
                </div>
              </Col>
            </Row>
            <hr className="my-4" />
            <span className="fw-bold">Amount in words:&nbsp;&nbsp;
              <span className="fw-bold">
                {amountInWords}</span></span>
            <span className="fw-bold mt-2">For&nbsp;<span span className="text-secondary">{this.state.billTo}</span></span>
            <div className="mt-2 mb-2">
              <input type="file" onChange={(event) => this.handleImageChange(event)} />
            </div>
            {this.state.signature && (
              <img id="uploadedImage" src={this.state.signature} alt="Uploaded Signature" style={{ width: '160px', height: '40px' }} />
            )}
            <span className="fw-bold">Authorized Signature</span>
            <hr className="my-4" />
            <Form.Label className="fw-bold">Additional Notes:</Form.Label>
            <Form.Control placeholder="Thanks for your business!" name="notes" value={this.state.notes} onChange={(event) => this.editField(event)} as="textarea" className="my-2" rows={1} />
          </Card>
        </Col>
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button variant="success" type="submit" className="text-center w-50 custom-hover">Review Invoice</Button>
            <InvoiceModal showModal={this.state.isOpen} closeModal={this.closeModal} info={this.state} items={this.state.items} currency={this.state.currency} signature={this.state.signature} modeOfPayment={this.state.modeOfPayment} subTotal={this.state.subTotal} taxAmmount={this.state.taxAmmount} discountAmmount={this.state.discountAmmount} total={this.state.total} />

            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Tax rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control name="taxRate" type="number" value={this.state.taxRate} onChange={(event) => this.editField(event)} className="bg-white border" placeholder="0.0" min="0.00" step="0.01" max="100.00" required="required" />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Discount rate(optional):</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control name="discountRate" type="number" value={this.state.discountRate} onChange={(event) => this.editField(event)} className="bg-white border" placeholder="0.0" min="0.00" step="0.01" max="100.00" />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Mode of Payment:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Select
                  name="modeOfPayment"
                  value={this.state.modeOfPayment}
                  onChange={(event) => this.editField(event)}
                  className="bg-white border"
                  required
                >
                  <option value="">Select Payment Mode</option>
                  <option value="Online">Online</option>
                  <option value="Cash">Cash</option>
                </Form.Select>
              </InputGroup>
            </Form.Group>
          </div>
        </Col>
      </Row>
    </Form>)
  }
}

export default InvoiceForm;
