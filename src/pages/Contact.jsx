import React, { useState } from "react";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Ruler,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import api from "../services/api";
import "src/pages/Css/Contact.jsx";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Custom Fabrication",
    message: "",
  });
  const [notice, setNotice] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/enquiries", form);
      setNotice("Thank you! Your enquiry has been received.");
      setForm({
        name: "",
        email: "",
        phone: "",
        service: "Custom Fabrication",
        message: "",
      });
    } catch (err) {
      setNotice(err.response?.data?.message || "Could not submit enquiry.");
    }
  };
  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="container contact-hero-inner">
          <div className="contact-hero-copy">
            <span className="eyebrow gold">CONTACT OUR WORKSHOP</span>
            <h1>
              Let’s shape your next <em>project.</em>
            </h1>
            <p>
              Tell us what you’re planning. We’ll help turn your requirements
              into carefully crafted metalwork.
            </p>
            <a className="btn btn-gold" href="#contact-form">
              Send an enquiry <ArrowRight size={17} />
            </a>
          </div>
          <div className="contact-hero-art" aria-hidden="true">
            <div className="contact-art-frame">
              <Wrench size={58} strokeWidth={1.2} />
              <span>CRAFTED FOR YOUR SPACE</span>
            </div>
            <img src="../Images/content.png" alt="images" />
          </div>
        </div>
      </section>

      <section className="container contact-content">
        <div className="contact-highlights">
          <article>
            <span><Ruler size={20} /></span>
            <div><b>Made to measure</b><small>Planned around your space</small></div>
          </article>
          <article>
            <span><ShieldCheck size={20} /></span>
            <div><b>Built with care</b><small>Thoughtful, detailed fabrication</small></div>
          </article>
          <article>
            <span><Wrench size={20} /></span>
            <div><b>Custom solutions</b><small>Share your ideas with our team</small></div>
          </article>
        </div>

        <div className="contact-grid" id="contact-form">
          <aside className="contact-info">
            <span className="eyebrow gold">GET IN TOUCH</span>
            <h2>Let’s talk about your project.</h2>
            <p className="contact-info-intro">
              Send us a few details and we’ll be ready to discuss what you need.
            </p>
            <div className="contact-detail">
              <MapPin />
              <span>
                <b>Visit workshop</b>
                <small>Near Thadeswari Ashram, Bharuwa Sumerpur , Station Road, Hamirpur, Uttar Pradesh-210301  </small>
              </span>
            </div>
            <div className="contact-detail">
              <Phone />
              <span>
                <b>Call us</b>
                <small>+91 9569801987</small>
              </span>
            </div>
            <div className="contact-detail">
              <Mail />
              <span>
                <b>Email</b>
                <small>vishwkarmaneeraj63@gmail.com</small>
              </span>
            </div>
            <div className="contact-info-footer">VISHWAKARMA ENGINEER WORKSHOP</div>
          </aside>

          <form className="form-card contact-form" onSubmit={submit}>
            <span className="eyebrow">START A CONVERSATION</span>
            <h2>Request a quote</h2>
            <p className="contact-form-intro">
              Fill in the form and tell us a little about your project.
            </p>
            {notice && <p className="notice" role="status">{notice}</p>}
            <div className="contact-fields">
              <label>
                Name
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
              <label>
                Phone
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
              <label>
                Service
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                >
                  {[
                    "Iron Gates",
                    "Steel Railings",
                    "Windows & Grills",
                    "Aluminium",
                    "Custom Fabrication",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Project details
              <textarea
                rows="4"
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </label>
            <button className="btn btn-dark full">
              Send enquiry <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
