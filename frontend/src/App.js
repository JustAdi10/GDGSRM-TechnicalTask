import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import AppNavbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';

// Protected Pages
import MyRegistrations from './pages/MyRegistrations';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import CheckIn from './pages/admin/CheckIn';
import TOTPCheckIn from './pages/admin/TOTPCheckIn';
import EventForm from './pages/admin/EventForm';
import Attendees from './pages/admin/Attendees';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppNavbar />
          <main className="py-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/my-registrations" element={<MyRegistrations />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute requireAdmin={true} />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/check-in" element={<CheckIn />} />
                <Route path="/admin/check-in/totp" element={<TOTPCheckIn />} />
                <Route path="/admin/events/create" element={<EventForm />} />
                <Route path="/admin/events/edit/:id" element={<EventForm />} />
                <Route path="/admin/events/:id/attendees" element={<Attendees />} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
