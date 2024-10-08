import JWT from '@hapi/jwt';
import { User } from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (user: User): string => {
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email
    };

    return JWT.token.generate(payload, {
        key: JWT_SECRET,
        algorithm: 'HS256'
    });
};
