import db from '../config/database';
import bcrypt from 'bcrypt';

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
}

export const createUser = async (username: string, email: string, password: string): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return db.one(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, hashedPassword]
    );
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
    return db.oneOrNone('SELECT * FROM users WHERE username = $1', username);
};

export const createDefaultUserIfNotExists = async (): Promise<void> => {
    const userCount = await db.one('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.count) === 0) {
        await createUser('admin', 'admin@example.com', 'adminpassword');
        console.log('Default user created');
    }
};