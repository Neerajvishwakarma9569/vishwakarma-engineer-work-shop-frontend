import React from "react";
import PolicyLayout from "./PolicyLayout";

export default function RefundPolicy() {
  return (
    <PolicyLayout
      title="Refund Policy"
      subtitle="Clear, verified refund rules and disbursement timelines powered by Razorpay."
      lastUpdated="November 26, 2026"
    >
      <div className="policy-section">
        <h2>1. Principles & Overview</h2>
        <p>
          At <strong>Vishwakarma Engineer Workshop</strong>, we take immense pride in our craftsmanship, heavy-duty ironwork, and precision engineering. We strive to provide transparent, equitable refund terms for both standard catalog products and custom-fabricated structures.
        </p>
        <p>
          All electronic refunds are executed directly through our integrated payment partner, <strong>Razorpay</strong>, to the customer's original mode of payment.
        </p>
      </div>

      <div className="policy-section">
        <h2>2. Refund Eligibility Scenarios</h2>
        <p>A customer is eligible for a full or partial refund under the following verified conditions:</p>
        <ul>
          <li><strong>Pre-Production Order Cancellation:</strong> Customer requested cancellation before the order moved into material cutting or fabrication, approved by admin.</li>
          <li><strong>Verified Transit Damage / Structural Defect:</strong> Standard catalog products delivered with transit damage, manufacturing flaws, or incorrect dimensions, confirmed through return proof images and inspection.</li>
          <li><strong>Undeliverable / Out-of-Stock Orders:</strong> Where raw material unavailability or logistics barriers prevent fulfillment of confirmed paid orders.</li>
          <li><strong>Duplicate Transaction:</strong> Accidental double payment for the same order, validated against Razorpay transaction logs.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>3. Non-Refundable Items & Scenarios</h2>
        <p>Refunds shall NOT be granted in the following cases:</p>
        <ul>
          <li><strong>Custom-Fabricated Items in Progress:</strong> Custom steel railings, laser-cut main gates, or bespoke window grills where raw steel cutting, welding, or client-specified fabrication has already commenced.</li>
          <li><strong>Customer Measurement Errors:</strong> Products manufactured strictly according to dimensions, drawings, or CAD specs submitted and signed off by the customer.</li>
          <li><strong>Normal Wear and Tear:</strong> Surface oxidation, rust from untreated exposure, minor scuffs from client handling after delivery acceptance, or damage caused by improper on-site installation by third-party contractors.</li>
          <li><strong>Untimely Return Claims:</strong> Requests submitted beyond the mandatory 7-day inspection window from delivery timestamp.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>4. Refund Processing Method & Timelines</h2>
        <p>
          Once an Admin reviews and approves a Return or Cancellation request, the refund is initiated programmatically through the <strong>Razorpay Refund API</strong>:
        </p>
        <table className="policy-table">
          <thead>
            <tr>
              <th>Payment Method</th>
              <th>Refund Channel</th>
              <th>Disbursement Timeline</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>UPI (Google Pay, PhonePe, Paytm)</td>
              <td>Direct to Source VPA/Bank Account</td>
              <td>1 – 2 Business Days</td>
            </tr>
            <tr>
              <td>Net Banking (IMPS / NEFT)</td>
              <td>Original Bank Account</td>
              <td>2 – 4 Business Days</td>
            </tr>
            <tr>
              <td>Debit / Credit Cards</td>
              <td>Card Issuing Bank</td>
              <td>5 – 7 Business Days</td>
            </tr>
            <tr>
              <td>Cash on Delivery (COD)</td>
              <td>NEFT / IMPS to Customer Provided Bank</td>
              <td>3 – 5 Business Days post-return pickup</td>
            </tr>
          </tbody>
        </table>
        <p>
          <em>Note:</em> The website dashboard will display a unique <strong>Razorpay Refund ID (rfnd_xxxx)</strong> alongside internal refund references.
        </p>
      </div>

      <div className="policy-section">
        <h2>5. Deductions & Shipping Adjustments</h2>
        <p>
          In cases where returns are initiated due to customer change of mind on non-custom standard items (where authorized), actual two-way freight logistics costs and payment gateway processing fees may be deducted from the gross refund total.
        </p>
      </div>

      <div className="policy-section">
        <h2>6. Dispute Resolution & Assistance</h2>
        <p>
          If your refund has been marked "Refund Completed" on the dashboard but has not reflected in your bank account after 7 business days, please share your <strong>Refund ID</strong> and <strong>Order ID</strong> with our finance desk:
        </p>
        <p>
          Email: <a href="mailto:billing@vishwakarmaworkshop.in">billing@vishwakarmaworkshop.in</a><br />
          Helpline: +91 98765 43210 (Mon – Sat, 9:00 AM – 7:00 PM IST)
        </p>
      </div>
    </PolicyLayout>
  );
}
