// Sample user data for demo purposes
const sampleUser = {
  id: 'usr789012',
  name: 'John Doe',
  email: 'john@example.com',
  studentID: 'STU001',
  role: 'student' // 'student' or 'admin'
};

// Check if user is logged in
function isLoggedIn() {
  // In a real app, this would check for a token in localStorage
  // For demo purposes, we'll always return true
  return true;
}

// Check if user is admin
function isAdmin() {
  // In a real app, this would check the user's role from the token
  // For demo purposes, we'll use the sampleUser
  return sampleUser.role === 'admin';
}

// Function to generate QR code data
function generateQRCodeData(userId, eventId) {
  return {
    userId: userId,
    eventId: eventId,
    timestamp: new Date().toISOString()
  };
}

// Function to generate QR code
function generateQRCode(data, elementId) {
  const qrData = JSON.stringify(data);
  const qrContainer = document.getElementById(elementId);
  
  // Clear previous QR code if any
  qrContainer.innerHTML = '';
  
  // Create a new QR code
  try {
    new QRCode(qrContainer, {
      text: qrData,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
    console.log('QR code generated successfully with data:', qrData);
  } catch (error) {
    console.error('Error generating QR code:', error);
    qrContainer.innerHTML = '<div class="alert alert-danger">Failed to generate QR code. Please try again.</div>';
  }
}

// Format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Load header
document.addEventListener('DOMContentLoaded', function() {
  const headerContainer = document.getElementById('header-container');
  if (headerContainer) {
    headerContainer.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-dark bg-gradient-primary fixed-top">
        <div class="container">
          <a class="navbar-brand" href="index.html">Event Check-In System</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <a class="nav-link" href="index.html">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="events.html">Events</a>
              </li>
              ${isLoggedIn() ? `
                <li class="nav-item">
                  <a class="nav-link" href="registrations.html">My Registrations</a>
                </li>
              ` : ''}
              ${isAdmin() ? `
                <li class="nav-item">
                  <a class="nav-link" href="dashboard.html">Dashboard</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="scanner.html">QR Scanner</a>
                </li>
              ` : ''}
            </ul>
            <div class="d-flex">
              ${isLoggedIn() ? `
                <span class="navbar-text me-3 text-white">
                  Welcome, ${sampleUser.name}
                </span>
                <button class="btn btn-outline-light" id="logoutBtn">Logout</button>
              ` : `
                <a href="login.html" class="btn btn-outline-light me-2">Login</a>
                <a href="register.html" class="btn btn-light">Register</a>
              `}
            </div>
          </div>
        </div>
      </nav>
    `;
    
    // Set active nav item based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = headerContainer.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
    
    // Add logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        // In a real app, this would clear the token from localStorage
        alert('You have been logged out.');
        window.location.href = 'login.html';
      });
    }
  }
  
  // Load footer
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    footerContainer.innerHTML = `
      <footer class="py-4">
        <div class="container">
          <div class="row">
            <div class="col-md-6 text-center text-md-start">
              <p class="mb-0">&copy; 2025 Event Check-In System. All rights reserved.</p>
            </div>
            <div class="col-md-6 text-center text-md-end">
              <p class="mb-0">Developed by Your Name</p>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
});
