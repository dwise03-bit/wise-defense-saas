'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slogans = [
  'WE BUILD MORE.',
  'WE BUILD BRANDS.',
  'WE BUILD SYSTEMS.',
  'WE BUILD BUSINESSES.',
  'WE BUILD AUTOMATION.',
  'WE BUILD LEGACIES.',
];

export default function IntakeForm() {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlogan, setCurrentSlogan] = useState(0);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1200);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const sloganInterval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length);
    }, 4000);
    return () => clearInterval(sloganInterval);
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
    <motion.section
      style={style}
      className="cyber-section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2 className="section-title">{num} // {title}</h2>
      <div className="section-content">{children}</div>
    </motion.section>
  );

  return (
    <div className="intake-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@400;500;600;700&family=Rajdhani:wght@400;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #EAF8FF;
          background: #050505;
          overflow-x: hidden;
        }

        /* ===== MULTI-LAYER ANIMATED BACKGROUND ===== */
        .intake-container {
          min-height: 100vh;
          position: relative;
          padding: 20px;
          background: #050505;
          overflow: hidden;
        }

        /* Layer 1: Blueprint Grid */
        .intake-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            linear-gradient(0deg, transparent 24%, rgba(0, 174, 239, .05) 25%, rgba(0, 174, 239, .05) 26%, transparent 27%, transparent 74%, rgba(0, 174, 239, .05) 75%, rgba(0, 174, 239, .05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0, 174, 239, .05) 25%, rgba(0, 174, 239, .05) 26%, transparent 27%, transparent 74%, rgba(0, 174, 239, .05) 75%, rgba(0, 174, 239, .05) 76%, transparent 77%, transparent);
          background-size: 50px 50px;
          opacity: 0.3;
          pointer-events: none;
          z-index: 1;
          animation: gridPulse 8s ease-in-out infinite;
        }

        @keyframes gridPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }

        /* Layer 2: Futuristic Gradient */
        .intake-container::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(0, 174, 239, 0.15) 0%, transparent 50%),
                      radial-gradient(ellipse at 0% 100%, rgba(79, 195, 255, 0.1) 0%, transparent 50%);
          pointer-events: none;
          z-index: 1;
        }

        /* Layer 3: Particle System (via pseudo-elements on body) */
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(20px, -20px); }
          50% { transform: translate(-10px, 10px); }
          75% { transform: translate(-20px, -10px); }
        }

        @keyframes scanlines {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        /* Layer 4: Glow Waves */
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 174, 239, 0.3); }
          50% { box-shadow: 0 0 40px rgba(0, 174, 239, 0.6); }
        }

        .form-wrapper {
          position: relative;
          z-index: 2;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ===== HERO SECTION - HOLOGRAPHIC CENTERPIECE ===== */
        .hero-section {
          text-align: center;
          padding: 60px 40px;
          margin-bottom: 50px;
          background: rgba(8, 12, 18, 0.85);
          border: 2px solid #00AEEF;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 0 40px rgba(0, 174, 239, 0.4),
            inset 0 0 40px rgba(0, 174, 239, 0.05),
            0 20px 60px rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          animation: glowPulse 4s ease-in-out infinite;
        }

        /* Holographic Reflection */
        .hero-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          right: -50%;
          bottom: -50%;
          background: linear-gradient(135deg, transparent 30%, rgba(79, 195, 255, 0.1) 50%, transparent 70%);
          animation: reflection 3s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes reflection {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
        }

        .hero-section > * { position: relative; z-index: 2; }

        .hero-section h1 {
          font-family: 'Orbitron', monospace;
          font-size: clamp(32px, 6vw, 56px);
          color: #4FC3FF;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin: 20px 0;
          text-shadow:
            0 0 20px rgba(79, 195, 255, 0.8),
            0 0 40px rgba(0, 174, 239, 0.4);
          font-weight: 900;
          animation: titleGlow 2s ease-in-out infinite;
        }

        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(79, 195, 255, 0.8), 0 0 40px rgba(0, 174, 239, 0.4); }
          50% { text-shadow: 0 0 30px rgba(79, 195, 255, 1), 0 0 60px rgba(0, 174, 239, 0.6); }
        }

        .hero-section p {
          color: #A5C8D8;
          letter-spacing: 2px;
          font-size: 14px;
          margin: 12px 0;
          font-family: 'Rajdhani', monospace;
          font-weight: 600;
        }

        .hero-section .small {
          color: #A5C8D8;
          letter-spacing: 0;
          margin-top: 16px;
          font-size: 13px;
          line-height: 1.6;
        }

        .rotating-slogan {
          font-family: 'Orbitron', monospace;
          font-size: 18px;
          color: #00AEEF;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 20px;
          min-height: 32px;
          font-weight: 700;
        }

        /* Desktop 3-column layout */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
          grid-auto-rows: min-content;
          margin-bottom: 40px;
        }

        .left-column, .center-column, .right-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .center-column {
          justify-content: center;
          min-height: 600px;
        }

        .center-column > div {
          text-align: center;
          color: #00AEEF;
          font-size: 11px;
          letter-spacing: 2px;
          opacity: 0.4;
          font-family: 'Rajdhani', monospace;
          font-weight: 600;
        }

        /* ===== HUD PANELS ===== */
        .cyber-section {
          border: 1.5px solid #00AEEF;
          border-radius: 8px;
          padding: 20px;
          background: rgba(8, 12, 18, 0.80);
          position: relative;
          overflow: hidden;
          box-shadow:
            0 0 25px rgba(0, 174, 239, 0.3),
            inset 0 0 20px rgba(0, 174, 239, 0.05),
            0 15px 40px rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Blueprint Texture Overlay */
        .cyber-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            linear-gradient(90deg, rgba(0, 174, 239, 0.02) 1px, transparent 1px),
            linear-gradient(0deg, rgba(0, 174, 239, 0.02) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
          z-index: 0;
        }

        .cyber-section::after {
          content: '';
          position: absolute;
          top: -100%;
          left: -100%;
          right: -100%;
          bottom: -100%;
          background: linear-gradient(135deg, transparent 30%, rgba(79, 195, 255, 0.1) 50%, transparent 70%);
          animation: panelSweep 3s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes panelSweep {
          0% { transform: translateX(-100%) translateY(-100%); }
          100% { transform: translateX(100%) translateY(100%); }
        }

        .cyber-section:hover {
          border-color: #4FC3FF;
          box-shadow:
            0 0 40px rgba(79, 195, 255, 0.5),
            inset 0 0 30px rgba(0, 174, 239, 0.1),
            0 20px 50px rgba(0, 0, 0, 0.8);
          transform: translateY(-2px);
        }

        .cyber-section > * { position: relative; z-index: 1; }

        .section-title {
          color: #4FC3FF;
          font-family: 'Rajdhani', monospace;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 16px;
          text-shadow: 0 0 10px rgba(79, 195, 255, 0.5);
          font-weight: 700;
          display: flex;
          align-items: center;
        }

        .section-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, #00AEEF, transparent);
          margin-left: 12px;
          opacity: 0.3;
        }

        .section-content {
          position: relative;
          z-index: 1;
        }

        .section-content label {
          display: block;
          color: #A5C8D8;
          font-family: 'Rajdhani', monospace;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 6px;
          margin-top: 12px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .section-content label input,
        .section-content textarea {
          display: block;
          width: 100%;
          padding: 12px;
          margin-top: 6px;
          border: 1px solid #00AEEF;
          border-radius: 8px;
          background: rgba(8, 12, 18, 0.6);
          color: #EAF8FF;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: inset 0 0 10px rgba(0, 174, 239, 0.05);
          caret-color: #00AEEF;
        }

        .section-content label input::placeholder,
        .section-content textarea::placeholder {
          color: #7A9DB0;
        }

        .section-content label input:focus,
        .section-content textarea:focus {
          border-color: #4FC3FF;
          background: rgba(8, 12, 18, 0.8);
          box-shadow:
            0 0 15px rgba(79, 195, 255, 0.4),
            inset 0 0 10px rgba(0, 174, 239, 0.1);
        }

        .section-content textarea {
          min-height: 80px;
          resize: vertical;
          font-family: 'Inter', sans-serif;
        }

        .checkbox-group {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          margin-top: 8px;
        }

        .checkbox-group label {
          display: flex;
          align-items: center;
          padding: 10px 12px;
          border: 1px solid rgba(0, 174, 239, 0.4);
          border-radius: 6px;
          background: rgba(0, 174, 239, 0.05);
          cursor: pointer;
          transition: all 0.2s ease;
          margin: 0;
          font-weight: 500;
          font-size: 13px;
        }

        .checkbox-group label:hover {
          border-color: #4FC3FF;
          background: rgba(79, 195, 255, 0.15);
          transform: translateX(4px);
        }

        .checkbox-group input[type="checkbox"] {
          width: 16px;
          height: 16px;
          margin-right: 10px;
          margin-top: 0;
          cursor: pointer;
          accent-color: #00AEEF;
          appearance: none;
          -webkit-appearance: none;
          border: 1.5px solid #00AEEF;
          border-radius: 3px;
          background: rgba(8, 12, 18, 0.6);
          transition: all 0.2s ease;
          position: relative;
        }

        .checkbox-group input[type="checkbox"]:hover {
          box-shadow: 0 0 10px rgba(0, 174, 239, 0.3);
        }

        .checkbox-group input[type="checkbox"]:checked {
          background: linear-gradient(135deg, #00AEEF, #4FC3FF);
          border-color: #4FC3FF;
          box-shadow: 0 0 12px rgba(79, 195, 255, 0.6);
        }

        .checkbox-group input[type="checkbox"]:checked::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #050505;
          font-weight: bold;
          font-size: 11px;
        }

        .warning-box {
          color: #EAF8FF;
          border-left: 3px solid #00AEEF;
          padding: 12px;
          background: rgba(0, 174, 239, 0.1);
          font-size: 12px;
          margin-bottom: 12px;
          border-radius: 4px;
          font-family: 'Rajdhani', monospace;
          letter-spacing: 0.5px;
        }

        .note-text {
          color: #A5C8D8;
          font-size: 12px;
          margin-bottom: 12px;
          font-family: 'Rajdhani', monospace;
          letter-spacing: 0.5px;
        }

        .section-content > input[type="file"] {
          padding: 8px;
          font-size: 12px;
          border: 1px dashed #00AEEF;
          border-radius: 6px;
          background: rgba(0, 174, 239, 0.05);
          color: #EAF8FF;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .section-content > input[type="file"]:hover {
          background: rgba(0, 174, 239, 0.1);
          border-color: #4FC3FF;
        }

        /* ===== SUBMIT BUTTON ===== */
        .submit-button {
          width: 100%;
          padding: 16px;
          border: 2px solid #00AEEF;
          border-radius: 8px;
          background: linear-gradient(135deg, #00AEEF 0%, #4FC3FF 100%);
          color: #050505;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'Rajdhani', monospace;
          box-shadow:
            0 0 25px rgba(0, 174, 239, 0.3),
            0 10px 30px rgba(0, 0, 0, 0.5);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.2);
          transition: left 0.3s ease;
          pointer-events: none;
        }

        .submit-button:hover {
          border-color: #4FC3FF;
          box-shadow:
            0 0 40px rgba(79, 195, 255, 0.6),
            0 20px 40px rgba(0, 0, 0, 0.8);
          transform: translateY(-3px);
        }

        .submit-button:hover::before {
          left: 100%;
        }

        .submit-button:active {
          transform: translateY(-1px);
        }

        /* ===== DIVIDER ===== */
        hr {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, #00AEEF, rgba(0, 174, 239, 0), #00AEEF);
          margin: 24px 0;
          opacity: 0.5;
        }

        /* ===== MOBILE RESPONSIVE ===== */
        @media (max-width: 1199px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .center-column {
            min-height: auto;
            order: 3;
          }

          .cyber-section {
            padding: 16px;
          }

          .section-title {
            font-size: 10px;
          }
        }

        @media (max-width: 768px) {
          .intake-container {
            padding: 12px;
          }

          .hero-section {
            padding: 40px 20px;
            margin-bottom: 30px;
          }

          .hero-section h1 {
            font-size: 28px;
            letter-spacing: 2px;
          }

          .rotating-slogan {
            font-size: 14px;
          }

          .form-grid {
            gap: 16px;
          }

          .cyber-section {
            padding: 14px;
          }

          .section-title {
            font-size: 10px;
            margin-bottom: 12px;
          }

          .section-content label {
            font-size: 11px;
            margin-top: 8px;
          }

          .section-content label input,
          .section-content textarea {
            padding: 10px;
            font-size: 12px;
          }

          .submit-button {
            padding: 12px;
            font-size: 13px;
          }
        }

        /* ===== ACCESSIBILITY ===== */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Focus visible for keyboard navigation */
        *:focus-visible {
          outline: 2px solid #4FC3FF;
          outline-offset: 2px;
        }
      `}</style>

      <div className="form-wrapper">
        <motion.section className="hero-section"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h1
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            WISE² COMMAND CENTER
          </motion.h1>
          <p>ONE PLATFORM. INFINITE CREATION. UNLIMITED POTENTIAL.</p>
          <motion.div
            className="rotating-slogan"
            key={currentSlogan}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
          >
            {slogans[currentSlogan]}
          </motion.div>
          <p className="small">
            Deploy your mission profile. Integrating business intelligence across all systems.
          </p>
        </motion.section>

        <form action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST" encType="multipart/form-data">
          <div className="form-grid">
            {/* LEFT COLUMN */}
            <div className="left-column">
              {/* 01 CLIENT IDENTIFICATION */}
              <Section num="01" title="CLIENT IDENTIFICATION">
                <label>Full Name* <input required name="full_name" type="text" onChange={handleChange} /></label>
                <label>Company Name* <input required name="company_name" type="text" onChange={handleChange} /></label>
                <label>Job Title <input name="job_title" type="text" onChange={handleChange} /></label>
                <label>Phone* <input required name="phone" type="tel" onChange={handleChange} /></label>
                <label>Email* <input required name="email" type="email" onChange={handleChange} /></label>
                <label>Address <input name="business_address" type="text" onChange={handleChange} /></label>
                <label>Website <input name="website" type="url" placeholder="https://" onChange={handleChange} /></label>
              </Section>

              {/* 03 MISSION REQUIREMENTS */}
              <Section num="03" title="MISSION REQUIREMENTS">
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

              {/* 05 BRAND PROFILE */}
              <Section num="05" title="BRAND PROFILE">
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

              {/* 07 DIGITAL CHANNELS */}
              <Section num="07" title="DIGITAL CHANNELS">
                <label>Facebook <input name="facebook" type="url" onChange={handleChange} /></label>
                <label>Instagram <input name="instagram" type="url" onChange={handleChange} /></label>
                <label>TikTok <input name="tiktok" type="url" onChange={handleChange} /></label>
                <label>LinkedIn <input name="linkedin" type="url" onChange={handleChange} /></label>
                <label>YouTube <input name="youtube" type="url" onChange={handleChange} /></label>
                <label>Other <input name="other_social" type="text" onChange={handleChange} /></label>
              </Section>

              {/* 09 DEPLOYMENT TIMELINE */}
              <Section num="09" title="DEPLOYMENT TIMELINE">
                <label>Start Date <input name="start_date" type="date" onChange={handleChange} /></label>
                <label>Completion Date <input name="completion_date" type="date" onChange={handleChange} /></label>
                <label>Resource Budget <input name="budget" type="text" placeholder="$" onChange={handleChange} /></label>
                <label>Details <textarea name="deadline_details" onChange={handleChange}></textarea></label>
              </Section>

              {/* 11 PREFERRED COMMUNICATION */}
              <Section num="11" title="PREFERRED COMMUNICATION">
                <div className="checkbox-group">
                  <label><input type="checkbox" name="communication" value="Phone" onChange={handleCheckboxChange} /> Phone</label>
                  <label><input type="checkbox" name="communication" value="Text Message" onChange={handleCheckboxChange} /> Text</label>
                  <label><input type="checkbox" name="communication" value="Email" onChange={handleCheckboxChange} /> Email</label>
                  <label><input type="checkbox" name="communication" value="Zoom / Google Meet" onChange={handleCheckboxChange} /> Video Call</label>
                </div>
              </Section>
            </div>

            {/* CENTER COLUMN */}
            <div className="center-column">
              <div>
                ESTABLISHING<br/>SECURE UPLINK<br/><br/>[ SYSTEMS READY ]
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="right-column">
              {/* 02 BUSINESS INTELLIGENCE */}
              <Section num="02" title="BUSINESS INTELLIGENCE">
                <label>Describe <textarea name="business_description" onChange={handleChange}></textarea></label>
                <label>Products/Services <textarea name="products_services" onChange={handleChange}></textarea></label>
                <label>Target Audience <textarea name="target_audience" onChange={handleChange}></textarea></label>
                <label>Unique Value <textarea name="unique_value" onChange={handleChange}></textarea></label>
              </Section>

              {/* 04 MISSION OBJECTIVES */}
              <Section num="04" title="MISSION OBJECTIVES">
                <label>Project* <textarea required name="project_description" onChange={handleChange}></textarea></label>
                <label>Primary Goal <textarea name="primary_goal" onChange={handleChange}></textarea></label>
                <label>Examples <textarea name="examples_like" placeholder="Paste links" onChange={handleChange}></textarea></label>
                <label>Avoid <textarea name="avoid" onChange={handleChange}></textarea></label>
              </Section>

              {/* 06 SYSTEM REQUIREMENTS */}
              <Section num="06" title="SYSTEM REQUIREMENTS">
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

              {/* 08 RESOURCE ALLOCATION */}
              <Section num="08" title="RESOURCE ALLOCATION">
                <p className="note-text">Upload logos, photos, price lists, guides, documents</p>
                <input name="files" type="file" multiple onChange={handleFileChange} />
              </Section>

              {/* 10 ACCESS PROTOCOLS */}
              <Section num="10" title="ACCESS PROTOCOLS">
                <div className="warning-box">Do not enter passwords. We'll request separately.</div>
                <label>Domain Registrar <input name="domain_registrar" type="text" onChange={handleChange} /></label>
                <label>Hosting <input name="hosting_provider" type="text" onChange={handleChange} /></label>
                <label>Platform <input name="website_platform" type="text" onChange={handleChange} /></label>
                <label>Google Email <input name="google_email" type="email" onChange={handleChange} /></label>
                <label>Meta Manager <input name="meta_business" type="text" onChange={handleChange} /></label>
                <label>Stripe Email <input name="stripe_email" type="email" onChange={handleChange} /></label>
                <label>Other <textarea name="other_access" onChange={handleChange}></textarea></label>
              </Section>

              {/* 12 ADDITIONAL INTELLIGENCE */}
              <Section num="12" title="ADDITIONAL INTELLIGENCE">
                <label>Anything else? <textarea name="additional_info" onChange={handleChange}></textarea></label>
              </Section>
            </div>
          </div>

          {/* 13 CLIENT APPROVAL - Full Width Bottom */}
          <Section num="13" title="CLIENT APPROVAL" style={{ marginTop: '40px' }}>
            <label>Client Name* <input required name="client_name" type="text" onChange={handleChange} /></label>
            <label>Date* <input required name="approval_date" type="date" onChange={handleChange} /></label>
            <label style={{ marginTop: '12px', display: 'flex', alignItems: 'center' }}>
              <input required type="checkbox" name="agreement" value="Approved" onChange={handleCheckboxChange} style={{ marginRight: '8px' }} />
              I certify the information is accurate
            </label>
          </Section>

          <motion.button
            className="submit-button"
            type="submit"
            style={{ marginTop: '40px', marginBottom: '40px' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            INITIALIZE DEPLOYMENT
          </motion.button>
        </form>
      </div>
    </div>
  );
}
