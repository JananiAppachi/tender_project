import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

export const config = {
    mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dhiya-infra',
    jwtSecret: process.env.JWT_SECRET || 'dhiya-infra-secret-key',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@dhiyainfra.com',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
    port: process.env.PORT || 5000
}; 