// src/controllers/authController.ts

import { Request, ResponseToolkit } from '@hapi/hapi';
import * as UserModel from '../models/user';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/auth';

export const login = async (request: Request, h: ResponseToolkit) => {
    const { username, password } = request.payload as any;

    try {
        const user = await UserModel.getUserByUsername(username);
        if (!user) {
            return h.response({ error: 'Invalid credentials' }).code(401);
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return h.response({ error: 'Invalid credentials' }).code(401);
        }

        const token = generateToken(user);
        return h.response({ username: user.username, email: user.email, token }).code(200);
    } catch (error) {
        console.error('Login error:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

export const register = async (request: Request, h: ResponseToolkit) => {
    const { username, email, password } = request.payload as any;

    try {
        const existingUser = await UserModel.getUserByUsername(username);
        if (existingUser) {
            return h.response({ error: 'Username already exists' }).code(400);
        }

        const newUser = await UserModel.createUser(username, email, password);
        const token = generateToken(newUser);
        return h.response({ token }).code(201);
    } catch (error) {
        console.error('Registration error:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};