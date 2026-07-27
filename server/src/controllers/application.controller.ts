import { Response, NextFunction } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';

export const createApplication = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { company, position, status, location, notes } = req.body;
    
    const application = await prisma.application.create({
      data: {
        company,
        position,
        status,
        location,
        notes,
        userId: req.user.id,
      },
    });
    
    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

export const getApplications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    
    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const application = await prisma.application.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    
    if (!application) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }
    
    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { company, position, status, location, notes, aiFeedback } = req.body;
    
    const application = await prisma.application.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data: { company, position, status, location, notes, aiFeedback },
    });
    
    if (application.count === 0) {
      res.status(404).json({ error: 'Application not found or unauthorized' });
      return;
    }
    
    const updated = await prisma.application.findUnique({ where: { id: req.params.id } });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const application = await prisma.application.deleteMany({
      where: { id: req.params.id, userId: req.user.id },
    });
    
    if (application.count === 0) {
      res.status(404).json({ error: 'Application not found or unauthorized' });
      return;
    }
    
    res.status(200).json({ message: 'Application deleted' });
  } catch (error) {
    next(error);
  }
};

export const generateAiFeedback = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Placeholder AI credentials
    const AI_API_KEY = process.env.AI_API_KEY || 'PLACEHOLDER_KEY';
    
    // TODO: Connect to AI service here
    const mockFeedback = "Here is some AI feedback for your application. This is a placeholder.";
    
    const application = await prisma.application.updateMany({
      where: { id, userId: req.user.id },
      data: { aiFeedback: mockFeedback },
    });
    
    res.status(200).json({ message: 'Feedback generated', aiFeedback: mockFeedback });
  } catch (error) {
    next(error);
  }
};
