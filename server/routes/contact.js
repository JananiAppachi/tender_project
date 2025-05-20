import express from 'express';
import Contact from '../models/Contact.js';
import { sendContactEmailToAdmin, sendContactEmailToCustomer } from '../utils/emailService.js';
const contactRoutes = express.Router();

contactRoutes.post('/', async (req, res) => {
  try {
    console.log('Received contact form data:', req.body);

    // Create new contact document from request body
    const contact = new Contact({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      subject: req.body.subject,
      message: req.body.message
    });

    // Save to MongoDB
    const savedContact = await contact.save();
    console.log('Saved contact:', savedContact);
    
    // Send emails
try {
  await sendContactEmailToAdmin(savedContact);
  await sendContactEmailToCustomer(savedContact);
} catch (emailError) {
  console.error('Email notification error:', emailError);
  // Continue even if email fails
}

    res.status(201).json({
      message: 'Message sent successfully',
      contact: savedContact
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ 
      message: 'Failed to send message',
      error: error.message 
    });
  }
});

export default contactRoutes;