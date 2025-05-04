import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await dashboardService.getDashboardStats();
        setStats(response.data.data);
      } catch (err) {
        setError('Failed to load dashboard statistics. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center my-5">
          <h3>Loading dashboard statistics...</h3>
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
      <h1 className="mb-4">Admin Dashboard</h1>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h2>{stats.totalUsers}</h2>
              <Card.Title>Total Users</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h2>{stats.totalEvents}</h2>
              <Card.Title>Total Events</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h2>{stats.totalRegistrations}</h2>
              <Card.Title>Total Registrations</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h2>{stats.totalCheckIns}</h2>
              <Card.Title>Total Check-ins</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Upcoming Events</h5>
            </Card.Header>
            <Card.Body>
              {stats.upcomingEvents.length === 0 ? (
                <Alert variant="info">No upcoming events.</Alert>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.upcomingEvents.map((event) => (
                      <tr key={event._id}>
                        <td>
                          <Link to={`/events/${event._id}`}>{event.title}</Link>
                        </td>
                        <td>{formatDate(event.date)}</td>
                        <td>{event.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Recent Registrations</h5>
            </Card.Header>
            <Card.Body>
              {stats.recentRegistrations.length === 0 ? (
                <Alert variant="info">No recent registrations.</Alert>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Event</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentRegistrations.map((registration) => (
                      <tr key={registration._id}>
                        <td>{registration.user.name}</td>
                        <td>
                          <Link to={`/events/${registration.event._id}`}>
                            {registration.event.title}
                          </Link>
                        </td>
                        <td>
                          {registration.isCheckedIn ? (
                            <Badge bg="success">Checked In</Badge>
                          ) : (
                            <Badge bg="warning">Not Checked In</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Event Statistics</h5>
            </Card.Header>
            <Card.Body>
              {stats.eventStats.length === 0 ? (
                <Alert variant="info">No event statistics available.</Alert>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Registrations</th>
                      <th>Check-ins</th>
                      <th>Check-in Rate</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.eventStats.map((event) => (
                      <tr key={event.id}>
                        <td>
                          <Link to={`/events/${event.id}`}>{event.title}</Link>
                        </td>
                        <td>{formatDate(event.date)}</td>
                        <td>{event.registrations}</td>
                        <td>{event.checkIns}</td>
                        <td>{event.checkInRate.toFixed(2)}%</td>
                        <td>
                          <Link to={`/admin/events/${event.id}/attendees`}>
                            View Attendees
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
