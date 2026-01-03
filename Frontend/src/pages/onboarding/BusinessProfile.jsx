import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Briefcase, IndianRupee, FileText } from 'lucide-react';
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
    taxId: '', // GSTIN
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

    // Revenue validation
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
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Complete your profile</h1>
        <p className="text-gray-500 mt-1">
          Tell us about your business to get personalized financing offers.
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
              Business Details
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              <InputField
                label="Business Name"
                placeholder="e.g. Acme Traders Pvt Ltd"
                icon={Building2}
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                error={errors.businessName}
              />

              <InputField
                label="GSTIN / Tax ID"
                placeholder="22AAAAA0000A1Z5"
                icon={FileText}
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value.toUpperCase() })}
                error={errors.taxId}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <SelectBox
                label="Industry"
                options={INDUSTRIES}
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                error={errors.industry}
              />

              <SelectBox
                label="Business Type"
                options={BUSINESS_TYPES}
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                error={errors.businessType}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2 pt-2">
              Financial Overview
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              <InputField
                label="Annual Revenue (₹)"
                placeholder="e.g. 5000000"
                type="number"
                icon={IndianRupee}
                value={formData.annualRevenue}
                onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
                error={errors.annualRevenue}
              />

              <InputField
                label="Years in Operation"
                placeholder="e.g. 5"
                type="number"
                icon={Briefcase}
                value={formData.yearsInOperation}
                onChange={(e) => setFormData({ ...formData, yearsInOperation: e.target.value })}
                error={errors.yearsInOperation}
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="submit" variant="primary" loading={loading} className="w-full md:w-auto">
              Complete Setup
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BusinessProfile;