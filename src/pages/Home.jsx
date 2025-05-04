import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Welcome to the Event Check-In System</h1>
          <p className="lead">
            A QR-based event check-in system for college events
          </p>
        </Col>
      </Row>

      <Row>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Browse Events</Card.Title>
              <Card.Text>
                View all upcoming events and register for the ones you're interested in.
              </Card.Text>
              <Button as={Link} to="/events" variant="primary">
                View Events
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {isAuthenticated && (
          <Col md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>My Registrations</Card.Title>
                <Card.Text>
                  View all events you've registered for and access your QR codes.
                </Card.Text>
                <Button as={Link} to="/my-registrations" variant="primary">
                  View Registrations
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}

        {isAdmin && (
          <>
            <Col md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Admin Dashboard</Card.Title>
                  <Card.Text>
                    Access the admin dashboard to manage events and view statistics.
                  </Card.Text>
                  <Button as={Link} to="/admin/dashboard" variant="primary">
                    Go to Dashboard
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Check-In Attendees</Card.Title>
                  <Card.Text>
                    Scan QR codes to check in attendees at events.
                  </Card.Text>
                  <Button as={Link} to="/admin/check-in" variant="primary">
                    Go to Check-In
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}

        {!isAuthenticated && (
          <>
            <Col md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Login</Card.Title>
                  <Card.Text>
                    Already have an account? Login to register for events.
                  </Card.Text>
                  <Button as={Link} to="/login" variant="primary">
                    Login
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Register</Card.Title>
                  <Card.Text>
                    Don't have an account? Register to get started.
                  </Card.Text>
                  <Button as={Link} to="/register" variant="primary">
                    Register
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}
      </Row>
    </Container>
  );
};

export default Home;
