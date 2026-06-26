'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';

// TypeScript Interface for Form Data
interface FormData {
  // Section 1: Contact Information
  full_name: string;
  company_name: string;
  job_title: string;
  phone: string;
  email: string;
  business_address: string;
  website: string;

  // Section 2: About Your Business
  business_description: string;
  products_services: string;
  target_audience: string;
  unique_value: string;

  // Section 3: Services Requested
  services_requested: string[];
  other_service: string;

  // Section 4: Project Information
  project_description: string;
  primary_goal: string;
  examples_like: string;
  avoid: string;

  // Section 5: Branding
  branding_services: string[];

  // Section 6: Website Information
  current_website: string;
  website_look: string;
  website_features: string;
  website_design_aspects: string[];

  // Section 7: Social Media
  facebook: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
  youtube: string;
  other_social: string;

  // Section 8: Business Assets
  files: FileList | null;

  // Section 9: Login/Access Information
  domain_registrar: string;
  hosting_provider: string;
  website_platform: string;
  google_email: string;
  meta_business: string;
  stripe_email: string;
  other_access: string;

  // Section 10: Timeline & Budget
  start_date: string;
  completion_date: string;
  budget: string;
  deadline_details: string;

  // Section 11: Preferred Communication
  communication_preference: string[];

  // Section 12: Additional Information
  additional_info: string;

  // Section 13: Client Approval
  client_name: string;
  approval_date: string;
  agreement: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const servicesOptions = [
  'Website Design',
  'Website Development',
  'Branding',
  'Logo Design',
  'Content Strategy',
  'SEO Optimization',
  'Social Media Management',
  'E-commerce Setup',
  'Mobile App Development',
  'UI/UX Design',
  'Email Marketing',
  'Analytics Setup',
  'Video Production',
  'Copywriting',
  'API Integration',
  'Other',
];

const brandingOptions = [
  'Logo Design',
  'Brand Identity',
  'Color Palette',
  'Typography',
  'Brand Guidelines',
  'Visual Assets',
  'Brand Strategy',
];

const websiteDesignAspects = [
  'Homepage Design',
  'Product/Service Pages',
  'About Us Page',
  'Contact Form',
  'Mobile Responsiveness',
  'Fast Loading Speed',
  'SEO Optimization',
  'Accessibility Features',
];

const communicationOptions = [
  'Email',
  'Phone Call',
  'Text/SMS',
  'Video Call',
];

export default function IntakeForm() {
  const [formData, setFormData] = useState<FormData>({
    // Section 1
    full_name: '',
    company_name: '',
    job_title: '',
    phone: '',
    email: '',
    business_address: '',
    website: '',

    // Section 2
    business_description: '',
    products_services: '',
    target_audience: '',
    unique_value: '',

    // Section 3
    services_requested: [],
    other_service: '',

    // Section 4
    project_description: '',
    primary_goal: '',
    examples_like: '',
    avoid: '',

    // Section 5
    branding_services: [],

    // Section 6
    current_website: '',
    website_look: '',
    website_features: '',
    website_design_aspects: [],

    // Section 7
    facebook: '',
    instagram: '',
    tiktok: '',
    linkedin: '',
    youtube: '',
    other_social: '',

    // Section 8
    files: null,

    // Section 9
    domain_registrar: '',
    hosting_provider: '',
    website_platform: '',
    google_email: '',
    meta_business: '',
    stripe_email: '',
    other_access: '',

    // Section 10
    start_date: '',
    completion_date: '',
    budget: '',
    deadline_details: '',

    // Section 11
    communication_preference: [],

    // Section 12
    additional_info: '',

    // Section 13
    client_name: '',
    approval_date: '',
    agreement: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Handle text input and textarea changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.currentTarget;

    if (type === 'checkbox') {
      const checkbox = e.currentTarget as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle checkbox changes for arrays
  const handleCheckboxChange = (
    name: string,
    value: string,
    isChecked: boolean
  ) => {
    setFormData((prev) => {
      const array = prev[name as keyof FormData] as string[];
      if (isChecked) {
        return {
          ...prev,
          [name]: [...array, value],
        };
      } else {
        return {
          ...prev,
          [name]: array.filter((item) => item !== value),
        };
      }
    });
  };

  // Handle file input changes
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        files: e.target.files,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    // Validation and submission logic will be added in next task
  };

  return (
    <div
      style={{
        backgroundColor: '#02070d',
        color: '#eef8ff',
        minHeight: '100vh',
        paddingTop: '2rem',
        paddingBottom: '2rem',
      }}
    >
      {/* Hero Section */}
      <div
        className="relative mb-12 overflow-hidden rounded-lg"
        style={{
          background:
            'linear-gradient(135deg, rgba(0, 174, 255, 0.1) 0%, rgba(4, 18, 33, 0.5) 100%)',
          borderTop: '2px solid #00aeff',
          borderBottom: '2px solid #00aeff',
        }}
      >
        <div className="relative z-10 px-6 py-12 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <h1
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: '#00aeff' }}
            >
              WISE² Intake Form
            </h1>
            <p className="text-lg" style={{ color: '#91c8e8' }}>
              Tell us about your project and business so we can provide the best
              solution for your needs.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4">
        {/* Section 1: Contact Information */}
        <div
          className="mb-8 p-6 rounded-lg border"
          style={{
            backgroundColor: 'rgba(4, 18, 33, 0.82)',
            borderColor: '#00aeff',
            borderWidth: '1px',
          }}
        >
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: '#00aeff' }}
          >
            1. Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 focus:ring-cyan-400"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Your company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Job Title
              </label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Your job title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="https://yourwebsite.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Business Address
              </label>
              <input
                type="text"
                name="business_address"
                value={formData.business_address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Your business address"
              />
            </div>
          </div>
        </div>

        {/* Section 2: About Your Business */}
        <div
          className="mb-8 p-6 rounded-lg border"
          style={{
            backgroundColor: 'rgba(4, 18, 33, 0.82)',
            borderColor: '#00aeff',
            borderWidth: '1px',
          }}
        >
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: '#00aeff' }}
          >
            2. About Your Business
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Business Description
              </label>
              <textarea
                name="business_description"
                value={formData.business_description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Tell us about your business..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Products/Services
              </label>
              <textarea
                name="products_services"
                value={formData.products_services}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Describe your products or services..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Target Audience
              </label>
              <textarea
                name="target_audience"
                value={formData.target_audience}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Who is your target audience?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Unique Value Proposition
              </label>
              <textarea
                name="unique_value"
                value={formData.unique_value}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="What makes you unique?"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Services Requested */}
        <div
          className="mb-8 p-6 rounded-lg border"
          style={{
            backgroundColor: 'rgba(4, 18, 33, 0.82)',
            borderColor: '#00aeff',
            borderWidth: '1px',
          }}
        >
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: '#00aeff' }}
          >
            3. Services Requested
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {servicesOptions.map((service) => (
              <label
                key={service}
                className="flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.services_requested.includes(service)}
                  onChange={(e) =>
                    handleCheckboxChange(
                      'services_requested',
                      service,
                      e.target.checked
                    )
                  }
                  className="mr-3 w-4 h-4"
                  style={{ accentColor: '#00aeff' }}
                />
                <span>{service}</span>
              </label>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Other Services
            </label>
            <textarea
              name="other_service"
              value={formData.other_service}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'rgba(0, 174, 255, 0.1)',
                borderColor: '#91c8e8',
                color: '#eef8ff',
              }}
              placeholder="Any other services not listed above?"
            />
          </div>
        </div>

        {/* Section 4: Project Information */}
        <div
          className="mb-8 p-6 rounded-lg border"
          style={{
            backgroundColor: 'rgba(4, 18, 33, 0.82)',
            borderColor: '#00aeff',
            borderWidth: '1px',
          }}
        >
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: '#00aeff' }}
          >
            4. Project Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Description
              </label>
              <textarea
                name="project_description"
                value={formData.project_description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Describe your project in detail..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Primary Goal
              </label>
              <textarea
                name="primary_goal"
                value={formData.primary_goal}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="What is your primary goal?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Examples You Like
              </label>
              <textarea
                name="examples_like"
                value={formData.examples_like}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Share examples of websites or designs you like..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                What to Avoid
              </label>
              <textarea
                name="avoid"
                value={formData.avoid}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Any styles or features to avoid?"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Branding */}
        <div
          className="mb-8 p-6 rounded-lg border"
          style={{
            backgroundColor: 'rgba(4, 18, 33, 0.82)',
            borderColor: '#00aeff',
            borderWidth: '1px',
          }}
        >
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: '#00aeff' }}
          >
            5. Branding Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brandingOptions.map((option) => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.branding_services.includes(option)}
                  onChange={(e) =>
                    handleCheckboxChange(
                      'branding_services',
                      option,
                      e.target.checked
                    )
                  }
                  className="mr-3 w-4 h-4"
                  style={{ accentColor: '#00aeff' }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 6: Website Information */}
        <div
          className="mb-8 p-6 rounded-lg border"
          style={{
            backgroundColor: 'rgba(4, 18, 33, 0.82)',
            borderColor: '#00aeff',
            borderWidth: '1px',
          }}
        >
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: '#00aeff' }}
          >
            6. Website Information
          </h2>
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Do you currently have a website?
              </label>
              <input
                type="text"
                name="current_website"
                value={formData.current_website}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Yes/No or website URL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                How should your website look?
              </label>
              <textarea
                name="website_look"
                value={formData.website_look}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Describe the look and feel..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                What features should your website have?
              </label>
              <textarea
                name="website_features"
                value={formData.website_features}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="List desired features..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-3">
              Which of these design aspects are important?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {websiteDesignAspects.map((aspect) => (
                <label
                  key={aspect}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.website_design_aspects.includes(aspect)}
                    onChange={(e) =>
                      handleCheckboxChange(
                        'website_design_aspects',
                        aspect,
                        e.target.checked
                      )
                    }
                    className="mr-3 w-4 h-4"
                    style={{ accentColor: '#00aeff' }}
                  />
                  <span>{aspect}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Section 7: Social Media */}
        <div
          className="mb-8 p-6 rounded-lg border"
          style={{
            backgroundColor: 'rgba(4, 18, 33, 0.82)',
            borderColor: '#00aeff',
            borderWidth: '1px',
          }}
        >
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: '#00aeff' }}
          >
            7. Social Media Accounts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Facebook</label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Instagram
              </label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">TikTok</label>
              <input
                type="url"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="https://tiktok.com/@..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="https://linkedin.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">YouTube</label>
              <input
                type="url"
                name="youtube"
                value={formData.youtube}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="https://youtube.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Other</label>
              <input
                type="text"
                name="other_social"
                value={formData.other_social}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Other social media accounts"
              />
            </div>
          </div>
        </div>

        {/* Section 8: Business Assets */}
        <div
          className="mb-8 p-6 rounded-lg border"
          style={{
            backgroundColor: 'rgba(4, 18, 33, 0.82)',
            borderColor: '#00aeff',
            borderWidth: '1px',
          }}
        >
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: '#00aeff' }}
          >
            8. Business Assets
          </h2>
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload files (logos, images, documents, etc.)
            </label>
            <input
              type="file"
              name="files"
              onChange={handleFileChange}
              multiple
              className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'rgba(0, 174, 255, 0.1)',
                borderColor: '#91c8e8',
                color: '#eef8ff',
              }}
            />
            {formData.files && (
              <p className="mt-2" style={{ color: '#91c8e8' }}>
                {formData.files.length} file(s) selected
              </p>
            )}
          </div>
        </div>

        {/* Section 9: Login/Access Information */}
        <div
          className="mb-8 p-6 rounded-lg border"
          style={{
            backgroundColor: 'rgba(4, 18, 33, 0.82)',
            borderColor: '#00aeff',
            borderWidth: '1px',
          }}
        >
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: '#00aeff' }}
          >
            9. Login &amp; Access Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Domain Registrar
              </label>
              <input
                type="text"
                name="domain_registrar"
                value={formData.domain_registrar}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="GoDaddy, Namecheap, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Hosting Provider
              </label>
              <input
                type="text"
                name="hosting_provider"
                value={formData.hosting_provider}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Bluehost, SiteGround, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Website Platform
              </label>
              <input
                type="text"
                name="website_platform"
                value={formData.website_platform}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="WordPress, Shopify, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Google Business Email
              </label>
              <input
                type="email"
                name="google_email"
                value={formData.google_email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="admin@yourcompany.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Meta Business Account
              </label>
              <input
                type="text"
                name="meta_business"
                value={formData.meta_business}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Your Meta Business ID or email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Stripe Email
              </label>
              <input
                type="email"
                name="stripe_email"
                value={formData.stripe_email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="stripe@yourcompany.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Other Access Information
              </label>
              <textarea
                name="other_access"
                value={formData.other_access}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Any other login information we should know about?"
              />
            </div>
          </div>
        </div>

        {/* Section 10: Timeline & Budget */}
        <div
          className="mb-8 p-6 rounded-lg border"
          style={{
            backgroundColor: 'rgba(4, 18, 33, 0.82)',
            borderColor: '#00aeff',
            borderWidth: '1px',
          }}
        >
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: '#00aeff' }}
          >
            10. Timeline &amp; Budget
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Desired Completion Date
              </label>
              <input
                type="date"
                name="completion_date"
                value={formData.completion_date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Budget</label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="e.g., $5,000 - $10,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Deadline Details
              </label>
              <input
                type="text"
                name="deadline_details"
                value={formData.deadline_details}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Any specific deadline requirements?"
              />
            </div>
          </div>
        </div>

        {/* Section 11: Preferred Communication */}
        <div
          className="mb-8 p-6 rounded-lg border"
          style={{
            backgroundColor: 'rgba(4, 18, 33, 0.82)',
            borderColor: '#00aeff',
            borderWidth: '1px',
          }}
        >
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: '#00aeff' }}
          >
            11. Preferred Communication
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communicationOptions.map((option) => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.communication_preference.includes(option)}
                  onChange={(e) =>
                    handleCheckboxChange(
                      'communication_preference',
                      option,
                      e.target.checked
                    )
                  }
                  className="mr-3 w-4 h-4"
                  style={{ accentColor: '#00aeff' }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 12: Additional Information */}
        <div
          className="mb-8 p-6 rounded-lg border"
          style={{
            backgroundColor: 'rgba(4, 18, 33, 0.82)',
            borderColor: '#00aeff',
            borderWidth: '1px',
          }}
        >
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: '#00aeff' }}
          >
            12. Additional Information
          </h2>
          <div>
            <label className="block text-sm font-medium mb-2">
              Anything else we should know?
            </label>
            <textarea
              name="additional_info"
              value={formData.additional_info}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'rgba(0, 174, 255, 0.1)',
                borderColor: '#91c8e8',
                color: '#eef8ff',
              }}
              placeholder="Tell us anything else we should know about your project or business..."
            />
          </div>
        </div>

        {/* Section 13: Client Approval */}
        <div
          className="mb-8 p-6 rounded-lg border"
          style={{
            backgroundColor: 'rgba(4, 18, 33, 0.82)',
            borderColor: '#00aeff',
            borderWidth: '1px',
          }}
        >
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: '#00aeff' }}
          >
            13. Client Approval
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Client/Approval Name
              </label>
              <input
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Name of approver"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Approval Date
              </label>
              <input
                type="date"
                name="approval_date"
                value={formData.approval_date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: '#91c8e8',
                  color: '#eef8ff',
                }}
              />
            </div>
            <div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="agreement"
                  checked={formData.agreement}
                  onChange={handleInputChange}
                  className="mr-3 w-4 h-4"
                  style={{ accentColor: '#00aeff' }}
                />
                <span>
                  I agree to the terms and conditions and confirm all
                  information provided is accurate
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mb-8 flex gap-4">
          <button
            type="submit"
            className="px-8 py-3 rounded font-bold text-white transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #00aeff 0%, #0088cc 100%)',
              boxShadow: '0 0 20px rgba(0, 174, 255, 0.3)',
            }}
          >
            Submit Intake Form
          </button>
          <button
            type="reset"
            className="px-8 py-3 rounded font-bold transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: 'rgba(4, 18, 33, 0.82)',
              borderColor: '#91c8e8',
              borderWidth: '1px',
              color: '#91c8e8',
            }}
          >
            Clear Form
          </button>
        </div>

        {/* Error/Success Messages */}
        {submitError && (
          <div
            className="mb-8 p-4 rounded"
            style={{
              backgroundColor: 'rgba(255, 100, 100, 0.1)',
              borderColor: '#ff6464',
              borderWidth: '1px',
              color: '#ff9999',
            }}
          >
            {submitError}
          </div>
        )}

        {submitted && (
          <div
            className="mb-8 p-4 rounded"
            style={{
              backgroundColor: 'rgba(100, 255, 100, 0.1)',
              borderColor: '#64ff64',
              borderWidth: '1px',
              color: '#99ff99',
            }}
          >
            Form submitted successfully!
          </div>
        )}
      </form>
    </div>
  );
}
