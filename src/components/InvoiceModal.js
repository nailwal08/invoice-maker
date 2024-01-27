import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { BiCloudDownload } from "react-icons/bi";
import html2canvas from 'html2canvas';
import numberToWords from 'number-to-words';
import jsPDF from 'jspdf'

function GenerateInvoice() {
  html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [612, 792]
    });
    pdf.internal.scaleFactor = 1;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('invoice.pdf');
  });
}

class InvoiceModal extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const amountInWords = numberToWords.toWords(this.props.total || 0);
    return (
      <div>
        <Modal show={this.props.showModal} onHide={this.props.closeModal} size="lg" centered>
          <div id="invoiceCapture">
            <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
              <div className="w-100">
                <h4 className="fw-bold  my-2">Invoice #: {this.props.info.invoiceNumber || ''}</h4>
                <h6 className="fw-bold text-info  mb-1">
                  {this.props.info.billTo || ''}
                </h6>
                <h6 className="fw-bold text-secondary  mb-1">
                  {this.props.info.billToAddress || ''}
                </h6>
              </div>
              <div className="text-end ms-4">
                <h5 className="fw-bold mt-1 mb-2">Tax Invoice/Bill of Supply/Cash Memo</h5>
                <h6 className="fw-bold text-secondary">(Original for Recipient)</h6>
              </div>
            </div>
            <div className="p-4">
              <Row className="mb-4">
                <Col md={4}>
                  <div className="fw-bold">Sold By:</div>
                  <div>{this.props.info.billTo || ''}</div>
                  <div>{this.props.info.billToAddress || ''}</div>
                  <div>{this.props.info.billToEmail || ''}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold">Billing Address:</div>
                  <div>{this.props.info.billFrom || ''}</div>
                  <div>{this.props.info.billFromAddress || ''}</div>
                  <div>{this.props.info.billFromEmail || ''}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold mt-2">Invoice Date: </div>
                  <div>{new Date().toLocaleDateString()}</div>
                  <div class="mb-2 text-info">
                    <span>(MM/DD/YYYY)</span>
                  </div>
                </Col>
              </Row>
              <Table className="mb-0">
                <thead>
                  <tr>
                    <th>QTY</th>
                    <th>DESCRIPTION</th>
                    <th className="text-end">PRICE</th>
                    <th className="text-end">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.items.map((item, i) => {
                    return (
                      <tr id={i} key={i}>
                        <td style={{ width: '70px' }}>
                          {item.quantity}
                        </td>
                        <td>
                          {item.name} - {item.description}
                        </td>
                        <td className="text-end" style={{ width: '100px' }}>{this.props.currency} {item.price}</td>
                        <td className="text-end" style={{ width: '100px' }}>{this.props.currency} {item.price * item.quantity}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Table style={{ marginLeft: 0 }} className="text-start">
                <tbody>
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className="fw-bold" style={{ width: '100px' }}>SUBTOTAL</td>
                    <td>{this.props.currency} {this.props.subTotal}</td>
                  </tr>
                  {this.props.taxAmmount !== '0.00' && (
                    <tr>
                      <td></td>
                      <td className="fw-bold" style={{ width: '100px' }}>Tax</td>
                      <td>{this.props.currency} {this.props.taxAmmount}</td>
                    </tr>
                  )}
                  {this.props.discountAmmount !== '0.00' && (
                    <tr>
                      <td></td>
                      <td className="fw-bold" style={{ width: '100px' }}>DISCOUNT</td>
                      <td>{this.props.currency} {this.props.discountAmmount}</td>
                    </tr>
                  )}
                  <tr>
                    <td></td>
                    <td className="fw-bold" style={{ width: '100px' }}>TOTAL AMOUNT:</td>
                    <td className="fw-bold">{this.props.currency} {this.props.total}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className="fw-bold" style={{ width: '100px' }}>Amount in words:</td>
                    <td className="text-secondary fw-bold">{amountInWords}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className="fw-bold" style={{ width: '100px' }}>Mode of Payment:</td>
                    <td>{this.props.modeOfPayment}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className="fw-bold" style={{ width: '100px' }}>Authorized Signature:</td>
                    <td><img src={this.props.signature} style={{ width: '160px', height: '40px' }} /></td>
                  </tr>
                </tbody>
              </Table>

              {this.props.info.notes &&
                <div className="bg-light py-3 px-4 rounded">
                  {this.props.info.notes}
                </div>}
            </div>
          </div>
          <div className="pb-4 px-4">
            <Row>
              <Col md={6}>
                <Button variant="outline-primary" className="d-block w-80 mt-3 mt-md-0" onClick={GenerateInvoice}>
                  <BiCloudDownload style={{ width: '16px', height: '16px', marginTop: '-3px' }} className="me-2" />
                  Download
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
        <hr className="text-danger mt-4 mb-0" />
        <hr className="text-danger  mb-3 mt-1" />

      </div>
    )
  }
}

export default InvoiceModal;