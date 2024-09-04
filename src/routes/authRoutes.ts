import { ServerRoute } from '@hapi/hapi';
import * as AuthController from '../controllers/authController';
import Joi from 'joi';

export const authRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/auth/login',
        handler: AuthController.login,
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    username: Joi.string().max(50).required(),
                    password: Joi.string().max(255).required(),
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/auth/register',
        handler: AuthController.register,
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    username: Joi.string().max(50).required(),
                    password: Joi.string().max(255).required(),
                    email: Joi.string().max(255).email().required(),
                })
            }
        }
    }
];