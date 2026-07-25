import api from './axios';
import { Application, ApplicationInput } from '../types/application.types';

export const getApplications = async (): Promise<Application[]> => {
  const response = await api.get('/applications');
  return response.data;
};

export const getApplicationById = async (id: string): Promise<Application> => {
  const response = await api.get(`/applications/${id}`);
  return response.data;
};

export const createApplication = async (data: ApplicationInput): Promise<Application> => {
  const response = await api.post('/applications', data);
  return response.data;
};

export const updateApplication = async (id: string, data: Partial<ApplicationInput>): Promise<Application> => {
  const response = await api.put(`/applications/${id}`, data);
  return response.data;
};

export const deleteApplication = async (id: string): Promise<void> => {
  await api.delete(`/applications/${id}`);
};

export const generateAiFeedback = async (id: string): Promise<{ message: string; aiFeedback: string }> => {
  const response = await api.post(`/applications/${id}/ai-feedback`);
  return response.data;
};
