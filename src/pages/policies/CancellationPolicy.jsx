import React from "react";
import PolicyLayout from "./PolicyLayout";

export default function CancellationPolicy() {
  return (
    <PolicyLayout
      title="Cancellation Policy"
      subtitle="Clear rules on order cancellations, fabrication cut-off stages, and refund triggers."
      lastUpdated="November 26, 2026"
    >
      <div className="policy-section">
        <h2>1. Cancellation Overview</h2>
        <p>
          Because <strong>Vishwakarma Engineer Workshop</strong> produces heavy metal structures, specialized architectural grilles, and custom steel fabrications, order cancellation eligibility depends on the current stage of manufacturing and fulfillment.
        </p>
      </div>

      <div className="policy-section">
        <h2>2. Standard Catalog Orders</h2>
        <p>For standard prefabricated products (standard grill panels, readymade brackets, clamps, hinges, accessories):</p>
        <ul>
          <li><strong>Before Dispatch:</strong> You may cancel standard orders at any time prior to shipping through the <strong>My Orders</strong> section. 100% refund will be issued via Razorpay.</li>
          <li><strong>After Dispatch:</strong> Once handed over to the courier or transport vehicle, standard orders cannot be directly cancelled in transit. You must accept delivery and initiate a standard return request according to our Return Policy.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>3. Custom Fabrication & Made-to-Order Items</h2>
        <p>For bespoke gates, architectural railings, spiral stairs, or custom dimension orders:</p>
        <ul>
          <li><strong>Stage 1 (Pending / Review):</strong> 100% refund if cancellation is requested before engineering drawings and raw material allocation have commenced (typically within 12 hours of order placement).</li>
          <li><strong>Stage 2 (In Production / Material Cut):</strong> If raw structural steel, aluminum extrusions, or laser sheet plates have already been cut to your specified dimensions, cancellations may incur a 20%–40% material forfeiture deduction to cover non-reusable scrap metal.</li>
          <li><strong>Stage 3 (Welded / Powder Coated / Ready to Dispatch):</strong> Once custom fabrication and specialized coating are completed, the order is non-cancellable as the item cannot be resold to other customers.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>4. How to Request Cancellation</h2>
        <ol>
          <li>Log in and open <strong>My Orders</strong>.</li>
          <li>Find the order you wish to cancel and click <strong>"Cancel Order"</strong>.</li>
          <li>Select a valid reason from the dropdown (e.g., duplicate order, incorrect dimensions entered, ordered by mistake, delayed timeline).</li>
          <li>Confirm the prompt. A unique <strong>Cancellation ID (CAN-YYYYMMDD-XXXX)</strong> will be generated.</li>
          <li>Admin will review and approve or provide feedback within 12 hours.</li>
        </ol>
      </div>

      <div className="policy-section">
        <h2>5. Cancellation by Workshop</h2>
        <p>Vishwakarma Engineer Workshop reserves the right to cancel an order under exceptional circumstances:</p>
        <ul>
          <li>Unavailability of specified metal grades or specialized laser consumables that cannot be sourced within acceptable timelines.</li>
          <li>Site delivery address is inaccessible by transport freight vehicles or lies outside serviceable logistics zones.</li>
          <li>Identification of fraudulent payment indicators by our payment gateway.</li>
        </ul>
        <p>In all workshop-initiated cancellations, a 100% full refund will be processed immediately through Razorpay.</p>
      </div>
    </PolicyLayout>
  );
}
