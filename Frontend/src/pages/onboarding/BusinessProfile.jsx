import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Briefcase, IndianRupee, FileText, ArrowRight, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

import InputField from '../../components/form/InputField';
import SelectBox from '../../components/form/SelectBox';
import Button from '../../components/common/Button';
import businessService from '../../services/businessService';

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

const BusinessProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Updated state to match Backend/src/models/Business.js exactly
  const [formData, setFormData] = useState({
    businessName: '',
    registrationNumber: '', // Backend expects 'registrationNumber', NOT 'taxId'
    industry: '',
    annualRevenue: '',
    yearsInOperation: '',
    address: '', // Backend requires this field
    businessType: '' // Kept for UI state, even if backend ignores it currently
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.businessName) newErrors.businessName = "Business name is required";
    if (!formData.registrationNumber) newErrors.registrationNumber = "GSTIN/Registration No. is required";
    if (!formData.industry) newErrors.industry = "Please select an industry";
    if (!formData.businessType) newErrors.businessType = "Please select a business type";
    if (!formData.address) newErrors.address = "Business address is required"; // New validation

    if (!formData.annualRevenue) {
      newErrors.annualRevenue = "Revenue is required";
    } else if (isNaN(formData.annualRevenue) || Number(formData.annualRevenue) < 0) {
      newErrors.annualRevenue = "Enter a valid positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // 1. Prepare payload matching Backend/src/controllers/businessController.js
      const payload = {
        businessName: formData.businessName,
        industry: formData.industry,
        registrationNumber: formData.registrationNumber, // Must match backend key
        annualRevenue: Number(formData.annualRevenue),
        yearsInOperation: Number(formData.yearsInOperation) || 0,
        address: formData.address // Must be included
      };

      console.log("Submitting Payload:", payload); // Debugging

      await businessService.createProfile(payload);

      toast.success("Profile created successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#D1F34B]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl" />
      </div>

      <div className="text-center mb-6 pt-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Setup Your Business
        </h1>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Help us tailor your financing experience. It only takes a minute.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
        
        <div className="h-1 w-full bg-gray-100">
          <div className="h-full w-2/3 bg-[#D1F34B]" />
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          {/* Section 1: Company Identity */}
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <div className="h-7 w-7 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 text-gray-600">
                <Building2 size={14} />
              </div>
              <h3 className="text-base font-bold text-gray-900">Company Identity</h3>
            </div>

            {/* Row 1 */}
            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                label="Business Name"
                placeholder="e.g. Acme Innovations Ltd"
                icon={Building2}
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                error={errors.businessName}
                className="bg-gray-50/50 focus:bg-white transition-all text-sm py-2"
              />

              <InputField
                label="GSTIN / Registration No"
                placeholder="22AAAAA0000A1Z5"
                icon={FileText}
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })}
                error={errors.registrationNumber}
                className="bg-gray-50/50 focus:bg-white transition-all uppercase text-sm py-2"
              />
            </div>

            {/* Row 2 */}
            <div className="grid md:grid-cols-2 gap-4">
              <SelectBox
                label="Industry Sector"
                options={INDUSTRIES}
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                error={errors.industry}
                className="text-sm py-2"
              />

              <SelectBox
                label="Legal Structure"
                options={BUSINESS_TYPES}
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                error={errors.businessType}
                className="text-sm py-2"
              />
            </div>
            
            {/* Row 3: Added Address Field (Required by Backend) */}
            <div className="grid grid-cols-1">
              <InputField
                label="Business Address"
                placeholder="Full registered office address"
                icon={MapPin}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                error={errors.address}
                className="bg-gray-50/50 focus:bg-white transition-all text-sm py-2"
              />
            </div>
          </div>

          {/* Section 2: Financial Metrics */}
          <div className="space-y-4 animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <div className="h-7 w-7 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 text-gray-600">
                <IndianRupee size={14} />
              </div>
              <h3 className="text-base font-bold text-gray-900">Financial Metrics</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                label="Annual Revenue"
                placeholder="e.g. 50,00,000"
                type="number"
                icon={IndianRupee}
                value={formData.annualRevenue}
                onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
                error={errors.annualRevenue}
                className="bg-gray-50/50 focus:bg-white transition-all text-sm py-2"
              />

              <InputField
                label="Years in Operation"
                placeholder="e.g. 5"
                type="number"
                icon={Briefcase}
                value={formData.yearsInOperation}
                onChange={(e) => setFormData({ ...formData, yearsInOperation: e.target.value })}
                error={errors.yearsInOperation}
                className="bg-gray-50/50 focus:bg-white transition-all text-sm py-2"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 mt-6">
             <p className="text-xs text-gray-400">
               <span className="text-gray-900 font-medium">Safe & Secure.</span> Your data is encrypted.
             </p>
            
            <Button 
              type="submit" 
              variant="primary" 
              loading={loading} 
              className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl shadow-lg shadow-gray-900/20 hover:shadow-xl transition-all duration-300 group flex items-center justify-center gap-2 text-sm"
            >
              <span>Complete Setup</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BusinessProfile;