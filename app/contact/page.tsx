"use client";

import { useState } from "react";
import Image from "next/image";
import WaveformDivider from "@/components/ui/WaveformDivider";
import DragDropZone from "@/components/ui/DragDropZone";

type FormData = {
  type: string;
  bandName: string;
  genre: string;
  memberCount: string;
  city: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  links: string;
};

export default function ContactPage() {
  const [formType, setFormType] = useState<"band" | "partner" | "other">("band");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    type: "band",
    bandName: "",
    genre: "",
    memberCount: "",
    city: "",
    name: "",
    email: "",
    phone: "",
    message: "",
    links: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle = {
    width: "100%",
    background: "#FFFFFF",
    border: "1px solid rgba(0, 0, 0, 0.15)",
    padding: "1rem 1.25rem",
    color: "#0F1115",
    fontFamily: "var(--font-body)",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    borderRadius: "6px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
  };

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          paddingTop: "160px",
          paddingBottom: "4rem",
          background: "var(--bg)",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src="/images/guitar.jpg"
            alt=""
            fill
            style={{ objectFit: "cover", opacity: 0.1, filter: "saturate(0.3)" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, var(--bg) 0%, transparent 50%, var(--bg) 100%)",
            }}
          />
        </div>

        {/* Red beam */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "100%",
            background:
              "radial-gradient(ellipse 300px 400px at 50% 0%, rgba(200,16,46,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "700px",
            margin: "0 auto",
            padding: "0 2.5rem",
            textAlign: "center",
          }}
        >
          <p
            className="label-caps"
            style={{ marginBottom: "2rem", animation: "fade-in 0.8s ease forwards" }}
          >
            ⸺ Register · Partner · Connect ⸺
          </p>
          <h1
            className="display-hero"
            style={{
              fontSize: "clamp(3rem, 9vw, 7rem)",
              color: "var(--bone)",
              animation: "slide-up 1s ease 0.3s forwards",
              opacity: 0,
            }}
          >
            Your Stage<br />
            <span style={{ color: "var(--red)" }}>Awaits</span>
          </h1>
          <p
            className="body-copy"
            style={{
              marginTop: "2rem",
              fontSize: "1.05rem",
              animation: "slide-up 1s ease 0.6s forwards",
              opacity: 0,
            }}
          >
            Register your band, enquire about partnership, or just say hello.
            We read every message — because every band and every partner matters.
          </p>
        </div>
      </section>

      <WaveformDivider />

      {/* ─── CONTACT FORM ─────────────────────────────────────────────────── */}
      <section className="contact-form-section" style={{ padding: "6rem 2.5rem 8rem", maxWidth: "800px", margin: "0 auto" }}>
        {submitted ? (
          /* Success State */
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "var(--red)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 2rem",
                fontSize: "2rem",
                boxShadow: "0 0 25px rgba(230,20,56,0.5)",
              }}
            >
              ✓
            </div>
            <h2
              className="display-section"
              style={{ fontSize: "2.5rem", color: "var(--bone)", marginBottom: "1rem" }}
            >
              Message Received
            </h2>
            <p className="body-copy" style={{ fontSize: "1.05rem" }}>
              We&apos;ll be in touch within 48 hours. Get ready — the stage is closer than you think.
            </p>
          </div>
        ) : (
          <>
            {/* Type Selector */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "3rem",
                flexWrap: "wrap",
              }}
            >
              {[
                { key: "band", label: "Register My Band" },
                { key: "partner", label: "Partnership Enquiry" },
                { key: "other", label: "Other" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setFormType(opt.key as typeof formType)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: formType === opt.key ? "var(--red)" : "#FFFFFF",
                    border: `1px solid ${formType === opt.key ? "var(--red)" : "var(--border)"}`,
                    color: formType === opt.key ? "#FFFFFF" : "var(--bone)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    borderRadius: "6px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Band-specific fields */}
              {formType === "band" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }} className="form-grid">
                    <div>
                      <label className="label-caps" style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.65rem" }}>
                        Band Name *
                      </label>
                      <input
                        style={inputStyle}
                        name="bandName"
                        value={formData.bandName}
                        onChange={handleChange}
                        placeholder="The Midnight Signal"
                        required
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--red)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                      />
                    </div>
                    <div>
                      <label className="label-caps" style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.65rem" }}>
                        Genre *
                      </label>
                      <input
                        style={inputStyle}
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        placeholder="Alternative Rock"
                        required
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--red)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                      />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }} className="form-grid">
                    <div>
                      <label className="label-caps" style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.65rem" }}>
                        Number of Members *
                      </label>
                      <select
                        style={{ ...inputStyle, cursor: "pointer" }}
                        name="memberCount"
                        value={formData.memberCount}
                        onChange={handleChange}
                        required
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--red)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                      >
                        <option value="">Select...</option>
                        {["3", "4", "5", "6"].map((n) => (
                          <option key={n} value={n}>{n} members</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label-caps" style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.65rem" }}>
                        City *
                      </label>
                      <input
                        style={inputStyle}
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Hyderabad"
                        required
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--red)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label-caps" style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.65rem" }}>
                      Music Links (Instagram, YouTube, Spotify, SoundCloud)
                    </label>
                    <input
                      style={inputStyle}
                      name="links"
                      value={formData.links}
                      onChange={handleChange}
                      placeholder="https://..."
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--red)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                  </div>
                </>
              )}

              {/* Common fields */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }} className="form-grid">
                <div>
                  <label className="label-caps" style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.65rem" }}>
                    Your Name *
                  </label>
                  <input
                    style={inputStyle}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--red)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  />
                </div>
                <div>
                  <label className="label-caps" style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.65rem" }}>
                    Email *
                  </label>
                  <input
                    style={inputStyle}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@band.com"
                    required
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--red)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  />
                </div>
              </div>

              <div>
                <label className="label-caps" style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.65rem" }}>
                  Phone
                </label>
                <input
                  style={inputStyle}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9XXXXXXXXX"
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--red)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
              </div>

              <div>
                <label className="label-caps" style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.65rem" }}>
                  {formType === "band"
                    ? "Tell us about your band and why you want to play RITHMOS"
                    : "Your message"}
                </label>
                <textarea
                  style={{ ...inputStyle, resize: "vertical", minHeight: "140px" }}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={
                    formType === "band"
                      ? "We've been playing together for 2 years. Our sound is..."
                      : "I'm interested in..."
                  }
                  rows={5}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--red)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
              </div>

              {/* File Upload Dropzone (Band Only) */}
              {formType === "band" && <DragDropZone />}

              {/* Privacy note */}
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--muted)" }}>
                By submitting this form you agree to be contacted by the RITHMOS team
                regarding your enquiry. We don't share your details with third parties.
              </p>

              {/* Submit */}
              <button
                type="submit"
                className="btn-primary"
                style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
              >
                {formType === "band" ? "Submit Registration →" : "Send Message →"}
              </button>
            </form>
          </>
        )}
      </section>

      {/* ─── DIRECT CONTACT ───────────────────────────────────────────────── */}
      <section
        style={{
          padding: "4rem 2.5rem 6rem",
          background: "#F8F9FA",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2rem",
          }}
          className="contact-info"
        >
          {[
            { label: "General", value: "hello@rithmos.in", icon: "✉" },
            { label: "Partnerships", value: "partners@rithmos.in", icon: "◉" },
            { label: "Press & Media", value: "press@rithmos.in", icon: "◆" },
          ].map((c) => (
            <div key={c.label}>
              <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{c.icon}</p>
              <p className="label-caps" style={{ marginBottom: "0.25rem", fontSize: "0.65rem" }}>{c.label}</p>
              <a
                href={`mailto:${c.value}`}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "var(--red)",
                  textDecoration: "none",
                }}
              >
                {c.value}
              </a>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .contact-form-section { padding: 3.5rem 1.25rem 4rem !important; }
          .form-grid { grid-template-columns: 1fr !important; }
          .contact-info { grid-template-columns: 1fr !important; gap: 1.25rem !important; }
        }
      `}</style>
    </>
  );
}
