import React from "react";
import PolicyLayout from "./PolicyLayout";
export default function Disclaimer() {
  return (
    <PolicyLayout
      title="Disclaimer"
      subtitle="Important legal, dimensional, and material variations disclosures for metal fabrications."
      lastUpdated="November 26, 2026"
    >
      <div className="policy-section">
        <h2>1. Material & Surface Variations</h2>
        <p>
          Handcrafted and machine-fabricated metal structures, including wrought iron, mild steel (MS), stainless steel (SS), and aluminum extrusions, are natural metallurgical products. You acknowledge and accept that:
        </p>
        <ul>
          <li><strong>Finish & Color Tone:</strong> Due to screen calibration differences, lighting conditions, and powder coating batch lots, actual product colors and surface textures may vary marginally from digital website images.</li>
          <li><strong>Weld Seams & Grind Marks:</strong> High-strength structural welding requires heat penetration, grinding, and blending. Minor weld texture variations are a hallmark of structural fabrication and not defects.</li>
          <li><strong>Dimensional Tolerances:</strong> In accordance with standard fabrication engineering practices, hand-assembled ironwork maintains an industry-standard dimensional tolerance of ±2mm to ±4mm.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>2. Environmental Exposure & Rusting</h2>
        <p>
          Unless Stainless Steel 304/316 grade or hot-dip galvanization is explicitly specified, Mild Steel (MS) products require ongoing protective coatings:
        </p>
        <ul>
          <li>Products treated with red-oxide primer or standard enamel paint require periodic repainting when exposed to humid outdoor monsoon environments.</li>
          <li>Surface rust appearing months after installation due to exterior weather exposure or paint chipping does not constitute a manufacturing defect.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>3. Structural Load & Installation Safety</h2>
        <p>
          Gates, staircases, heavy grills, and balcony railings must be installed into solid masonry, RCC concrete pillars, or structural steel columns using appropriate anchor fasteners. Vishwakarma Engineer Workshop is not liable for structural failures resulting from:
        </p>
        <ul>
          <li>Weak crumbling masonry or improper customer wall foundations.</li>
          <li>Third-party contractor installation errors or inadequate anchoring.</li>
          <li>Usage beyond rated design loads (e.g. hanging excessive loads or vehicles from gates).</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>4. External Links & Website Information</h2>
        <p>
          Our website may contain links to external third-party resources (such as courier tracking portals or payment processors). We do not guarantee the completeness or accuracy of third-party platforms and accept no liability for external actions.
        </p>
      </div>

      <div className="policy-section">
        <h2>5. Professional Guidance</h2>
        <p>
          The information and dimensional calculators provided on this site are for estimation and informational purposes. Customers are advised to consult our engineering team or a licensed structural surveyor for high-stress architectural installations.
        </p>
      </div>
    </PolicyLayout>
  );
}
