import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Alert, Badge, Dropdown } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/api';

const Attendees = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventAndAttendees = async () => {
      try {
        // Fetch event details
        const eventResponse = await eventService.getEvent(id);
        setEvent(eventResponse.data.data);

        // Fetch attendees
        const attendeesResponse = await eventService.getEventAttendees(id);
        setAttendees(attendeesResponse.data.data);
      } catch (err) {
        setError('Failed to load event attendees. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndAttendees();
  }, [id]);

  const handleExport = async (format) => {
    try {
      const response = await eventService.exportAttendees(id, format);
      alert(`Attendees exported successfully! File: ${response.data.data.fileName}`);
    } catch (err) {
      setError('Failed to export attendees. Please try again later.');
      console.error(err);
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
          <h3>Loading attendees...</h3>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate('/admin/dashboard')}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Button
            variant="outline-primary"
            onClick={() => navigate('/admin/dashboard')}
            className="me-2"
          >
            Back to Dashboard
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => navigate(`/events/${id}`)}
          >
            View Event
          </Button>
        </Col>
      </Row>

      {event && (
        <Card className="mb-4">
          <Card.Body>
            <h2>{event.title}</h2>
            <p className="lead">
              {formatDate(event.date)} at {event.time} | {event.location}
            </p>
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Attendees</h5>
          <div>
            <Dropdown>
              <Dropdown.Toggle variant="outline-primary" id="dropdown-export">
                Export
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleExport('csv')}>
                  Export as CSV
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleExport('json')}>
                  Export as JSON
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Card.Header>
        <Card.Body>
          {attendees.length === 0 ? (
            <Alert variant="info">No attendees registered for this event yet.</Alert>
          ) : (
            <>
              <div className="mb-3">
                <strong>Total Registrations:</strong> {attendees.length} |{' '}
                <strong>Checked In:</strong>{' '}
                {attendees.filter((a) => a.isCheckedIn).length} |{' '}
                <strong>Check-in Rate:</strong>{' '}
                {(
                  (attendees.filter((a) => a.isCheckedIn).length /
                    attendees.length) *
                  100
                ).toFixed(2)}
                %
              </div>

              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Student ID</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map((attendee) => (
                    <tr key={attendee._id}>
                      <td>{attendee.user.name}</td>
                      <td>{attendee.user.email}</td>
                      <td>{attendee.user.studentID}</td>
                      <td>{formatDate(attendee.registeredAt)}</td>
                      <td>
                        {attendee.isCheckedIn ? (
                          <Badge bg="success">Checked In</Badge>
                        ) : (
                          <Badge bg="warning">Not Checked In</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Attendees;
