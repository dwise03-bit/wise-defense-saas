'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  validateRequired,
  validateEmail,
  validatePhone,
  validateUrl,
  validateDate,
  validateCheckboxArray,
  validateFiles,
} from '@/lib/intake-validation';

interface FormData {
  full_name: string;
  company_name: string;
  job_title: string;
  phone: string;
  email: string;
  business_address: string;
  website: string;
  business_description: string;
  products_services: string;
  target_audience: string;
  unique_value: string;
  services_requested: string[];
  other_service: string;
  project_description: string;
  primary_goal: string;
  examples_like: string;
  avoid: string;
  current_assets: string[];
  current_website: string;
  domain_name: string;
  hosting_company: string;
  website_needs: string[];
  facebook: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
  youtube: string;
  other_social: string;
  files: FileList | null;
  domain_registrar: string;
  hosting_provider: string;
  website_platform: string;
  google_email: string;
  meta_business: string;
  stripe_email: string;
  other_access: string;
  start_date: string;
  completion_date: string;
  budget: string;
  deadline_details: string;
  communication_preference: string[];
  additional_info: string;
  client_name: string;
  approval_date: string;
  agreement: boolean;
}

export default function IntakeForm() {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    company_name: '',
    job_title: '',
    phone: '',
    email: '',
    business_address: '',
    website: '',
    business_description: '',
    products_services: '',
    target_audience: '',
    unique_value: '',
    services_requested: [],
    other_service: '',
    project_description: '',
    primary_goal: '',
    examples_like: '',
    avoid: '',
    current_assets: [],
    current_website: '',
    domain_name: '',
    hosting_company: '',
    website_needs: [],
    facebook: '',
    instagram: '',
    tiktok: '',
    linkedin: '',
    youtube: '',
    other_social: '',
    files: null,
    domain_registrar: '',
    hosting_provider: '',
    website_platform: '',
    google_email: '',
    meta_business: '',
    stripe_email: '',
    other_access: '',
    start_date: '',
    completion_date: '',
    budget: '',
    deadline_details: '',
    communication_preference: [],
    additional_info: '',
    client_name: '',
    approval_date: '',
    agreement: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [fieldName]: checked
        ? [...(prev[fieldName as keyof FormData] as string[]), value]
        : (prev[fieldName as keyof FormData] as string[]).filter(item => item !== value)
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, files: e.target.files }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'files') {
        if (value instanceof FileList) {
          for (let i = 0; i < value.length; i++) {
            formElement.append('files', value[i]);
          }
        }
      } else if (Array.isArray(value)) {
        formElement.append(key, JSON.stringify(value));
      } else if (typeof value === 'boolean') {
        formElement.append(key, value ? 'true' : 'false');
      } else {
        formElement.append(key, String(value));
      }
    });

    try {
      const response = await fetch('/api/intake/upload', {
        method: 'POST',
        body: formElement,
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          full_name: '',
          company_name: '',
          job_title: '',
          phone: '',
          email: '',
          business_address: '',
          website: '',
          business_description: '',
          products_services: '',
          target_audience: '',
          unique_value: '',
          services_requested: [],
          other_service: '',
          project_description: '',
          primary_goal: '',
          examples_like: '',
          avoid: '',
          current_assets: [],
          current_website: '',
          domain_name: '',
          hosting_company: '',
          website_needs: [],
          facebook: '',
          instagram: '',
          tiktok: '',
          linkedin: '',
          youtube: '',
          other_social: '',
          files: null,
          domain_registrar: '',
          hosting_provider: '',
          website_platform: '',
          google_email: '',
          meta_business: '',
          stripe_email: '',
          other_access: '',
          start_date: '',
          completion_date: '',
          budget: '',
          deadline_details: '',
          communication_preference: [],
          additional_info: '',
          client_name: '',
          approval_date: '',
          agreement: false,
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div style={{ '--bg': '#02070d', '--panel': 'rgba(4,18,33,.82)', '--blue': '#00aeff', '--blue2': '#007bff', '--text': '#eef8ff', '--muted': '#91c8e8', '--line': 'rgba(0,174,255,.55)' } as React.CSSProperties}>
      <style>{`
        :root {
          --bg: #02070d;
          --panel: rgba(4,18,33,.82);
          --blue: #00aeff;
          --blue2: #007bff;
          --text: #eef8ff;
          --muted: #91c8e8;
          --line: rgba(0,174,255,.55);
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          color: var(--text);
          background: radial-gradient(circle at top, rgba(0,174,255,.25), transparent 35%), linear-gradient(180deg,#02070d,#000);
        }
        .page {
          max-width: 1180px;
          margin: auto;
          padding: 28px;
        }
        .hero {
          text-align: center;
          padding: 44px 18px;
          border: 1px solid var(--line);
          border-radius: 22px;
          background: linear-gradient(135deg,rgba(0,174,255,.15),rgba(0,0,0,.8));
          box-shadow: 0 0 35px rgba(0,174,255,.25);
          margin-bottom: 24px;
        }
        .badge {
          width: 72px;
          height: 72px;
          margin: 0 auto 18px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid var(--blue);
          color: var(--blue);
          box-shadow: 0 0 25px rgba(0,174,255,.7);
          font-size: 30px;
          font-weight: 900;
        }
        h1 {
          margin: 0;
          font-size: clamp(32px, 6vw, 72px);
          letter-spacing: 4px;
          text-transform: uppercase;
        }
        .hero p {
          color: var(--blue);
          letter-spacing: 3px;
          text-transform: uppercase;
          margin: 8px 0;
        }
        .hero .small {
          color: var(--muted);
          text-transform: none;
          letter-spacing: 0;
          margin: 12px 0 0 0;
        }
        .intake-form { margin-top: 24px; }
        .panel {
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 18px;
          background: var(--panel);
          box-shadow: inset 0 0 30px rgba(0,174,255,.08), 0 0 18px rgba(0,174,255,.12);
        }
        h2 {
          margin: 0 0 16px;
          color: var(--blue);
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 18px;
        }
        .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        label { display: block; color: var(--muted); font-size: 14px; }
        input, textarea {
          width: 100%;
          margin-top: 7px;
          padding: 12px;
          border: 1px solid rgba(0,174,255,.45);
          border-radius: 10px;
          background: rgba(0,0,0,.55);
          color: var(--text);
          outline: none;
        }
        textarea { min-height: 95px; resize: vertical; }
        input:focus, textarea:focus {
          border-color: var(--blue);
          box-shadow: 0 0 12px rgba(0,174,255,.35);
        }
        .checks { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
        .checks label, .agree {
          padding: 10px;
          border: 1px solid rgba(0,174,255,.25);
          border-radius: 10px;
          background: rgba(0,0,0,.25);
        }
        .checks input, .agree input { width: auto; margin-right: 8px; }
        .note { color: var(--muted); }
        .warning {
          color: #fff;
          border-left: 4px solid var(--blue);
          padding: 10px;
          background: rgba(0,174,255,.12);
        }
        .submit {
          width: 100%;
          padding: 18px;
          border: 0;
          border-radius: 14px;
          background: linear-gradient(90deg, var(--blue2), var(--blue));
          color: #00111d;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 0 28px rgba(0,174,255,.55);
        }
        .submit:hover { filter: brightness(1.12); }
        @media (max-width: 760px) {
          .page { padding: 14px; }
          .grid, .checks { grid-template-columns: 1fr; }
          h1 { letter-spacing: 2px; }
        }
      `}</style>

      <main className="page">
        <section className="hero">
          <div className="badge">W²</div>
          <h1>WISE² Client Information Form</h1>
          <p>One Platform. Infinite Knowledge. Unlimited Creation.</p>
          <p className="small">Fill this out so we can understand your business, your project, and what needs to be built.</p>
        </section>

        <form className="intake-form" onSubmit={handleSubmit}>
          {/* 01 Contact Information */}
          <section className="panel">
            <h2>01 Contact Information</h2>
            <div className="grid">
              <label>Full Name* <input required name="full_name" type="text" value={formData.full_name} onChange={handleInputChange} /></label>
              <label>Company Name* <input required name="company_name" type="text" value={formData.company_name} onChange={handleInputChange} /></label>
              <label>Job Title <input name="job_title" type="text" value={formData.job_title} onChange={handleInputChange} /></label>
              <label>Phone Number* <input required name="phone" type="tel" value={formData.phone} onChange={handleInputChange} /></label>
              <label>Email Address* <input required name="email" type="email" value={formData.email} onChange={handleInputChange} /></label>
              <label>Business Address <input name="business_address" type="text" value={formData.business_address} onChange={handleInputChange} /></label>
              <label>Website <input name="website" type="url" placeholder="https://" value={formData.website} onChange={handleInputChange} /></label>
            </div>
          </section>

          {/* 02 About Your Business */}
          <section className="panel">
            <h2>02 About Your Business</h2>
            <label>Describe your business <textarea name="business_description" value={formData.business_description} onChange={handleInputChange}></textarea></label>
            <label>What products or services do you offer? <textarea name="products_services" value={formData.products_services} onChange={handleInputChange}></textarea></label>
            <label>Who is your target audience? <textarea name="target_audience" value={formData.target_audience} onChange={handleInputChange}></textarea></label>
            <label>What makes your business unique? <textarea name="unique_value" value={formData.unique_value} onChange={handleInputChange}></textarea></label>
          </section>

          {/* 03 Services Requested */}
          <section className="panel">
            <h2>03 Services Requested*</h2>
            <div className="checks">
              <label><input type="checkbox" name="services" value="Website Design" checked={formData.services_requested.includes('Website Design')} onChange={(e) => handleCheckboxChange(e, 'services_requested')} /> Website Design</label>
              <label><input type="checkbox" name="services" value="Website Redesign" checked={formData.services_requested.includes('Website Redesign')} onChange={(e) => handleCheckboxChange(e, 'services_requested')} /> Website Redesign</label>
              <label><input type="checkbox" name="services" value="E-Commerce Store" checked={formData.services_requested.includes('E-Commerce Store')} onChange={(e) => handleCheckboxChange(e, 'services_requested')} /> E-Commerce Store</label>
              <label><input type="checkbox" name="services" value="Logo Design" checked={formData.services_requested.includes('Logo Design')} onChange={(e) => handleCheckboxChange(e, 'services_requested')} /> Logo Design</label>
              <label><input type="checkbox" name="services" value="Branding" checked={formData.services_requested.includes('Branding')} onChange={(e) => handleCheckboxChange(e, 'services_requested')} /> Branding</label>
              <label><input type="checkbox" name="services" value="Graphic Design" checked={formData.services_requested.includes('Graphic Design')} onChange={(e) => handleCheckboxChange(e, 'services_requested')} /> Graphic Design</label>
              <label><input type="checkbox" name="services" value="Social Media Content" checked={formData.services_requested.includes('Social Media Content')} onChange={(e) => handleCheckboxChange(e, 'services_requested')} /> Social Media Content</label>
              <label><input type="checkbox" name="services" value="Photography" checked={formData.services_requested.includes('Photography')} onChange={(e) => handleCheckboxChange(e, 'services_requested')} /> Photography</label>
              <label><input type="checkbox" name="services" value="Video Production" checked={formData.services_requested.includes('Video Production')} onChange={(e) => handleCheckboxChange(e, 'services_requested')} /> Video Production</label>
              <label><input type="checkbox" name="services" value="Video Editing" checked={formData.services_requested.includes('Video Editing')} onChange={(e) => handleCheckboxChange(e, 'services_requested')} /> Video Editing</label>
              <label><input type="checkbox" name="services" value="SEO" checked={formData.services_requested.includes('SEO')} onChange={(e) => handleCheckboxChange(e, 'services_requested')} /> SEO</label>
              <label><input type="checkbox" name="services" value="Google Business Profile" checked={formData.services_requested.includes('Google Business Profile')} onChange={(e) => handleCheckboxChange(e, 'services_requested')} /> Google Business Profile</label>
              <label><input type="checkbox" name="services" value="AI Automation" checked={formData.services_requested.includes('AI Automation')} onChange={(e) => handleCheckboxChange(e, 'services_requested')} /> AI Automation</label>
              <label><input type="checkbox" name="services" value="Marketing Strategy" checked={formData.services_requested.includes('Marketing Strategy')} onChange={(e) => handleCheckboxChange(e, 'services_requested')} /> Marketing Strategy</label>
              <label><input type="checkbox" name="services" value="Business Consulting" checked={formData.services_requested.includes('Business Consulting')} onChange={(e) => handleCheckboxChange(e, 'services_requested')} /> Business Consulting</label>
              <label><input type="checkbox" name="services" value="Training / Courses" checked={formData.services_requested.includes('Training / Courses')} onChange={(e) => handleCheckboxChange(e, 'services_requested')} /> Training / Courses</label>
            </div>
            <label style={{ marginTop: '14px' }}>Other <input name="other_service" type="text" value={formData.other_service} onChange={handleInputChange} /></label>
          </section>

          {/* 04 Project Information */}
          <section className="panel">
            <h2>04 Project Information</h2>
            <label>Describe your project* <textarea required name="project_description" value={formData.project_description} onChange={handleInputChange}></textarea></label>
            <label>What is your primary goal? <textarea name="primary_goal" value={formData.primary_goal} onChange={handleInputChange}></textarea></label>
            <label>Examples of what you like <textarea name="examples_like" placeholder="Paste links here" value={formData.examples_like} onChange={handleInputChange}></textarea></label>
            <label>What do you want to avoid? <textarea name="avoid" value={formData.avoid} onChange={handleInputChange}></textarea></label>
          </section>

          {/* 05 Branding */}
          <section className="panel">
            <h2>05 Branding</h2>
            <div className="checks">
              <label><input type="checkbox" name="current_assets" value="Logo" checked={formData.current_assets.includes('Logo')} onChange={(e) => handleCheckboxChange(e, 'current_assets')} /> Logo</label>
              <label><input type="checkbox" name="current_assets" value="Brand Colors" checked={formData.current_assets.includes('Brand Colors')} onChange={(e) => handleCheckboxChange(e, 'current_assets')} /> Brand Colors</label>
              <label><input type="checkbox" name="current_assets" value="Fonts" checked={formData.current_assets.includes('Fonts')} onChange={(e) => handleCheckboxChange(e, 'current_assets')} /> Fonts</label>
              <label><input type="checkbox" name="current_assets" value="Brand Guide" checked={formData.current_assets.includes('Brand Guide')} onChange={(e) => handleCheckboxChange(e, 'current_assets')} /> Brand Guide</label>
              <label><input type="checkbox" name="current_assets" value="Photos" checked={formData.current_assets.includes('Photos')} onChange={(e) => handleCheckboxChange(e, 'current_assets')} /> Photos</label>
              <label><input type="checkbox" name="current_assets" value="Videos" checked={formData.current_assets.includes('Videos')} onChange={(e) => handleCheckboxChange(e, 'current_assets')} /> Videos</label>
              <label><input type="checkbox" name="current_assets" value="None" checked={formData.current_assets.includes('None')} onChange={(e) => handleCheckboxChange(e, 'current_assets')} /> None</label>
            </div>
          </section>

          {/* 06 Website Information */}
          <section className="panel">
            <h2>06 Website Information</h2>
            <div className="grid">
              <label>Current Website <input name="current_website" type="url" placeholder="https://" value={formData.current_website} onChange={handleInputChange} /></label>
              <label>Domain Name <input name="domain_name" type="text" value={formData.domain_name} onChange={handleInputChange} /></label>
              <label>Hosting Company <input name="hosting_company" type="text" value={formData.hosting_company} onChange={handleInputChange} /></label>
            </div>
            <div className="checks">
              <label><input type="checkbox" name="website_needs" value="New Website" checked={formData.website_needs.includes('New Website')} onChange={(e) => handleCheckboxChange(e, 'website_needs')} /> New Website</label>
              <label><input type="checkbox" name="website_needs" value="Website Updates" checked={formData.website_needs.includes('Website Updates')} onChange={(e) => handleCheckboxChange(e, 'website_needs')} /> Website Updates</label>
              <label><input type="checkbox" name="website_needs" value="Online Store" checked={formData.website_needs.includes('Online Store')} onChange={(e) => handleCheckboxChange(e, 'website_needs')} /> Online Store</label>
              <label><input type="checkbox" name="website_needs" value="Booking System" checked={formData.website_needs.includes('Booking System')} onChange={(e) => handleCheckboxChange(e, 'website_needs')} /> Booking System</label>
              <label><input type="checkbox" name="website_needs" value="Membership Area" checked={formData.website_needs.includes('Membership Area')} onChange={(e) => handleCheckboxChange(e, 'website_needs')} /> Membership Area</label>
              <label><input type="checkbox" name="website_needs" value="Blog" checked={formData.website_needs.includes('Blog')} onChange={(e) => handleCheckboxChange(e, 'website_needs')} /> Blog</label>
              <label><input type="checkbox" name="website_needs" value="Contact Forms" checked={formData.website_needs.includes('Contact Forms')} onChange={(e) => handleCheckboxChange(e, 'website_needs')} /> Contact Forms</label>
              <label><input type="checkbox" name="website_needs" value="Payment Processing" checked={formData.website_needs.includes('Payment Processing')} onChange={(e) => handleCheckboxChange(e, 'website_needs')} /> Payment Processing</label>
            </div>
          </section>

          {/* 07 Social Media */}
          <section className="panel">
            <h2>07 Social Media</h2>
            <div className="grid">
              <label>Facebook <input name="facebook" type="url" value={formData.facebook} onChange={handleInputChange} /></label>
              <label>Instagram <input name="instagram" type="url" value={formData.instagram} onChange={handleInputChange} /></label>
              <label>TikTok <input name="tiktok" type="url" value={formData.tiktok} onChange={handleInputChange} /></label>
              <label>LinkedIn <input name="linkedin" type="url" value={formData.linkedin} onChange={handleInputChange} /></label>
              <label>YouTube <input name="youtube" type="url" value={formData.youtube} onChange={handleInputChange} /></label>
              <label>Other <input name="other_social" type="text" value={formData.other_social} onChange={handleInputChange} /></label>
            </div>
          </section>

          {/* 08 Business Assets */}
          <section className="panel">
            <h2>08 Business Assets</h2>
            <p className="note">Upload logos, photos, price lists, service lists, brand guides, or documents.</p>
            <input name="files" type="file" multiple onChange={handleFileChange} />
          </section>

          {/* 09 Login / Access Information */}
          <section className="panel">
            <h2>09 Login / Access Information</h2>
            <p className="warning">Do not enter passwords here. We will send a secure access request separately if needed.</p>
            <div className="grid">
              <label>Domain Registrar <input name="domain_registrar" type="text" value={formData.domain_registrar} onChange={handleInputChange} /></label>
              <label>Hosting Provider <input name="hosting_provider" type="text" value={formData.hosting_provider} onChange={handleInputChange} /></label>
              <label>Website Platform <input name="website_platform" type="text" value={formData.website_platform} onChange={handleInputChange} /></label>
              <label>Google Account Email <input name="google_email" type="email" value={formData.google_email} onChange={handleInputChange} /></label>
              <label>Meta Business Manager <input name="meta_business" type="text" value={formData.meta_business} onChange={handleInputChange} /></label>
              <label>Stripe Account Email <input name="stripe_email" type="email" value={formData.stripe_email} onChange={handleInputChange} /></label>
            </div>
            <label style={{ marginTop: '14px' }}>Other Access Needed <textarea name="other_access" value={formData.other_access} onChange={handleInputChange}></textarea></label>
          </section>

          {/* 10 Timeline & Budget */}
          <section className="panel">
            <h2>10 Timeline & Budget</h2>
            <div className="grid">
              <label>Preferred Start Date <input name="start_date" type="date" value={formData.start_date} onChange={handleInputChange} /></label>
              <label>Desired Completion Date <input name="completion_date" type="date" value={formData.completion_date} onChange={handleInputChange} /></label>
              <label>Estimated Budget <input name="budget" type="text" placeholder="$" value={formData.budget} onChange={handleInputChange} /></label>
            </div>
            <label style={{ marginTop: '14px' }}>Deadline Details <textarea name="deadline_details" value={formData.deadline_details} onChange={handleInputChange}></textarea></label>
          </section>

          {/* 11 Preferred Communication */}
          <section className="panel">
            <h2>11 Preferred Communication</h2>
            <div className="checks">
              <label><input type="checkbox" name="communication" value="Phone" checked={formData.communication_preference.includes('Phone')} onChange={(e) => handleCheckboxChange(e, 'communication_preference')} /> Phone</label>
              <label><input type="checkbox" name="communication" value="Text Message" checked={formData.communication_preference.includes('Text Message')} onChange={(e) => handleCheckboxChange(e, 'communication_preference')} /> Text Message</label>
              <label><input type="checkbox" name="communication" value="Email" checked={formData.communication_preference.includes('Email')} onChange={(e) => handleCheckboxChange(e, 'communication_preference')} /> Email</label>
              <label><input type="checkbox" name="communication" value="Zoom / Google Meet" checked={formData.communication_preference.includes('Zoom / Google Meet')} onChange={(e) => handleCheckboxChange(e, 'communication_preference')} /> Zoom / Google Meet</label>
            </div>
          </section>

          {/* 12 Additional Information */}
          <section className="panel">
            <h2>12 Additional Information</h2>
            <label>Anything else we should know? <textarea name="additional_info" value={formData.additional_info} onChange={handleInputChange}></textarea></label>
          </section>

          {/* 13 Client Approval */}
          <section className="panel">
            <h2>13 Client Approval</h2>
            <div className="grid">
              <label>Client Name* <input required name="client_name" type="text" value={formData.client_name} onChange={handleInputChange} /></label>
              <label>Date* <input required name="approval_date" type="date" value={formData.approval_date} onChange={handleInputChange} /></label>
            </div>
            <label className="agree"><input required type="checkbox" name="agreement" checked={formData.agreement} onChange={(e) => setFormData(prev => ({ ...prev, agreement: e.target.checked }))} /> I certify that the information provided is accurate to the best of my knowledge.</label>
          </section>

          <button className="submit" type="submit">Submit Client Intake</button>
        </form>

        {submitted && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              maxWidth: '400px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
              <h2 style={{ marginTop: 0 }}>Form Submitted!</h2>
              <p style={{ color: 'var(--muted)' }}>Thank you for completing the WISE² Client Intake Form. We'll review your information and be in touch shortly.</p>
              <button onClick={() => setSubmitted(false)} style={{
                background: 'var(--blue)',
                color: '#00111d',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
