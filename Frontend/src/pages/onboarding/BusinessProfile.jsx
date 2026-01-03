import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Briefcase, IndianRupee, FileText, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

import InputField from '../../components/form/InputField';
import SelectBox from '../../components/form/SelectBox';
import Button from '../../components/common/Button';
import businessService from '../../services/businessService';

const INDUSTRIES = [
  { value: 'Retail', label: 'Retail & E-commerce' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Services', label: 'Professional Services' },
  { value: 'Logistics', label: 'Logistics & Transport' },
  { value: 'Construction', label: 'Construction & Real Estate' },
  { value: 'Other', label: 'Other' },
];

const BUSINESS_TYPES = [
  { value: 'Sole Proprietorship', label: 'Sole Proprietorship' },
  { value: 'Partnership', label: 'Partnership' },
  { value: 'Private Limited', label: 'Private Limited' },
  { value: 'LLP', label: 'Limited Liability Partnership' },
];

const BusinessProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    businessName: '',
    taxId: '', 
    industry: '',
    annualRevenue: '',
    businessType: '',
    yearsInOperation: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.businessName) newErrors.businessName = "Business name is required";
    if (!formData.taxId) newErrors.taxId = "GSTIN/Tax ID is required";
    if (!formData.industry) newErrors.industry = "Please select an industry";
    if (!formData.businessType) newErrors.businessType = "Please select a business type";

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
      await businessService.createProfile({
        ...formData,
        annualRevenue: Number(formData.annualRevenue),
        yearsInOperation: Number(formData.yearsInOperation) || 0
      });

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
          
          {/* Section 1 */}
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <div className="h-7 w-7 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 text-gray-600">
                <Building2 size={14} />
              </div>
              <h3 className="text-base font-bold text-gray-900">Company Identity</h3>
            </div>

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
                label="GSTIN / Tax ID"
                placeholder="22AAAAA0000A1Z5"
                icon={FileText}
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value.toUpperCase() })}
                error={errors.taxId}
                className="bg-gray-50/50 focus:bg-white transition-all uppercase text-sm py-2"
              />
            </div>

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
          </div>

          {/* Section 2 */}
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