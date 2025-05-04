const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const createUploadsDir = () => {
  const dir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

// Generate QR code with metadata
const generateQRCode = async (data) => {
  try {
    const dir = createUploadsDir();
    const fileName = `qr-${data.userId}-${data.eventId}-${Date.now()}.png`;
    const filePath = path.join(dir, fileName);
    
    // Convert data to JSON string
    const jsonData = JSON.stringify(data);
    
    // Generate QR code
    await QRCode.toFile(filePath, jsonData);
    
    return {
      fileName,
      filePath,
      qrCodeData: jsonData
    };
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

module.exports = {
  generateQRCode
};
