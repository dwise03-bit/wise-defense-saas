'use client';

import React, { useState, ChangeEvent } from 'react';

export default function IntakeForm() {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1200);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
          ? [...(prev[name] || []), value]
          : (prev[name] || []).filter((v: string) => v !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
        ? [...(prev[name] || []), value]
        : (prev[name] || []).filter((v: string) => v !== value)
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, files: e.target.files }));
  };

  const Section = ({ num, title, children, style }: { num: string; title: string; children: React.ReactNode; style?: React.CSSProperties }) => (
    <section style={style} className="cyber-section">
      <h2 className="section-title">## {num} {title}</h2>
      <div className="section-content">{children}</div>
    </section>
  );

  return (
    <div className="intake-container">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { font-family: 'Courier New', monospace; color: #eef8ff; background: #000; }

        .intake-container {
          background-image: url(/intake-design.png);
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          min-height: 100vh;
          position: relative;
          padding: 20px;
        }

        /* Overlay for better text readability */
        .intake-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.3);
          pointer-events: none;
          z-index: 0;
        }

        .form-wrapper {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
        }

        .hero-section {
          text-align: center;
          padding: 40px 20px;
          margin-bottom: 40px;
          background: rgba(0,0,0,0.7);
          border: 2px solid #00aeff;
          border-radius: 8px;
          box-shadow: 0 0 30px rgba(0,174,255,0.5), inset 0 0 20px rgba(0,174,255,0.1);
        }

        .hero-section h1 {
          font-size: clamp(28px, 5vw, 48px);
          color: #00aeff;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin: 10px 0;
          text-shadow: 0 0 20px rgba(0,174,255,0.8);
        }

        .hero-section p {
          color: #00aeff;
          letter-spacing: 2px;
          font-size: 14px;
          margin: 8px 0;
        }

        .hero-section .small {
          color: #91c8e8;
          letter-spacing: 0;
          margin-top: 12px;
        }

        /* Desktop 3-column layout */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          grid-auto-rows: min-content;
          margin-bottom: 40px;
        }

        .left-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .center-column {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 20px;
          min-height: 600px;
        }

        .right-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .cyber-section {
          border: 2px solid #00aeff;
          border-radius: 6px;
          padding: 16px;
          background: rgba(0,0,0,0.65);
          box-shadow: 0 0 20px rgba(0,174,255,0.3), inset 0 0 15px rgba(0,174,255,0.05);
          transition: all 0.3s ease;
        }

        .cyber-section:hover {
          box-shadow: 0 0 30px rgba(0,174,255,0.5), inset 0 0 20px rgba(0,174,255,0.1);
          border-color: #00d9ff;
        }

        .section-title {
          color: #00aeff;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 12px;
          text-shadow: 0 0 10px rgba(0,174,255,0.6);
        }

        .section-content label {
          display: block;
          color: #91c8e8;
          font-size: 11px;
          margin-bottom: 6px;
          margin-top: 8px;
        }

        .section-content label input,
        .section-content textarea {
          display: block;
          width: 100%;
          padding: 8px;
          margin-top: 4px;
          border: 1px solid rgba(0,174,255,0.5);
          border-radius: 4px;
          background: rgba(0,0,0,0.6);
          color: #eef8ff;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          outline: none;
          transition: all 0.2s ease;
        }

        .section-content input:focus,
        .section-content textarea:focus {
          border-color: #00aeff;
          box-shadow: 0 0 10px rgba(0,174,255,0.5), inset 0 0 5px rgba(0,174,255,0.1);
          background: rgba(0,0,0,0.7);
        }

        .section-content textarea {
          min-height: 60px;
          resize: vertical;
        }

        .checkbox-group {
          display: grid;
          grid-template-columns: 1fr;
          gap: 6px;
        }

        .checkbox-group label {
          display: flex;
          align-items: center;
          padding: 6px;
          border: 1px solid rgba(0,174,255,0.3);
          border-radius: 4px;
          background: rgba(0,0,0,0.4);
          cursor: pointer;
          transition: all 0.2s ease;
          margin: 0;
          margin-top: 0;
        }

        .checkbox-group label:hover {
          border-color: #00aeff;
          background: rgba(0,174,255,0.1);
        }

        .checkbox-group input[type="checkbox"] {
          width: auto;
          margin-right: 6px;
          margin-top: 0;
          cursor: pointer;
        }

        .warning-box {
          color: #fff;
          border-left: 3px solid #00aeff;
          padding: 8px;
          background: rgba(0,174,255,0.15);
          font-size: 11px;
          margin-bottom: 8px;
        }

        .note-text {
          color: #91c8e8;
          font-size: 11px;
          margin-bottom: 8px;
        }

        .submit-button {
          width: 100%;
          padding: 14px;
          border: 2px solid #00aeff;
          border-radius: 6px;
          background: linear-gradient(90deg, rgba(0,123,255,0.8), rgba(0,174,255,0.8));
          color: #00111d;
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(0,174,255,0.6);
          transition: all 0.3s ease;
          font-family: 'Courier New', monospace;
        }

        .submit-button:hover {
          background: linear-gradient(90deg, rgba(0,123,255,1), rgba(0,174,255,1));
          box-shadow: 0 0 30px rgba(0,174,255,0.8);
          transform: translateY(-2px);
        }

        /* Mobile responsive */
        @media (max-width: 1199px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .center-column {
            min-height: auto;
            order: 3;
          }

          .cyber-section {
            padding: 12px;
          }

          .section-content label input,
          .section-content textarea {
            padding: 6px;
            font-size: 11px;
          }

          .section-title {
            font-size: 11px;
          }
        }

        @media (max-width: 768px) {
          .intake-container {
            padding: 10px;
          }

          .hero-section {
            padding: 20px 10px;
            margin-bottom: 20px;
          }

          .hero-section h1 {
            font-size: 24px;
            letter-spacing: 2px;
          }

          .form-grid {
            gap: 15px;
          }

          .cyber-section {
            padding: 10px;
          }

          .section-title {
            font-size: 10px;
            margin-bottom: 8px;
          }

          .section-content label {
            font-size: 10px;
            margin-top: 6px;
          }

          .section-content label input,
          .section-content textarea {
            padding: 5px;
            font-size: 10px;
          }

          .submit-button {
            padding: 10px;
            font-size: 12px;
          }
        }
      `}</style>

      <div className="form-wrapper">
        <section className="hero-section">
          <h1>WISE² Client Information Form</h1>
          <p>One Platform. Infinite Knowledge. Unlimited Creation.</p>
          <p className="small">Fill this out so we can understand your business, your project, and what needs to be built.</p>
        </section>

        <form action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST" encType="multipart/form-data">
          <div className="form-grid">
            {/* LEFT COLUMN */}
            <div className="left-column">
              {/* 01 Contact Information */}
              <Section num="01" title="CONTACT INFORMATION">
                <label>Full Name* <input required name="full_name" type="text" onChange={handleChange} /></label>
                <label>Company Name* <input required name="company_name" type="text" onChange={handleChange} /></label>
                <label>Job Title <input name="job_title" type="text" onChange={handleChange} /></label>
                <label>Phone* <input required name="phone" type="tel" onChange={handleChange} /></label>
                <label>Email* <input required name="email" type="email" onChange={handleChange} /></label>
                <label>Address <input name="business_address" type="text" onChange={handleChange} /></label>
                <label>Website <input name="website" type="url" placeholder="https://" onChange={handleChange} /></label>
              </Section>

              {/* 03 Services Requested */}
              <Section num="03" title="SERVICES REQUESTED">
                <div className="checkbox-group">
                  <label><input type="checkbox" name="services" value="Website Design" onChange={handleCheckboxChange} /> Website Design</label>
                  <label><input type="checkbox" name="services" value="Website Redesign" onChange={handleCheckboxChange} /> Website Redesign</label>
                  <label><input type="checkbox" name="services" value="E-Commerce Store" onChange={handleCheckboxChange} /> E-Commerce</label>
                  <label><input type="checkbox" name="services" value="Logo Design" onChange={handleCheckboxChange} /> Logo Design</label>
                  <label><input type="checkbox" name="services" value="Branding" onChange={handleCheckboxChange} /> Branding</label>
                  <label><input type="checkbox" name="services" value="Graphic Design" onChange={handleCheckboxChange} /> Graphic Design</label>
                  <label><input type="checkbox" name="services" value="Social Media Content" onChange={handleCheckboxChange} /> Social Media</label>
                  <label><input type="checkbox" name="services" value="Photography" onChange={handleCheckboxChange} /> Photography</label>
                  <label><input type="checkbox" name="services" value="Video Production" onChange={handleCheckboxChange} /> Video Production</label>
                  <label><input type="checkbox" name="services" value="Video Editing" onChange={handleCheckboxChange} /> Video Editing</label>
                  <label><input type="checkbox" name="services" value="SEO" onChange={handleCheckboxChange} /> SEO</label>
                  <label><input type="checkbox" name="services" value="Google Business Profile" onChange={handleCheckboxChange} /> Google Business</label>
                  <label><input type="checkbox" name="services" value="AI Automation" onChange={handleCheckboxChange} /> AI Automation</label>
                  <label><input type="checkbox" name="services" value="Marketing Strategy" onChange={handleCheckboxChange} /> Marketing</label>
                  <label><input type="checkbox" name="services" value="Business Consulting" onChange={handleCheckboxChange} /> Consulting</label>
                  <label><input type="checkbox" name="services" value="Training / Courses" onChange={handleCheckboxChange} /> Training</label>
                </div>
                <label style={{ marginTop: '8px' }}>Other <input name="other_service" type="text" onChange={handleChange} /></label>
              </Section>

              {/* 05 Branding */}
              <Section num="05" title="BRANDING">
                <div className="checkbox-group">
                  <label><input type="checkbox" name="current_assets" value="Logo" onChange={handleCheckboxChange} /> Logo</label>
                  <label><input type="checkbox" name="current_assets" value="Brand Colors" onChange={handleCheckboxChange} /> Brand Colors</label>
                  <label><input type="checkbox" name="current_assets" value="Fonts" onChange={handleCheckboxChange} /> Fonts</label>
                  <label><input type="checkbox" name="current_assets" value="Brand Guide" onChange={handleCheckboxChange} /> Brand Guide</label>
                  <label><input type="checkbox" name="current_assets" value="Photos" onChange={handleCheckboxChange} /> Photos</label>
                  <label><input type="checkbox" name="current_assets" value="Videos" onChange={handleCheckboxChange} /> Videos</label>
                  <label><input type="checkbox" name="current_assets" value="None" onChange={handleCheckboxChange} /> None</label>
                </div>
              </Section>

              {/* 07 Social Media */}
              <Section num="07" title="SOCIAL MEDIA">
                <label>Facebook <input name="facebook" type="url" onChange={handleChange} /></label>
                <label>Instagram <input name="instagram" type="url" onChange={handleChange} /></label>
                <label>TikTok <input name="tiktok" type="url" onChange={handleChange} /></label>
                <label>LinkedIn <input name="linkedin" type="url" onChange={handleChange} /></label>
                <label>YouTube <input name="youtube" type="url" onChange={handleChange} /></label>
                <label>Other <input name="other_social" type="text" onChange={handleChange} /></label>
              </Section>

              {/* 09 Project Timeline & Budget */}
              <Section num="09" title="TIMELINE & BUDGET">
                <label>Start Date <input name="start_date" type="date" onChange={handleChange} /></label>
                <label>Completion Date <input name="completion_date" type="date" onChange={handleChange} /></label>
                <label>Budget <input name="budget" type="text" placeholder="$" onChange={handleChange} /></label>
                <label>Details <textarea name="deadline_details" onChange={handleChange}></textarea></label>
              </Section>

              {/* 11 Preferred Communication */}
              <Section num="11" title="COMMUNICATION">
                <div className="checkbox-group">
                  <label><input type="checkbox" name="communication" value="Phone" onChange={handleCheckboxChange} /> Phone</label>
                  <label><input type="checkbox" name="communication" value="Text Message" onChange={handleCheckboxChange} /> Text</label>
                  <label><input type="checkbox" name="communication" value="Email" onChange={handleCheckboxChange} /> Email</label>
                  <label><input type="checkbox" name="communication" value="Zoom / Google Meet" onChange={handleCheckboxChange} /> Video Call</label>
                </div>
              </Section>
            </div>

            {/* CENTER COLUMN - Can hold messaging or spacing */}
            <div className="center-column">
              <div style={{ textAlign: 'center', color: '#00aeff', fontSize: '12px', opacity: 0.6 }}>
                BUILDING SERVICES<br/>INTEGRATING ACCESS
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="right-column">
              {/* 02 About Your Business */}
              <Section num="02" title="ABOUT YOUR BUSINESS">
                <label>Describe <textarea name="business_description" onChange={handleChange}></textarea></label>
                <label>Products/Services <textarea name="products_services" onChange={handleChange}></textarea></label>
                <label>Target Audience <textarea name="target_audience" onChange={handleChange}></textarea></label>
                <label>Unique Value <textarea name="unique_value" onChange={handleChange}></textarea></label>
              </Section>

              {/* 04 Project Information */}
              <Section num="04" title="PROJECT INFORMATION">
                <label>Project* <textarea required name="project_description" onChange={handleChange}></textarea></label>
                <label>Primary Goal <textarea name="primary_goal" onChange={handleChange}></textarea></label>
                <label>Examples <textarea name="examples_like" placeholder="Paste links" onChange={handleChange}></textarea></label>
                <label>Avoid <textarea name="avoid" onChange={handleChange}></textarea></label>
              </Section>

              {/* 06 Website Information */}
              <Section num="06" title="WEBSITE INFORMATION">
                <label>Current Website <input name="current_website" type="url" placeholder="https://" onChange={handleChange} /></label>
                <label>Domain <input name="domain_name" type="text" onChange={handleChange} /></label>
                <label>Hosting <input name="hosting_company" type="text" onChange={handleChange} /></label>
                <div className="checkbox-group" style={{ marginTop: '8px' }}>
                  <label><input type="checkbox" name="website_needs" value="New Website" onChange={handleCheckboxChange} /> New</label>
                  <label><input type="checkbox" name="website_needs" value="Website Updates" onChange={handleCheckboxChange} /> Updates</label>
                  <label><input type="checkbox" name="website_needs" value="Online Store" onChange={handleCheckboxChange} /> Store</label>
                  <label><input type="checkbox" name="website_needs" value="Booking System" onChange={handleCheckboxChange} /> Booking</label>
                  <label><input type="checkbox" name="website_needs" value="Membership Area" onChange={handleCheckboxChange} /> Membership</label>
                  <label><input type="checkbox" name="website_needs" value="Blog" onChange={handleCheckboxChange} /> Blog</label>
                  <label><input type="checkbox" name="website_needs" value="Contact Forms" onChange={handleCheckboxChange} /> Forms</label>
                  <label><input type="checkbox" name="website_needs" value="Payment Processing" onChange={handleCheckboxChange} /> Payments</label>
                </div>
              </Section>

              {/* 08 Business Assets */}
              <Section num="08" title="BUSINESS ASSETS">
                <p className="note-text">Upload logos, photos, price lists, guides, docs</p>
                <input name="files" type="file" multiple onChange={handleFileChange} style={{ padding: '4px', fontSize: '11px' }} />
              </Section>

              {/* 10 Login / Access Information */}
              <Section num="10" title="ACCESS INFORMATION">
                <div className="warning-box">Do not enter passwords. We'll request separately.</div>
                <label>Domain Registrar <input name="domain_registrar" type="text" onChange={handleChange} /></label>
                <label>Hosting <input name="hosting_provider" type="text" onChange={handleChange} /></label>
                <label>Platform <input name="website_platform" type="text" onChange={handleChange} /></label>
                <label>Google Email <input name="google_email" type="email" onChange={handleChange} /></label>
                <label>Meta Manager <input name="meta_business" type="text" onChange={handleChange} /></label>
                <label>Stripe Email <input name="stripe_email" type="email" onChange={handleChange} /></label>
                <label>Other <textarea name="other_access" onChange={handleChange}></textarea></label>
              </Section>

              {/* 12 Additional Information */}
              <Section num="12" title="ADDITIONAL INFO">
                <label>Anything else? <textarea name="additional_info" onChange={handleChange}></textarea></label>
              </Section>
            </div>
          </div>

          {/* 13 Client Approval - Full Width Bottom */}
          <Section num="13" title="CLIENT APPROVAL" style={{ marginTop: '30px' }}>
            <label>Client Name* <input required name="client_name" type="text" onChange={handleChange} /></label>
            <label>Date* <input required name="approval_date" type="date" onChange={handleChange} /></label>
            <label style={{ marginTop: '8px', display: 'flex', alignItems: 'center' }}>
              <input required type="checkbox" name="agreement" value="Approved" onChange={handleCheckboxChange} style={{ marginRight: '6px' }} />
              I certify the information is accurate
            </label>
          </Section>

          <button className="submit-button" type="submit" style={{ marginTop: '30px' }}>Submit Client Intake</button>
        </form>
      </div>
    </div>
  );
}
