import React, { useEffect, useState, useRef } from 'react';
import {
  FileText,
  Download,
  Printer,
  X,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
} from 'lucide-react';
import api from '../services/api';
import './Css/InvoiceModal.css';

const money = (val) => Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatDate = (date) => (date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');

export default function InvoiceModal({ orderId, invoiceId, onClose }) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const printAreaRef = useRef(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    const endpoint = orderId ? `/invoices/order/${orderId}` : `/invoices/${invoiceId}`;

    api
      .get(endpoint)
      .then(({ data }) => {
        if (active) setInvoice(data);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || 'Could not load invoice details.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orderId, invoiceId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    try {
      const endpoint = orderId ? `/invoices/order/${orderId}/pdf` : `/invoices/${invoiceId || invoice?._id}/pdf`;
      const response = await api.get(endpoint, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoice?.invoiceNumber || 'Invoice'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      window.alert('Could not download invoice PDF. Please try again.');
    }
  };

  return (
    <div className="invoice-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="invoice-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Toolbar (Screen only) */}
        <header className="invoice-modal-toolbar no-print">
          <div className="toolbar-left">
            <FileText size={18} className="toolbar-icon" />
            <h3>Tax Invoice #{invoice?.invoiceNumber || 'Loading...'}</h3>
          </div>
          <div className="toolbar-actions">
            {invoice && (
              <>
                <button type="button" className="btn btn-outline btn-sm" onClick={handleDownloadPdf}>
                  <Download size={14} /> Download PDF
                </button>
                <button type="button" className="btn btn-dark btn-sm" onClick={handlePrint}>
                  <Printer size={14} /> Print Invoice
                </button>
              </>
            )}
            <button type="button" className="modal-close-icon-btn" onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          </div>
        </header>

        {loading && <p className="invoice-loading-msg">Loading official invoice...</p>}
        {error && <p className="invoice-error-msg">{error}</p>}

        {/* Printable Invoice Document */}
        {invoice && (
          <div className="invoice-printable-doc" ref={printAreaRef}>
            {/* 1. Header with Company Branding & Tax Invoice Title */}
            <div className="inv-header-row">
              <div className="inv-company-brand">
                <img src="/Images/vishlogo.png" alt="Vishwakarma Workshop" className="inv-logo" />
                <div>
                  <h1 className="inv-company-name">{invoice.companyDetails?.name || 'VISHWAKARMA ENGINEER WORKSHOP'}</h1>
                  <span className="inv-tagline">{invoice.companyDetails?.tagline || 'Master Craftsmen in Metal Fabrication'}</span>
                  <p className="inv-company-address">
                    {invoice.companyDetails?.address}
                    <br />
                    Phone: {invoice.companyDetails?.phone} | Email: {invoice.companyDetails?.email}
                    <br />
                    GSTIN: <strong>{invoice.companyDetails?.gstin}</strong> | State: {invoice.companyDetails?.state} (Code: {invoice.companyDetails?.stateCode})
                  </p>
                </div>
              </div>

              <div className="inv-meta-card">
                <span className="inv-type-badge">TAX INVOICE</span>
                <div className="inv-meta-line">
                  <span>Invoice No:</span>
                  <strong>{invoice.invoiceNumber}</strong>
                </div>
                <div className="inv-meta-line">
                  <span>Invoice Date:</span>
                  <strong>{formatDate(invoice.invoiceDate)}</strong>
                </div>
                <div className="inv-meta-line">
                  <span>Order Ref:</span>
                  <strong>#{String(invoice.order).slice(-8).toUpperCase()}</strong>
                </div>
                <div className="inv-meta-line">
                  <span>Place of Supply:</span>
                  <strong>{invoice.customerDetails?.state || 'Madhya Pradesh'}</strong>
                </div>
              </div>
            </div>

            {/* 2. Order & Payment Summary Strip */}
            <div className="inv-status-strip">
              <div className="strip-item">
                <span>Payment Mode</span>
                <strong>{(invoice.paymentDetails?.paymentMethod || 'offline').replace('-', ' ').toUpperCase()}</strong>
              </div>
              <div className="strip-item">
                <span>Payment Status</span>
                <strong className={`status-text ${invoice.paymentDetails?.paymentStatus === 'paid' ? 'paid' : 'pending'}`}>
                  {invoice.paymentDetails?.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                </strong>
              </div>
              <div className="strip-item">
                <span>Transaction Ref</span>
                <strong>{invoice.paymentDetails?.razorpayPaymentId || invoice.paymentDetails?.transactionId || 'COD / Direct Order'}</strong>
              </div>
            </div>

            {/* 3. Customer Billing & Shipping Information */}
            <div className="inv-parties-grid">
              <div className="party-box">
                <span className="party-title">BILLED TO (CUSTOMER DETAILS)</span>
                <h4>{invoice.customerDetails?.name}</h4>
                <p>
                  📞 {invoice.customerDetails?.phone}
                  {invoice.customerDetails?.email && <> | ✉️ {invoice.customerDetails?.email}</>}
                  <br />
                  {invoice.customerDetails?.billingAddress || invoice.customerDetails?.shippingAddress}
                  <br />
                  PIN Code: {invoice.customerDetails?.pinCode || '—'} | State: {invoice.customerDetails?.state || 'Madhya Pradesh'}
                </p>
              </div>

              <div className="party-box">
                <span className="party-title">SHIPPING & DELIVERY ADDRESS</span>
                <h4>{invoice.customerDetails?.name}</h4>
                <p>
                  📞 Contact: {invoice.customerDetails?.phone}
                  <br />
                  {invoice.customerDetails?.shippingAddress || invoice.customerDetails?.billingAddress}
                  <br />
                  Delivery Location: {invoice.customerDetails?.village ? `${invoice.customerDetails.village}, ` : ''}{invoice.customerDetails?.colony || ''}
                </p>
              </div>
            </div>

            {/* 4. Itemized Product Table */}
            <div className="inv-table-wrap">
              <table className="inv-items-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product / Service Description</th>
                    <th>HSN</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Discount</th>
                    <th>Taxable (₹)</th>
                    <th>GST</th>
                    <th>Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="center">{idx + 1}</td>
                      <td>
                        <strong>{item.name}</strong>
                        {item.description && <small className="desc-text">{item.description}</small>}
                      </td>
                      <td className="center">{item.hsnCode || '7308'}</td>
                      <td className="center">{item.quantity} {item.unit || 'Nos'}</td>
                      <td className="right">₹{money(item.unitPrice)}</td>
                      <td className="right">{item.discountAmount > 0 ? `-₹${money(item.discountAmount)}` : '—'}</td>
                      <td className="right">₹{money(item.taxableAmount)}</td>
                      <td className="center">{item.gstRate}%</td>
                      <td className="right"><strong>₹{money(item.totalAmount)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 5. Summary Section: Bank Details + Price Calculation */}
            <div className="inv-bottom-section">
              <div className="inv-bank-box">
                <span className="party-title">WORKSHOP BANK & UPI PAYMENT DETAILS</span>
                <p>
                  <b>Bank Name:</b> {invoice.companyDetails?.bankDetails?.bankName || 'State Bank of India'}
                  <br />
                  <b>Account No:</b> {invoice.companyDetails?.bankDetails?.accountNumber || '389012345678'}
                  <br />
                  <b>IFSC Code:</b> {invoice.companyDetails?.bankDetails?.ifscCode || 'SBIN0001234'}
                  <br />
                  <b>Branch:</b> {invoice.companyDetails?.bankDetails?.branch || 'Ganj Basoda, MP'}
                  <br />
                  <b>UPI VPA:</b> <strong>{invoice.companyDetails?.bankDetails?.upiId || 'vishwakarmaworkshop@sbi'}</strong>
                </p>
              </div>

              <div className="inv-totals-box">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <strong>₹{money(invoice.priceSummary?.subtotal)}</strong>
                </div>
                {invoice.priceSummary?.discountTotal > 0 && (
                  <div className="total-row discount">
                    <span>Discount Applied:</span>
                    <strong>-₹{money(invoice.priceSummary?.discountTotal)}</strong>
                  </div>
                )}
                <div className="total-row">
                  <span>Taxable Amount:</span>
                  <strong>₹{money(invoice.priceSummary?.taxableAmount)}</strong>
                </div>
                {invoice.priceSummary?.cgstTotal > 0 && (
                  <div className="total-row">
                    <span>CGST (9%):</span>
                    <span>₹{money(invoice.priceSummary?.cgstTotal)}</span>
                  </div>
                )}
                {invoice.priceSummary?.sgstTotal > 0 && (
                  <div className="total-row">
                    <span>SGST (9%):</span>
                    <span>₹{money(invoice.priceSummary?.sgstTotal)}</span>
                  </div>
                )}
                {invoice.priceSummary?.igstTotal > 0 && (
                  <div className="total-row">
                    <span>IGST (18%):</span>
                    <span>₹{money(invoice.priceSummary?.igstTotal)}</span>
                  </div>
                )}
                {invoice.priceSummary?.shippingCharges > 0 && (
                  <div className="total-row">
                    <span>Delivery & Handling:</span>
                    <span>₹{money(invoice.priceSummary?.shippingCharges)}</span>
                  </div>
                )}
                <div className="total-row grand-total">
                  <span>Grand Total (INR):</span>
                  <strong>₹{money(invoice.priceSummary?.grandTotal)}</strong>
                </div>
              </div>
            </div>

            {/* 6. Amount in Words */}
            <div className="inv-words-box">
              <span>Amount in Words:</span> <strong>{invoice.priceSummary?.amountInWords}</strong>
            </div>

            {/* 7. Terms, Return Policy & Signature */}
            <div className="inv-footer-row">
              <div className="inv-terms-col">
                <span className="party-title">TERMS & CONDITIONS</span>
                <ul>
                  {invoice.termsAndConditions?.slice(0, 4).map((term, i) => (
                    <li key={i}>{term}</li>
                  ))}
                </ul>
              </div>

              <div className="inv-sig-col">
                <span>For VISHWAKARMA ENGINEER WORKSHOP</span>
                <div className="sig-placeholder" />
                <strong>Authorized Signatory</strong>
              </div>
            </div>

            <div className="inv-thankyou">
              Thank you for trusting Vishwakarma Engineer Workshop for your metal fabrication & engineering needs!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
