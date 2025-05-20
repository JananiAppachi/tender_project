import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
};

// Send contact form email to admin
export const sendContactEmailToAdmin = async (contact) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact Form Submission from ${contact.name}`,
    html: `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Phone:</strong> ${contact.phone}</p>
      <p><strong>Subject:</strong> ${contact.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${contact.message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send contact email to admin:', error);
    throw error;
  }
};

// Send contact form confirmation to customer
export const sendContactEmailToCustomer = async (contact) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: contact.email,
    subject: 'Thank you for contacting us',
    html: `
      <h1>Thank you for contacting us</h1>
      <p>Dear ${contact.name},</p>
      <p>We have received your message and will get back to you shortly.</p>
      <p>Here's a copy of your message:</p>
      <p><strong>Subject:</strong> ${contact.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${contact.message}</p>
      <p>Best regards,<br>Your Company Name</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send contact confirmation email:', error);
    throw error;
  }
};

// Send tender request notification to admin
export const sendTenderRequestEmailToAdmin = async (tenderRequest) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Tender Request Received',
    html: `
      <h1>New Tender Request</h1>
      <p><strong>Company Name:</strong> ${tenderRequest.companyName}</p>
      <p><strong>Contact Person:</strong> ${tenderRequest.contactPerson}</p>
      <p><strong>Email:</strong> ${tenderRequest.email}</p>
      <p><strong>Phone:</strong> ${tenderRequest.phone}</p>
      <p><strong>Project Type:</strong> ${tenderRequest.projectType}</p>
      <p><strong>Project Location:</strong> ${tenderRequest.projectLocation}</p>
      <p><strong>Estimated Budget:</strong> ${tenderRequest.estimatedBudget}</p>
      <p><strong>Preferred Timeline:</strong> ${tenderRequest.preferredTimeline}</p>
      <p><strong>Project Description:</strong></p>
      <p>${tenderRequest.projectDescription}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send tender request email to admin:', error);
    throw error;
  }
};

// Send confirmation email to customer for tender request
export const sendTenderRequestEmailToCustomer = async (tenderRequest) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: tenderRequest.email,
      subject: 'Your Tender Request Has Been Received',
      html: `
        <h2>Thank You for Your Tender Request</h2>
        <p>Dear ${tenderRequest.contactPerson},</p>
        
        <p>We have received your tender request for ${tenderRequest.projectType} in ${tenderRequest.projectLocation}.</p>
        
        <h3>What Happens Next?</h3>
        <p>Our team will review your requirements and get back to you within 2 business days. Here's what you can expect:</p>
        
        <ol>
          <li><strong>Review:</strong> Our team will review your project requirements within 2 business days.</li>
          <li><strong>Consultation:</strong> We'll schedule a consultation to discuss your project in detail.</li>
          <li><strong>Proposal:</strong> You'll receive a detailed proposal with timeline and cost estimates.</li>
        </ol>
        
        <p>If you have any questions in the meantime, please feel free to contact us at jananiappachi0@gmail.com or call us at +91 8148170052.</p>
        
        <p>Best regards,<br>
        The Dhiya Infrastructure Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Customer confirmation email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending customer confirmation email:', error);
    return false;
  }
};