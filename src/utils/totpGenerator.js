const { authenticator } = require('otplib');
const QRCode = require('qrcode');

// Generate TOTP secret
const generateTOTPSecret = (userId) => {
  // Generate a secret
  const secret = authenticator.generateSecret();
  
  // Return the secret
  return secret;
};

// Generate TOTP QR code
const generateTOTPQRCode = async (user, secret) => {
  try {
    // Create the OTP auth URL
    const otpauth = authenticator.keyuri(user.email, 'Event Check-In System', secret);
    
    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(otpauth);
    
    return {
      secret,
      qrCodeDataURL
    };
  } catch (error) {
    console.error('Error generating TOTP QR code:', error);
    throw new Error('Failed to generate TOTP QR code');
  }
};

// Verify TOTP token
const verifyTOTPToken = (token, secret) => {
  try {
    return authenticator.verify({ token, secret });
  } catch (error) {
    console.error('Error verifying TOTP token:', error);
    return false;
  }
};

module.exports = {
  generateTOTPSecret,
  generateTOTPQRCode,
  verifyTOTPToken
};
