import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApplication } from '../api/applicationApi';

const AddApplication: React.FC = () => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'Pending',
    location: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createApplication(formData);
      navigate('/applications');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Add New Application</h1>
      
      <div className="card">
        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm mb-6 border border-red-500/20">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Company *</label>
              <input
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. Google"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Position *</label>
              <input
                type="text"
                name="position"
                required
                value={formData.position}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. Frontend Engineer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offered">Offered</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. Remote, San Francisco"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input-field min-h-[120px] resize-y"
              placeholder="Any important details, links, or notes..."
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full md:w-auto px-8 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddApplication;
