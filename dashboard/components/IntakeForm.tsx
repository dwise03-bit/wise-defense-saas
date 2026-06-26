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
  validateIntakeForm,
} from '@/lib/intake-validation';

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

  // Define required fields for validation
  const requiredFields = ['full_name', 'email'];
  const emailFields = ['email', 'google_email', 'stripe_email'];
  const phoneFields = ['phone'];
  const urlFields = ['website', 'facebook', 'instagram', 'tiktok', 'linkedin', 'youtube'];
  const dateFields = ['start_date', 'completion_date', 'approval_date'];
  const checkboxArrayFields = ['services_requested', 'branding_services', 'website_design_aspects', 'communication_preference'];

  // Validate a single field based on its type and field name
  const validateField = (fieldName: string, value: string | boolean, type?: string) => {
    let result: any = { valid: true };

    // Required field validation
    if (requiredFields.includes(fieldName)) {
      if (typeof value === 'string') {
        result = validateRequired(value);
      }
    }
    // Email validation
    else if (emailFields.includes(fieldName)) {
      if (typeof value === 'string' && value.trim().length > 0) {
        result = validateEmail(value);
      }
    }
    // Phone validation
    else if (phoneFields.includes(fieldName)) {
      if (typeof value === 'string' && value.trim().length > 0) {
        result = validatePhone(value);
      }
    }
    // URL validation
    else if (urlFields.includes(fieldName)) {
      if (typeof value === 'string' && value.trim().length > 0) {
        result = validateUrl(value, false);
      }
    }
    // Date validation
    else if (dateFields.includes(fieldName)) {
      if (typeof value === 'string' && value.trim().length > 0) {
        result = validateDate(value, false);
      }
    }

    // Update errors state
    if (!result.valid) {
      setErrors((prev) => ({ ...prev, [fieldName]: result.error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

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
      // Real-time validation
      validateField(name, value, type);
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
      let updatedArray: string[];
      if (isChecked) {
        updatedArray = [...array, value];
      } else {
        updatedArray = array.filter((item) => item !== value);
      }

      // Validate checkbox arrays that require at least one selection
      if (name === 'services_requested') {
        const result = validateCheckboxArray(updatedArray, 1);
        if (!result.valid) {
          setErrors((prev) => ({ ...prev, [name]: result.error }));
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
        }
      }

      return {
        ...prev,
        [name]: updatedArray,
      };
    });
  };

  // Handle file input changes
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      // Validate files
      const result = validateFiles(filesArray);
      if (!result.valid) {
        setErrors((prev) => ({ ...prev, files: result.error }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.files;
          return newErrors;
        });
      }

      setFormData((prev) => ({
        ...prev,
        files: e.target.files,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');

    // Validate all fields
    const allErrors: FormErrors = {};

    // Check required fields
    if (!formData.full_name || formData.full_name.trim().length === 0) {
      allErrors.full_name = 'Full name is required';
    }

    // Check email
    const emailResult = validateEmail(formData.email);
    if (!emailResult.valid) {
      allErrors.email = emailResult.error;
    }

    // Check phone if provided
    if (formData.phone && formData.phone.trim().length > 0) {
      const phoneResult = validatePhone(formData.phone);
      if (!phoneResult.valid) {
        allErrors.phone = phoneResult.error;
      }
    }

    // Check website if provided
    if (formData.website && formData.website.trim().length > 0) {
      const websiteResult = validateUrl(formData.website, false);
      if (!websiteResult.valid) {
        allErrors.website = websiteResult.error;
      }
    }

    // Check social media URLs if provided
    const socialFields = ['facebook', 'instagram', 'tiktok', 'linkedin', 'youtube'];
    socialFields.forEach((field) => {
      const value = formData[field as keyof FormData] as string;
      if (value && value.trim().length > 0) {
        const result = validateUrl(value, false);
        if (!result.valid) {
          allErrors[field] = result.error;
        }
      }
    });

    // Check email fields if provided
    const emailFieldsToCheck = ['google_email', 'stripe_email'];
    emailFieldsToCheck.forEach((field) => {
      const value = formData[field as keyof FormData] as string;
      if (value && value.trim().length > 0) {
        const result = validateEmail(value);
        if (!result.valid) {
          allErrors[field] = result.error;
        }
      }
    });

    // Check services are selected
    const servicesResult = validateCheckboxArray(formData.services_requested, 1);
    if (!servicesResult.valid) {
      allErrors.services_requested = servicesResult.error;
    }

    // Check dates if provided
    const dateFieldsToCheck = ['start_date', 'completion_date', 'approval_date'];
    dateFieldsToCheck.forEach((field) => {
      const value = formData[field as keyof FormData] as string;
      if (value && value.trim().length > 0) {
        const result = validateDate(value, false);
        if (!result.valid) {
          allErrors[field] = result.error;
        }
      }
    });

    // Check file validation
    if (formData.files && formData.files.length > 0) {
      const filesResult = validateFiles(Array.from(formData.files));
      if (!filesResult.valid) {
        allErrors.files = filesResult.error;
      }
    }

    // If there are errors, display them
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setSubmitError('Please fix the errors below before submitting.');

      // Scroll to first error field
      const firstErrorField = Object.keys(allErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // If validation passes, proceed with submission
    console.log('Form submitted with valid data:', formData);
    // TODO: Upload files and submit to Formspree (next tasks)
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.full_name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.full_name ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Your full name"
              />
              {errors.full_name && (
                <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.company_name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.company_name ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Your company name"
              />
              {errors.company_name && (
                <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.job_title
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.job_title ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Your job title"
              />
              {errors.job_title && (
                <p className="text-red-500 text-xs mt-1">{errors.job_title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.phone ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Your phone number"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.email ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.website
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.website ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="https://yourwebsite.com"
              />
              {errors.website && (
                <p className="text-red-500 text-xs mt-1">{errors.website}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.business_address
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.business_address ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Your business address"
              />
              {errors.business_address && (
                <p className="text-red-500 text-xs mt-1">{errors.business_address}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.business_description
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.business_description ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Tell us about your business..."
              />
              {errors.business_description && (
                <p className="text-red-500 text-xs mt-1">{errors.business_description}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.products_services
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.products_services ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Describe your products or services..."
              />
              {errors.products_services && (
                <p className="text-red-500 text-xs mt-1">{errors.products_services}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.target_audience
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.target_audience ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Who is your target audience?"
              />
              {errors.target_audience && (
                <p className="text-red-500 text-xs mt-1">{errors.target_audience}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.unique_value
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.unique_value ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="What makes you unique?"
              />
              {errors.unique_value && (
                <p className="text-red-500 text-xs mt-1">{errors.unique_value}</p>
              )}
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
          {errors.services_requested && (
            <p className="text-red-500 text-xs mb-4">{errors.services_requested}</p>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">
              Other Services
            </label>
            <textarea
              name="other_service"
              value={formData.other_service}
              onChange={handleInputChange}
              rows={2}
              className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                errors.other_service
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#91c8e8] focus:ring-cyan-400'
              }`}
              style={{
                backgroundColor: 'rgba(0, 174, 255, 0.1)',
                borderColor: errors.other_service ? '#ef4444' : '#91c8e8',
                color: '#eef8ff',
              }}
              placeholder="Any other services not listed above?"
            />
            {errors.other_service && (
              <p className="text-red-500 text-xs mt-1">{errors.other_service}</p>
            )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.project_description
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.project_description ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Describe your project in detail..."
              />
              {errors.project_description && (
                <p className="text-red-500 text-xs mt-1">{errors.project_description}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.primary_goal
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.primary_goal ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="What is your primary goal?"
              />
              {errors.primary_goal && (
                <p className="text-red-500 text-xs mt-1">{errors.primary_goal}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.examples_like
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.examples_like ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Share examples of websites or designs you like..."
              />
              {errors.examples_like && (
                <p className="text-red-500 text-xs mt-1">{errors.examples_like}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.avoid
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.avoid ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Any styles or features to avoid?"
              />
              {errors.avoid && (
                <p className="text-red-500 text-xs mt-1">{errors.avoid}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.current_website
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.current_website ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Yes/No or website URL"
              />
              {errors.current_website && (
                <p className="text-red-500 text-xs mt-1">{errors.current_website}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.website_look
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.website_look ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Describe the look and feel..."
              />
              {errors.website_look && (
                <p className="text-red-500 text-xs mt-1">{errors.website_look}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.website_features
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.website_features ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="List desired features..."
              />
              {errors.website_features && (
                <p className="text-red-500 text-xs mt-1">{errors.website_features}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.facebook
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.facebook ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="https://facebook.com/..."
              />
              {errors.facebook && (
                <p className="text-red-500 text-xs mt-1">{errors.facebook}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.instagram
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.instagram ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="https://instagram.com/..."
              />
              {errors.instagram && (
                <p className="text-red-500 text-xs mt-1">{errors.instagram}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">TikTok</label>
              <input
                type="url"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.tiktok
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.tiktok ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="https://tiktok.com/@..."
              />
              {errors.tiktok && (
                <p className="text-red-500 text-xs mt-1">{errors.tiktok}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.linkedin
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.linkedin ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="https://linkedin.com/..."
              />
              {errors.linkedin && (
                <p className="text-red-500 text-xs mt-1">{errors.linkedin}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">YouTube</label>
              <input
                type="url"
                name="youtube"
                value={formData.youtube}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.youtube
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.youtube ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="https://youtube.com/..."
              />
              {errors.youtube && (
                <p className="text-red-500 text-xs mt-1">{errors.youtube}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Other</label>
              <input
                type="text"
                name="other_social"
                value={formData.other_social}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.other_social
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.other_social ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Other social media accounts"
              />
              {errors.other_social && (
                <p className="text-red-500 text-xs mt-1">{errors.other_social}</p>
              )}
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
              className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                errors.files
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#91c8e8] focus:ring-cyan-400'
              }`}
              style={{
                backgroundColor: 'rgba(0, 174, 255, 0.1)',
                borderColor: errors.files ? '#ef4444' : '#91c8e8',
                color: '#eef8ff',
              }}
            />
            {formData.files && (
              <p className="mt-2" style={{ color: '#91c8e8' }}>
                {formData.files.length} file(s) selected
              </p>
            )}
            {errors.files && (
              <p className="text-red-500 text-xs mt-1">{errors.files}</p>
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.domain_registrar
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.domain_registrar ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="GoDaddy, Namecheap, etc."
              />
              {errors.domain_registrar && (
                <p className="text-red-500 text-xs mt-1">{errors.domain_registrar}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.hosting_provider
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.hosting_provider ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Bluehost, SiteGround, etc."
              />
              {errors.hosting_provider && (
                <p className="text-red-500 text-xs mt-1">{errors.hosting_provider}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.website_platform
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.website_platform ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="WordPress, Shopify, etc."
              />
              {errors.website_platform && (
                <p className="text-red-500 text-xs mt-1">{errors.website_platform}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.google_email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.google_email ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="admin@yourcompany.com"
              />
              {errors.google_email && (
                <p className="text-red-500 text-xs mt-1">{errors.google_email}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.meta_business
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.meta_business ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Your Meta Business ID or email"
              />
              {errors.meta_business && (
                <p className="text-red-500 text-xs mt-1">{errors.meta_business}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.stripe_email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.stripe_email ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="stripe@yourcompany.com"
              />
              {errors.stripe_email && (
                <p className="text-red-500 text-xs mt-1">{errors.stripe_email}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.other_access
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.other_access ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Any other login information we should know about?"
              />
              {errors.other_access && (
                <p className="text-red-500 text-xs mt-1">{errors.other_access}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.start_date
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.start_date ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
              />
              {errors.start_date && (
                <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.completion_date
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.completion_date ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
              />
              {errors.completion_date && (
                <p className="text-red-500 text-xs mt-1">{errors.completion_date}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Budget</label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.budget
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.budget ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="e.g., $5,000 - $10,000"
              />
              {errors.budget && (
                <p className="text-red-500 text-xs mt-1">{errors.budget}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.deadline_details
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.deadline_details ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Any specific deadline requirements?"
              />
              {errors.deadline_details && (
                <p className="text-red-500 text-xs mt-1">{errors.deadline_details}</p>
              )}
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
              className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                errors.additional_info
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#91c8e8] focus:ring-cyan-400'
              }`}
              style={{
                backgroundColor: 'rgba(0, 174, 255, 0.1)',
                borderColor: errors.additional_info ? '#ef4444' : '#91c8e8',
                color: '#eef8ff',
              }}
              placeholder="Tell us anything else we should know about your project or business..."
            />
            {errors.additional_info && (
              <p className="text-red-500 text-xs mt-1">{errors.additional_info}</p>
            )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.client_name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.client_name ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
                placeholder="Name of approver"
              />
              {errors.client_name && (
                <p className="text-red-500 text-xs mt-1">{errors.client_name}</p>
              )}
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
                className={`w-full px-4 py-2 rounded bg-opacity-20 border focus:outline-none focus:ring-2 ${
                  errors.approval_date
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#91c8e8] focus:ring-cyan-400'
                }`}
                style={{
                  backgroundColor: 'rgba(0, 174, 255, 0.1)',
                  borderColor: errors.approval_date ? '#ef4444' : '#91c8e8',
                  color: '#eef8ff',
                }}
              />
              {errors.approval_date && (
                <p className="text-red-500 text-xs mt-1">{errors.approval_date}</p>
              )}
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
