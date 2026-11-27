import React from "react";
import PolicyLayout from "./PolicyLayout";

export default function ShippingPolicy() {
  return (
    <PolicyLayout
      title="Shipping & Delivery Policy"
      subtitle="Information on shipping methods, delivery timelines, freight transport, and site unloading."
      lastUpdated="November 26, 2026"
    >
      <div className="policy-section">
        <h2>1. Delivery Coverage</h2>
        <p>
          <strong>Vishwakarma Engineer Workshop</strong> provides delivery services across Lucknow, Uttar Pradesh, and adjoining North Indian states. For nationwide shipments of modular components and readymade hardware, we partner with reputable national logistics carriers.
        </p>
      </div>

      <div className="policy-section">
        <h2>2. Delivery Timelines & Manufacturing Periods</h2>
        <p>Delivery time comprises manufacturing/fabrication duration plus transit time:</p>
        <table className="policy-table">
          <thead>
            <tr>
              <th>Product Category</th>
              <th>Fabrication Duration</th>
              <th>Transit Time</th>
              <th>Total Estimated Delivery</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Standard Hardware, Brackets & Clamps</td>
              <td>1 – 2 Days (In Stock)</td>
              <td>2 – 4 Business Days</td>
              <td>3 – 6 Business Days</td>
            </tr>
            <tr>
              <td>Window Grills & Balcony Panels</td>
              <td>3 – 7 Working Days</td>
              <td>2 – 5 Business Days</td>
              <td>5 – 12 Business Days</td>
            </tr>
            <tr>
              <td>Heavy Iron Gates & Steel Railings</td>
              <td>7 – 15 Working Days</td>
              <td>Dedicated Freight (1–3 Days)</td>
              <td>8 – 18 Working Days</td>
            </tr>
            <tr>
              <td>Bespoke Architectural Structures</td>
              <td>15 – 30 Working Days</td>
              <td>Site Direct Transport</td>
              <td>As per Project Contract</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="policy-section">
        <h2>3. Freight Handling & Site Unloading</h2>
        <p>Because structural metal components are heavy and bulky, please review our site delivery protocols:</p>
        <ul>
          <li><strong>Standard Freight Delivery:</strong> Curbside or ground-level delivery at the nearest accessible road point where freight trucks can safely stop and unload.</li>
          <li><strong>Vertical Floor Shifting:</strong> Shifting gates, beams, or heavy railings to higher floors via stairs or crane is the customer's responsibility unless installation service has been explicitly purchased and confirmed in the order invoice.</li>
          <li><strong>Inspection on Arrival:</strong> Customers or authorized site representatives must inspect package integrity and structural soundness before signing the delivery proof (POD).</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>4. Shipping Charges & Taxes</h2>
        <p>
          Shipping charges are calculated based on item gross weight, volumetric dimensions, and transit distance. Exact delivery fees are displayed at checkout before payment. All listed prices include applicable Goods and Services Tax (GST).
        </p>
      </div>

      <div className="policy-section">
        <h2>5. Order Tracking</h2>
        <p>
          Once your order is dispatched, a tracking reference ID and freight driver contact details will be uploaded to your dashboard. You can track your shipment anytime via the <strong>Track Order</strong> section of our website.
        </p>
      </div>

      <div className="policy-section">
        <h2>6. Delivery Delays</h2>
        <p>
          Delays caused by natural disasters, monsoon road closures, regional transport union strikes, or municipal traffic restrictions for heavy vehicles are beyond our direct control. We will proactively notify customers of any schedule changes.
        </p>
      </div>
    </PolicyLayout>
  );
}
