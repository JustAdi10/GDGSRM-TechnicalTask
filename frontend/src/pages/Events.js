import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState({
    eventId: null,
    success: false,
    error: null,
    loading: false,
  });

  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getAllEvents();
        setEvents(response.data.data);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    if (!isAuthenticated) {
      return;
    }

    setRegistrationStatus({
      eventId,
      success: false,
      error: null,
      loading: true,
    });

    try {
      await eventService.registerForEvent(eventId);
      setRegistrationStatus({
        eventId,
        success: true,
        error: null,
        loading: false,
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setRegistrationStatus({
          eventId: null,
          success: false,
          error: null,
          loading: false,
        });
      }, 3000);
    } catch (err) {
      setRegistrationStatus({
        eventId,
        success: false,
        error: err.response?.data?.message || 'Registration failed. Please try again.',
        loading: false,
      });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center my-5">
          <h3>Loading events...</h3>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Upcoming Events</h1>
          <p className="lead">Browse and register for upcoming events</p>
        </Col>
        {isAdmin && (
          <Col className="text-end">
            <Button as={Link} to="/admin/events/create" variant="primary">
              Create New Event
            </Button>
          </Col>
        )}
      </Row>

      {events.length === 0 ? (
        <Alert variant="info">No events available at the moment.</Alert>
      ) : (
        <Row>
          {events.map((event) => (
            <Col md={6} lg={4} className="mb-4" key={event._id}>
              <Card>
                <Card.Body>
                  <Card.Title>{event.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {formatDate(event.date)} at {event.time}
                  </Card.Subtitle>
                  <Card.Text>
                    <Badge bg="secondary" className="me-2">
                      {event.location}
                    </Badge>
                    <div className="mt-2">{event.description}</div>
                  </Card.Text>

                  {registrationStatus.eventId === event._id && (
                    <>
                      {registrationStatus.success && (
                        <Alert variant="success">
                          Successfully registered! Check your email for the QR code.
                        </Alert>
                      )}
                      {registrationStatus.error && (
                        <Alert variant="danger">{registrationStatus.error}</Alert>
                      )}
                    </>
                  )}

                  <div className="d-flex justify-content-between">
                    <Button
                      as={Link}
                      to={`/events/${event._id}`}
                      variant="outline-primary"
                    >
                      View Details
                    </Button>
                    {isAuthenticated && (
                      <Button
                        variant="primary"
                        onClick={() => handleRegister(event._id)}
                        disabled={registrationStatus.loading && registrationStatus.eventId === event._id}
                      >
                        {registrationStatus.loading && registrationStatus.eventId === event._id
                          ? 'Registering...'
                          : 'Register'}
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Events;
