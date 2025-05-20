
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

export const createAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const adminUser = new User({
        username: 'admin',
        email: process.env.ADMIN_EMAIL ,
        password: process.env.ADMIN_PASSWORD ,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};