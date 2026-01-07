import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Briefcase, IndianRupee, FileText, ArrowRight, MapPin, 
  Mail, Phone, Globe, User, CreditCard, CheckSquare, Activity 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import InputField from '../../components/form/InputField';
import SelectBox from '../../components/form/SelectBox';
import Button from '../../components/common/Button';
import businessService from '../../services/businessService';

// --- Constants ---

const INDUSTRIES = [
  { value: 'Retail', label: 'Retail & E-commerce' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Wholesale', label: 'Wholesale & Distribution' },
  { value: 'IT', label: 'IT & Software Services' },
  { value: 'FinTech', label: 'FinTech & Financial Services' },
  { value: 'Healthcare', label: 'Healthcare & Pharmaceuticals' },
  { value: 'Education', label: 'Education & EdTech' },
  { value: 'Services', label: 'Professional Services' },
  { value: 'Logistics', label: 'Logistics & Transport' },
  { value: 'Construction', label: 'Construction & Real Estate' },
  { value: 'Hospitality', label: 'Hospitality & Tourism' },
  { value: 'Food', label: 'Food & Beverage' },
  { value: 'Agriculture', label: 'Agriculture & Agribusiness' },
  { value: 'Media', label: 'Media, Advertising & Entertainment' },
  { value: 'Telecom', label: 'Telecom & Networking' },
  { value: 'Energy', label: 'Energy, Power & Utilities' },
  { value: 'Automotive', label: 'Automotive & Auto Components' },
  { value: 'Textile', label: 'Textile & Apparel' },
  { value: 'Chemicals', label: 'Chemicals & Industrial Materials' },
  { value: 'Other', label: 'Other' },
];

const BUSINESS_TYPES = [
  { value: 'Sole Proprietorship', label: 'Sole Proprietorship' },
  { value: 'Partnership', label: 'Partnership Firm' },
  { value: 'Private Limited', label: 'Private Limited Company' },
  { value: 'Public Limited', label: 'Public Limited Company' },
  { value: 'LLP', label: 'Limited Liability Partnership (LLP)' },
  { value: 'One Person Company', label: 'One Person Company (OPC)' },
  { value: 'HUF', label: 'Hindu Undivided Family (HUF)' },
  { value: 'Trust', label: 'Trust' },
  { value: 'Society', label: 'Society' },
  { value: 'Section 8', label: 'Section 8 Company (Non-Profit)' },
  { value: 'Government', label: 'Government / PSU' },
  { value: 'Startup', label: 'Registered Startup' },
];

const INVOICE_VOLUMES = [
  { value: '0-10', label: '0 - 10 per month' },
  { value: '11-50', label: '11 - 50 per month' },
  { value: '51-100', label: '51 - 100 per month' },
  { value: '101-500', label: '101 - 500 per month' },
  { value: '500+', label: '500+ per month' },
];

const CUSTOMER_TYPES = [
  { value: 'B2B', label: 'B2B (Business to Business)' },
  { value: 'B2C', label: 'B2C (Business to Consumer)' },
  { value: 'Government', label: 'Government / Public Sector' },
  { value: 'Enterprise', label: 'Enterprise' },
];

const DESIGNATIONS = [
  { value: 'Owner', label: 'Owner / Founder' },
  { value: 'Director', label: 'Director' },
  { value: 'Finance Manager', label: 'Finance Manager / CFO' },
  { value: 'Other', label: 'Other' },
];

const BusinessProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // --- State ---
  const [formData, setFormData] = useState({
    // 1. Identity
    businessName: '',
    registrationNumber: '', 
    industry: '',
    businessType: '',
    address: '',
    
    // 2. Business Contact
    businessEmail: '',
    businessPhone: '',
    website: '',

    // 3. Primary Contact Person
    contactName: '',
    designation: '',
    contactEmail: '',
    contactPhone: '',

    // 4. Financials & Activity
    annualRevenue: '',
    yearsInOperation: '',
    invoiceVolume: '',
    customerType: '',

    // 5. Compliance
    panNumber: '',
    consent: false
  });

  const [errors, setErrors] = useState({});

  // --- Validation ---
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const phoneRegex = /^[0-9]{10}$/;

    // Identity
    if (!formData.businessName) newErrors.businessName = "Business name is required";
    if (!formData.registrationNumber) newErrors.registrationNumber = "GSTIN is required";
    if (!formData.industry) newErrors.industry = "Select an industry";
    if (!formData.businessType) newErrors.businessType = "Select a business type";
    if (!formData.address) newErrors.address = "Address is required";

    // Business Contact
    if (!formData.businessEmail) {
      newErrors.businessEmail = "Business email is required";
    } else if (!emailRegex.test(formData.businessEmail)) {
      newErrors.businessEmail = "Invalid email format";
    }
    if (!formData.businessPhone) {
      newErrors.businessPhone = "Phone number is required";
    } else if (!phoneRegex.test(formData.businessPhone)) {
      newErrors.businessPhone = "Enter a valid 10-digit number";
    }

    // Primary Contact
    if (!formData.contactName) newErrors.contactName = "Contact name is required";
    if (!formData.designation) newErrors.designation = "Designation is required";
    if (!formData.contactEmail) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = "Invalid email format";
    }
    if (!formData.contactPhone) {
      newErrors.contactPhone = "Contact phone is required";
    } else if (!phoneRegex.test(formData.contactPhone)) {
      newErrors.contactPhone = "Enter a valid 10-digit number";
    }

    // Financials & Activity
    if (!formData.annualRevenue) {
      newErrors.annualRevenue = "Revenue is required";
    } else if (isNaN(formData.annualRevenue) || Number(formData.annualRevenue) < 0) {
      newErrors.annualRevenue = "Enter a positive number";
    }
    if (!formData.invoiceVolume) newErrors.invoiceVolume = "Select volume range";
    if (!formData.customerType) newErrors.customerType = "Select customer type";

    // Compliance
    if (!formData.panNumber) {
      newErrors.panNumber = "PAN is required";
    } else if (!panRegex.test(formData.panNumber)) {
      newErrors.panNumber = "Invalid PAN format (e.g. ABCDE1234F)";
    }
    if (!formData.consent) newErrors.consent = "You must authorize verification";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        annualRevenue: Number(formData.annualRevenue),
        yearsInOperation: Number(formData.yearsInOperation) || 0,
      };

      console.log("Submitting Payload to API:", payload);
      
      await businessService.createProfile(payload);

      toast.success("Profile created successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Submission Error:", error);
      const errorMessage = error.response?.data?.message || "Failed to create profile. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[85%] md:w-full max-w-3xl mx-auto mb-10">
      
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#D1F34B]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl" />
      </div>

      <div className="text-center mb-5 md:mb-6 pt-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-200 tracking-tight mb-2">
          Setup Your Business
        </h1>
        <p className="text-xs md:text-sm text-gray-300 max-w-lg mx-auto">
          Complete your profile to unlock tailored financing options.
        </p>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden relative">
        <div className="h-1 w-full bg-gray-100">
          <div className="h-full w-2/3 bg-[#D1F34B]" />
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-6 md:space-y-8">
          
          {/* 1. Company Identity & Contact */}
          <div className="space-y-3 md:space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-2 md:pb-3">
              <div className="h-6 w-6 md:h-7 md:w-7 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 text-gray-600">
                <Building2 className="w-3.5 h-3.5 md:w-[14px] md:h-[14px]" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-gray-900">Company Identity</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              <InputField
                label="Business Name"
                placeholder="e.g. Acme Innovations Ltd"
                icon={Building2}
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                error={errors.businessName}
                className="bg-gray-50/50 focus:bg-white text-xs md:text-sm py-1.5 md:py-2"
              />
              <InputField
                label="GSTIN / Registration No"
                placeholder="22AAAAA0000A1Z5"
                icon={FileText}
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })}
                error={errors.registrationNumber}
                className="bg-gray-50/50 focus:bg-white uppercase text-xs md:text-sm py-1.5 md:py-2"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              <SelectBox
                label="Industry Sector"
                options={INDUSTRIES}
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                error={errors.industry}
                className="text-xs md:text-sm py-1.5 md:py-2"
              />
              <SelectBox
                label="Legal Structure"
                options={BUSINESS_TYPES}
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                error={errors.businessType}
                className="text-xs md:text-sm py-1.5 md:py-2"
              />
            </div>

            <InputField
              label="Registered Address"
              placeholder="Full office address"
              icon={MapPin}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              error={errors.address}
              className="bg-gray-50/50 focus:bg-white text-xs md:text-sm py-1.5 md:py-2"
            />

            {/* Business Contact Sub-section */}
            <div className="pt-2">
               <h4 className="text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3">Business Contact Details</h4>
               <div className="grid md:grid-cols-3 gap-3 md:gap-4">
                <InputField
                  label="Official Email"
                  placeholder="info@acme.com"
                  icon={Mail}
                  type="email"
                  value={formData.businessEmail}
                  onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                  error={errors.businessEmail}
                  className="bg-gray-50/50 text-xs md:text-sm py-1.5 md:py-2"
                />
                <InputField
                  label="Business Phone"
                  placeholder="9876543210"
                  icon={Phone}
                  type="tel"
                  maxLength={10}
                  value={formData.businessPhone}
                  onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value.replace(/\D/g,'') })}
                  error={errors.businessPhone}
                  className="bg-gray-50/50 text-xs md:text-sm py-1.5 md:py-2"
                />
                <InputField
                  label="Website (Optional)"
                  placeholder="www.acme.com"
                  icon={Globe}
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="bg-gray-50/50 text-xs md:text-sm py-1.5 md:py-2"
                />
               </div>
            </div>
          </div>

          {/* 2. Primary Contact Person */}
          <div className="space-y-3 md:space-y-4 animate-in slide-in-from-bottom-6 duration-600">
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-2 md:pb-3">
              <div className="h-6 w-6 md:h-7 md:w-7 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 text-gray-600">
                <User className="w-3.5 h-3.5 md:w-[14px] md:h-[14px]" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-gray-900">Primary Contact Person</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              <InputField
                label="Full Name"
                placeholder="Your name"
                icon={User}
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                error={errors.contactName}
                className="bg-gray-50/50 text-xs md:text-sm py-1.5 md:py-2"
              />
              <SelectBox
                label="Designation / Role"
                options={DESIGNATIONS}
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                error={errors.designation}
                className="text-xs md:text-sm py-1.5 md:py-2"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              <InputField
                label="Contact Email"
                placeholder="user@acme.com"
                icon={Mail}
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                error={errors.contactEmail}
                className="bg-gray-50/50 text-xs md:text-sm py-1.5 md:py-2"
              />
              <InputField
                label="Contact Phone"
                placeholder="9876543210"
                icon={Phone}
                type="tel"
                maxLength={10}
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value.replace(/\D/g,'') })}
                error={errors.contactPhone}
                className="bg-gray-50/50 text-xs md:text-sm py-1.5 md:py-2"
              />
            </div>
          </div>

          {/* 3. Business Activity & Financials */}
          <div className="space-y-3 md:space-y-4 animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-2 md:pb-3">
              <div className="h-6 w-6 md:h-7 md:w-7 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 text-gray-600">
                <Activity className="w-3.5 h-3.5 md:w-[14px] md:h-[14px]" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-gray-900">Activity & Financials</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              <InputField
                label="Annual Revenue (₹)"
                placeholder="e.g. 50,00,000"
                type="number"
                icon={IndianRupee}
                value={formData.annualRevenue}
                onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
                error={errors.annualRevenue}
                className="bg-gray-50/50 text-xs md:text-sm py-1.5 md:py-2"
              />
              <InputField
                label="Years in Operation"
                placeholder="e.g. 5"
                type="number"
                icon={Briefcase}
                value={formData.yearsInOperation}
                onChange={(e) => setFormData({ ...formData, yearsInOperation: e.target.value })}
                error={errors.yearsInOperation}
                className="bg-gray-50/50 text-xs md:text-sm py-1.5 md:py-2"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              <SelectBox
                label="Avg. Monthly Invoices"
                options={INVOICE_VOLUMES}
                value={formData.invoiceVolume}
                onChange={(e) => setFormData({ ...formData, invoiceVolume: e.target.value })}
                error={errors.invoiceVolume}
                className="text-xs md:text-sm py-1.5 md:py-2"
              />
              <SelectBox
                label="Customer Type"
                options={CUSTOMER_TYPES}
                value={formData.customerType}
                onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
                error={errors.customerType}
                className="text-xs md:text-sm py-1.5 md:py-2"
              />
            </div>
          </div>

          {/* 4. Compliance */}
          <div className="space-y-3 md:space-y-4 animate-in slide-in-from-bottom-10 duration-800">
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-2 md:pb-3">
              <div className="h-6 w-6 md:h-7 md:w-7 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 text-gray-600">
                <CheckSquare className="w-3.5 h-3.5 md:w-[14px] md:h-[14px]" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-gray-900">Compliance & Identity</h3>
            </div>

            <div className="grid md:grid-cols-1">
              <InputField
                label="Business PAN Number"
                placeholder="ABCDE1234F"
                icon={CreditCard}
                maxLength={10}
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                error={errors.panNumber}
                className="bg-gray-50/50 uppercase text-xs md:text-sm py-1.5 md:py-2"
              />
            </div>
            
            {/* Consent Checkbox */}
            <div className={`flex items-start gap-2 md:gap-3 p-3 md:p-4 rounded-xl border transition-colors ${errors.consent ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex h-5 md:h-6 items-center">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="h-3.5 w-3.5 md:h-4 md:w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
              </div>
              <div className="text-xs md:text-sm leading-5 md:leading-6">
                <label htmlFor="consent" className="font-medium text-gray-900">
                  Data Verification Consent
                </label>
                <p className="text-gray-500 text-[10px] md:text-sm">
                  I authorize CredFlow to verify my business details and fetch credit information for the purpose of facilitating financing.
                </p>
                {errors.consent && <p className="text-red-500 text-[10px] md:text-xs mt-1">{errors.consent}</p>}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 md:pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 border-t border-gray-100 mt-4 md:mt-6">
             <p className="text-[10px] md:text-xs text-gray-400">
               <span className="text-gray-900 font-medium">Safe & Secure.</span> 256-bit encryption.
             </p>
            
            <Button 
              type="submit" 
              variant="primary" 
              loading={loading} 
              className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-6 py-2.5 md:px-8 md:py-3 rounded-xl shadow-lg shadow-gray-900/20 hover:shadow-xl transition-all duration-300 group flex items-center justify-center gap-2 text-xs md:text-sm font-medium"
            >
              <span>Complete Profile</span>
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BusinessProfile;