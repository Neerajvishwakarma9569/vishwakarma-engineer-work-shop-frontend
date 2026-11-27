import React from "react";
import PolicyLayout from "./PolicyLayout";

export default function ReturnPolicy() {
  return (
    <PolicyLayout
      title="Return & Replacement Policy"
      subtitle="Step-by-step guidelines for product returns, replacements, and claims inspection."
      lastUpdated="November 26, 2026"
    >
      <div className="policy-section">
        <h2>1. Return Window & Coverage</h2>
        <p>
          At <strong>Vishwakarma Engineer Workshop</strong>, customer satisfaction and high structural integrity are our top priorities. If your delivered product does not match what you ordered, you may submit a return or replacement request within <strong>7 days</strong> of delivery.
        </p>
      </div>

      <div className="policy-section">
        <h2>2. Valid Reasons for Return / Replacement</h2>
        <p>You may initiate a return or replacement under any of the following verified conditions:</p>
        <ul>
          <li><strong>Damaged Product:</strong> Structural bends, dented iron pipes, cracked joints, or heavy transit collision damage incurred during freight transit.</li>
          <li><strong>Defective Product:</strong> Flawed weld joints, improper hinge alignment, defective mechanical locks, or metal fatigue.</li>
          <li><strong>Wrong Product Received:</strong> Received design, color coating, or model differs fundamentally from the product ordered.</li>
          <li><strong>Missing Parts:</strong> Anchor bolts, hinges, mounting brackets, lock handles, or hardware fasteners missing from the delivery kit.</li>
          <li><strong>Product Not as Described:</strong> Significant deviations in dimensions, steel gauge/thickness, or metal specification from listed specifications.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>3. How to Submit a Return Request</h2>
        <p>Return requests must be submitted directly through your Customer Dashboard:</p>
        <ol>
          <li>Navigate to <strong>My Account → My Orders</strong>.</li>
          <li>Locate the delivered order and click the <strong>"Request Return / Refund"</strong> button.</li>
          <li>Select the specific item, quantity, and reason for return.</li>
          <li>Provide a detailed description of the flaw or mismatch.</li>
          <li>Upload clear proof images showing: the full product, close-ups of the defect/damage, and packaging labels (up to 5 images, max 5MB each).</li>
          <li>Submit the request to generate your unique <strong>Return Request ID (RET-YYYYMMDD-XXXX)</strong>.</li>
        </ol>
      </div>

      <div className="policy-section">
        <h2>4. Review & Inspection Process</h2>
        <p>
          Our technical engineering team reviews all submitted requests within <strong>24 to 48 hours</strong>. During this stage:
        </p>
        <ul>
          <li>We may reach out to request high-resolution photos or video of the defect.</li>
          <li>For major structural items (gates, safety doors), we may schedule a technician site inspection.</li>
          <li>Once approved, a reverse freight pickup will be scheduled, or a replacement unit will be manufactured and dispatched.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>5. Replacement vs. Refund</h2>
        <p>
          Upon return inspection approval:
        </p>
        <ul>
          <li><strong>Replacement:</strong> A freshly fabricated or corrected unit will be dispatched at zero additional shipping cost to you.</li>
          <li><strong>Refund:</strong> If a replacement is unavailable or unacceptable, a full refund will be processed to your original payment method via Razorpay within 5–7 business days.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>6. Return Conditions</h2>
        <p>To qualify for a valid return:</p>
        <ul>
          <li>Items must be returned in their original condition without alterations, drilling, or field welding performed by unauthorized third parties.</li>
          <li>All accompanying mounting brackets, locks, keys, and accessories must be returned.</li>
          <li>The return shipment must be safely wrapped or handed over to our authorized pickup transport team.</li>
        </ul>
      </div>
    </PolicyLayout>
  );
}
