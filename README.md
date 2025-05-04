# QR-Based Event Check-In System

Offline friendly QR-Based Event Check-In System (Technical-Backend) for GDG on Campus SRM Recruitment 2025.

## Features

- JWT-based authentication with role-based access control
- Event management (create, read, update, delete)
- QR code generation for event registration
- Email integration for sending QR codes
- Admin dashboard APIs for managing events and attendees
- QR code scanning for check-in
- Export attendee lists in CSV or JSON format
- TOTP-based offline verification (Google Authenticator)
- Rate limiting and request logging
- API documentation with Swagger

## Tech Stack

- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- QR code generation
- Nodemailer for email integration
- TOTP (Time-based One-Time Password) with otplib
- Rate limiting with express-rate-limit
- Security headers with helmet
- Swagger for API documentation

## Project Structure

```bash
src/
├── config/           # DB connection, dotenv config
├── controllers/      # Route logic
├── middleware/       # Auth, role checks
├── models/           # Mongoose schemas
├── routes/           # Route definitions
├── utils/            # QR generator, email sender, exporter
└── index.js          # Entry point
```

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/event-checkin
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   EMAIL_SERVICE=gmail
   EMAIL_USERNAME=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_FROM=your_email@gmail.com
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user

### Events

- `GET /api/events` - Get all events
- `POST /api/events` - Create a new event (admin only)
- `GET /api/events/:id` - Get a single event
- `PUT /api/events/:id` - Update an event (admin only)
- `DELETE /api/events/:id` - Delete an event (admin only)
- `POST /api/events/:eventId/register` - Register for an event
- `GET /api/events/:id/attendees` - Get attendees for an event (admin only)
- `GET /api/events/:id/export` - Export attendees for an event (admin only)

### Registrations

- `GET /api/registrations` - Get user's registrations
- `POST /api/registrations/check-in` - Check in with QR code (admin only)
- `POST /api/registrations/verify-totp` - Verify TOTP for check-in (admin only)

### TOTP (Time-based One-Time Password)

- `POST /api/auth/totp/enable` - Enable TOTP for a user
- `POST /api/auth/totp/verify` - Verify and activate TOTP
- `POST /api/auth/totp/disable` - Disable TOTP

### Dashboard

- `GET /api/dashboard` - Get dashboard statistics (admin only)
- `GET /api/dashboard/events/:id/stats` - Get event statistics (admin only)

## Documentation

API documentation is available at `/api-docs` when the server is running.

## Testing

To run the API tests:

```bash
npm test
```

This will execute a series of tests to verify that the API endpoints are working correctly. Make sure the server is running before executing the tests.
