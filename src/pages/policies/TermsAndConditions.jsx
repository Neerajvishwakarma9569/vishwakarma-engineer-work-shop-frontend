import React from "react";
import PolicyLayout from "./PolicyLayout";

export default function TermsAndConditions() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      subtitle="Standard terms of service, custom fabrication contracts, and user agreements."
      lastUpdated="November 26, 2026"
    >
      <div className="policy-section">
        <h2>1. Agreement to Terms</h2>
        <p>
          These Terms and Conditions constitute a legally binding agreement between you ("Customer", "User") and <strong>Vishwakarma Engineer Workshop</strong> ("Company", "we", "us"). By placing an order, browsing our website, or contracting fabrication services, you acknowledge and agree to comply with all terms herein.
        </p>
      </div>

      <div className="policy-section">
        <h2>2. Quotations & Pricing</h2>
        <ul>
          <li>All prices displayed on the website are in Indian Rupees (INR) and inclusive of applicable GST unless explicitly indicated otherwise.</li>
          <li>Custom quotations provided via site visit, WhatsApp, or email are valid for <strong>15 days</strong> from the date of issue, after which they may be subject to revision due to fluctuations in raw steel and metal commodity market prices.</li>
          <li>In the event of an inadvertent typographical pricing error on the website, we reserve the right to cancel the order and provide a full refund.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>3. Measurements & Custom Specifications</h2>
        <ul>
          <li>For orders fabricated based on customer-provided measurements or architectural CAD drawings, the customer bears full responsibility for the dimensional accuracy of those drawings.</li>
          <li>For orders where a Vishwakarma Engineer Workshop technician visits and records physical site measurements, our workshop guarantees dimensional fit to the verified site frame.</li>
          <li>Any modifications to dimensions requested after fabrication has commenced may result in additional charges and lead-time extensions.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>4. Payment Terms & Razorpay Gateway</h2>
        <p>
          We accept electronic payments through <strong>Razorpay</strong> (UPI, Credit/Debit Cards, Net Banking, EMI) as well as advance bank transfers. All digital transactions are protected with industry-standard 256-bit encryption. For high-value custom fabrication projects, a standard advance deposit (typically 50%) is required prior to steel procurement.
        </p>
      </div>

      <div className="policy-section">
        <h2>5. Intellectual Property & Custom Designs</h2>
        <p>
          All photographs, workshop CAD designs, product illustrations, branding logos, and technical descriptions displayed on this website are the intellectual property of Vishwakarma Engineer Workshop. Unauthorized reproduction or scraping of content is strictly prohibited under the Indian Copyright Act, 1957.
        </p>
      </div>

      <div className="policy-section">
        <h2>6. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable law, Vishwakarma Engineer Workshop shall not be held liable for indirect, incidental, or consequential damages resulting from improper site installation, post-delivery unapproved modifications, structural overburdening, or failure to follow maintenance advisories.
        </p>
      </div>

      <div className="policy-section">
        <h2>7. Governing Law & Jurisdiction</h2>
        <p>
          These terms and all contracts executed with Vishwakarma Engineer Workshop shall be governed by and construed in accordance with the laws of the Republic of India. Any legal disputes shall be subject to the exclusive jurisdiction of the competent courts in <strong>Lucknow, Uttar Pradesh</strong>.
        </p>
      </div>
    </PolicyLayout>
  );
}
