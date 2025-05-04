const nodemailer = require('nodemailer');
const fs = require('fs');

// Create a transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email with QR code
const sendQRCodeEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    // Read QR code file
    const qrCodeAttachment = {
      filename: options.qrFileName,
      path: options.qrFilePath,
      cid: 'qrcode' // Content ID for embedding in HTML
    };
    
    // Email options
    const mailOptions = {
      from: `${process.env.EMAIL_FROM}`,
      to: options.email,
      subject: options.subject,
      html: options.html,
      attachments: [qrCodeAttachment]
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

// Create HTML template for event registration
const createEventRegistrationEmailTemplate = (user, event, qrFileName) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <h2 style="color: #333;">Event Registration Confirmation</h2>
      <p>Hello ${user.name},</p>
      <p>Thank you for registering for <strong>${event.title}</strong>.</p>
      
      <div style="margin: 20px 0;">
        <h3>Event Details:</h3>
        <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${event.time}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p><strong>Description:</strong> ${event.description}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p><strong>Your QR Code for Check-in:</strong></p>
        <img src="cid:qrcode" alt="QR Code" style="max-width: 200px; height: auto;" />
        <p style="font-size: 12px; color: #666; margin-top: 10px;">Please present this QR code at the event for check-in.</p>
      </div>
      
      <p>We look forward to seeing you at the event!</p>
      <p>Best regards,<br>Event Organizers</p>
    </div>
  `;
};

module.exports = {
  sendQRCodeEmail,
  createEventRegistrationEmailTemplate
};
