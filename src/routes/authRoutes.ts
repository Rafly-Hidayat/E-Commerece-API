import { ServerRoute } from '@hapi/hapi';
import * as AuthController from '../controllers/authController';

export const authRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/auth/login',
        handler: AuthController.login,
        options: {
            auth: false
        }
    },
    {
        method: 'POST',
        path: '/auth/register',
        handler: AuthController.register,
        options: {
            auth: false
        }
    }
];