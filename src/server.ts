import Hapi from '@hapi/hapi';
import JWT from '@hapi/jwt';
import dotenv from 'dotenv';
import { createDefaultUserIfNotExists } from './models/user';
import { authRoutes } from './routes/authRoutes';

dotenv.config();

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: 'localhost'
    });

    // Register JWT plugin
    await server.register(JWT);

    // Set up JWT authentication strategy
    server.auth.strategy('jwt', 'jwt', {
        keys: process.env.JWT_SECRET || 'your-secret-key',
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: 14400, // 4 hours
        },
        validate: (artifacts: any) => {
            return {
                isValid: true,
                credentials: { user: artifacts.decoded.payload }
            };
        }
    });

    // Set JWT as the default authentication strategy
    server.auth.default('jwt');

    // Register routes
    server.route(authRoutes);

    // Create default user if not exists
    await createDefaultUserIfNotExists();

    // start server
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();