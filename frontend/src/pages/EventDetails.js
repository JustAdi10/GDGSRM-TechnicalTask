import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState({
    success: false,
    error: null,
    loading: false,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventService.getEvent(id);
        setEvent(response.data.data);
      } catch (err) {
        setError('Failed to load event details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setRegistrationStatus({
      success: false,
      error: null,
      loading: true,
    });

    try {
      await eventService.registerForEvent(id);
      setRegistrationStatus({
        success: true,
        error: null,
        loading: false,
      });
    } catch (err) {
      setRegistrationStatus({
        success: false,
        error: err.response?.data?.message || 'Registration failed. Please try again.',
        loading: false,
      });
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) return;

    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.deleteEvent(id);
        navigate('/events');
      } catch (err) {
        setError('Failed to delete event. Please try again later.');
        console.error(err);
      }
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
          <h3>Loading event details...</h3>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate('/events')}>
          Back to Events
        </Button>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container>
        <Alert variant="warning">Event not found.</Alert>
        <Button variant="primary" onClick={() => navigate('/events')}>
          Back to Events
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Button variant="outline-primary" onClick={() => navigate('/events')}>
            Back to Events
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Row>
            <Col md={8}>
              <h1>{event.title}</h1>
              <p className="lead">
                <Badge bg="secondary" className="me-2">
                  {event.location}
                </Badge>
                {formatDate(event.date)} at {event.time}
              </p>
              <div className="my-4">
                <h4>Description</h4>
                <p>{event.description}</p>
              </div>

              {registrationStatus.success && (
                <Alert variant="success">
                  Successfully registered! Check your email for the QR code.
                </Alert>
              )}
              {registrationStatus.error && (
                <Alert variant="danger">{registrationStatus.error}</Alert>
              )}

              {isAuthenticated ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleRegister}
                  disabled={registrationStatus.loading}
                >
                  {registrationStatus.loading ? 'Registering...' : 'Register for this Event'}
                </Button>
              ) : (
                <Button variant="primary" size="lg" onClick={() => navigate('/login')}>
                  Login to Register
                </Button>
              )}
            </Col>
            <Col md={4}>
              <Card className="mt-3">
                <Card.Body>
                  <Card.Title>Event Details</Card.Title>
                  <Card.Text>
                    <strong>Date:</strong> {formatDate(event.date)}
                    <br />
                    <strong>Time:</strong> {event.time}
                    <br />
                    <strong>Location:</strong> {event.location}
                  </Card.Text>
                </Card.Body>
              </Card>

              {isAdmin && (
                <div className="mt-3">
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => navigate(`/admin/events/edit/${id}`)}
                  >
                    Edit Event
                  </Button>
                  <Button variant="danger" onClick={handleDelete}>
                    Delete Event
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EventDetails;
