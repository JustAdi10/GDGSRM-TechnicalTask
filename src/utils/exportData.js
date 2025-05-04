const fs = require('fs');
const path = require('path');

// Ensure exports directory exists
const createExportsDir = () => {
  const dir = path.join(__dirname, '../../exports');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

// Export attendees to JSON
const exportToJSON = async (data, eventId) => {
  try {
    const dir = createExportsDir();
    const fileName = `attendees-${eventId}-${Date.now()}.json`;
    const filePath = path.join(dir, fileName);
    
    // Write data to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    return {
      fileName,
      filePath
    };
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw new Error('Failed to export data to JSON');
  }
};

// Export attendees to CSV
const exportToCSV = async (data, eventId) => {
  try {
    const dir = createExportsDir();
    const fileName = `attendees-${eventId}-${Date.now()}.csv`;
    const filePath = path.join(dir, fileName);
    
    // Create CSV header
    const header = 'Name,Email,StudentID,RegistrationDate,CheckedIn,CheckedInTime\n';
    
    // Create CSV rows
    const rows = data.map(item => {
      return `${item.user.name},${item.user.email},${item.user.studentID},${new Date(item.registeredAt).toISOString()},${item.isCheckedIn},${item.checkedInAt ? new Date(item.checkedInAt).toISOString() : ''}\n`;
    }).join('');
    
    // Write data to file
    fs.writeFileSync(filePath, header + rows);
    
    return {
      fileName,
      filePath
    };
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw new Error('Failed to export data to CSV');
  }
};

module.exports = {
  exportToJSON,
  exportToCSV
};
