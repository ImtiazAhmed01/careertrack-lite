import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        const token = generateToken({ id: user.id });
        res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }

        const token = generateToken({ id: user.id });
        res.status(200).json({ user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (error) {
        next(error);
    }
};

export const me = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token } = req.body;

        // Verify the Google ID token
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            res.status(400).json({ error: 'Invalid Google token' });
            return;
        }

        const { email, name } = payload;

        // Check if user exists
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Create user without password since they logged in via Google
            user = await prisma.user.create({
                data: {
                    email,
                    name: name || 'Google User',
                },
            });
        }

        // Generate custom JWT
        const jwtToken = generateToken({ id: user.id });
        res.status(200).json({ user: { id: user.id, name: user.name, email: user.email }, token: jwtToken });
    } catch (error) {
        next(error);
    }
};
