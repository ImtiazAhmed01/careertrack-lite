import React, { useEffect, useState } from 'react';
import { getApplications, deleteApplication } from '../api/applicationApi';
import { Application } from '../types/application.types';
import { MapPin, Calendar, Trash2 } from 'lucide-react';

const Applications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteApplication(id);
        fetchApps(); // Refresh the list
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">My Applications</h1>
      </div>

      {loading ? (
        <div className="text-slate-400">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-slate-400 mb-4">No applications tracked yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div key={app.id} className="card flex flex-col md:flex-row md:items-center justify-between gap-4 group">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-white">{app.position}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border
                    ${app.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : ''}
                    ${app.status === 'Interviewing' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : ''}
                    ${app.status === 'Offered' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                    ${app.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                  `}>
                    {app.status}
                  </span>
                </div>
                
                <h4 className="text-lg text-blue-400 font-medium mb-3">{app.company}</h4>
                
                <div className="flex items-center gap-6 text-sm text-slate-400">
                  {app.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      {app.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} />
                    {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDelete(app.id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
