import React, { useEffect, useState } from 'react';
import { getApplications } from '../api/applicationApi';
import { Application } from '../types/application.types';
import { Briefcase, Building2, CheckCircle2, XCircle, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await getApplications();
        setApplications(data);
      } catch (error) {
        console.error('Failed to fetch applications', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const stats = [
    { label: 'Total Applications', value: applications.length, icon: <Briefcase className="text-blue-400" size={24} /> },
    { label: 'Pending', value: applications.filter(a => a.status === 'Pending').length, icon: <Clock className="text-yellow-400" size={24} /> },
    { label: 'Interviewing', value: applications.filter(a => a.status === 'Interviewing').length, icon: <Building2 className="text-purple-400" size={24} /> },
    { label: 'Offered', value: applications.filter(a => a.status === 'Offered').length, icon: <CheckCircle2 className="text-green-400" size={24} /> },
    { label: 'Rejected', value: applications.filter(a => a.status === 'Rejected').length, icon: <XCircle className="text-red-400" size={24} /> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
      
      {loading ? (
        <div className="text-slate-400">Loading your stats...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="card flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-700">
                    {stat.icon}
                  </div>
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                </div>
                <span className="text-sm font-medium text-slate-400">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="card">
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.slice(0, 5).map(app => (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                      <div>
                        <h4 className="font-semibold text-white">{app.position}</h4>
                        <p className="text-sm text-slate-400">{app.company}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border
                          ${app.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : ''}
                          ${app.status === 'Interviewing' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : ''}
                          ${app.status === 'Offered' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                          ${app.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                        `}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">No recent applications found. Start applying!</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
