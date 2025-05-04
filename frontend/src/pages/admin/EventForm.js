import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/api';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  useEffect(() => {
    const fetchEvent = async () => {
      if (isEditMode) {
        try {
          const response = await eventService.getEvent(id);
          const event = response.data.data;
          
          // Format date for the date input (YYYY-MM-DD)
          const formattedDate = new Date(event.date).toISOString().split('T')[0];
          
          setFormData({
            title: event.title,
            description: event.description,
            location: event.location,
            date: formattedDate,
            time: event.time,
          });
        } catch (err) {
          setError('Failed to load event data. Please try again later.');
          console.error(err);
        } finally {
          setInitialLoading(false);
        }
      }
    };

    fetchEvent();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        await eventService.updateEvent(id, formData);
      } else {
        await eventService.createEvent(formData);
      }
      navigate('/events');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${isEditMode ? 'update' : 'create'} event. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Container>
        <div className="text-center my-5">
          <h3>Loading event data...</h3>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">{isEditMode ? 'Edit Event' : 'Create New Event'}</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter event description"
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3" controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter event location"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="time">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="e.g., 10:00 AM"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-between mt-3">
          <Button variant="secondary" onClick={() => navigate('/events')}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading
              ? isEditMode
                ? 'Updating...'
                : 'Creating...'
              : isEditMode
              ? 'Update Event'
              : 'Create Event'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EventForm;
