import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Badge, Modal, Button } from 'react-bootstrap';
import { registrationService } from '../services/api';
import QRCode from 'react-qr-code';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await registrationService.getUserRegistrations();
        setRegistrations(response.data.data);
      } catch (err) {
        setError('Failed to load your registrations. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const handleShowQR = (registration) => {
    setSelectedRegistration(registration);
    setShowQRModal(true);
  };

  const handleCloseQR = () => {
    setShowQRModal(false);
    setSelectedRegistration(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center my-5">
          <h3>Loading your registrations...</h3>
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
      <h1 className="mb-4">My Registrations</h1>

      {registrations.length === 0 ? (
        <Alert variant="info">
          You haven't registered for any events yet. Check out the{' '}
          <Alert.Link href="/events">events page</Alert.Link> to find events to attend.
        </Alert>
      ) : (
        <Row>
          {registrations.map((registration) => (
            <Col md={6} lg={4} className="mb-4" key={registration._id}>
              <Card>
                <Card.Body>
                  <Card.Title>{registration.event.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {formatDate(registration.event.date)} at {registration.event.time}
                  </Card.Subtitle>
                  <Card.Text>
                    <Badge bg="secondary" className="me-2">
                      {registration.event.location}
                    </Badge>
                    <div className="mt-2">
                      <strong>Registration Date:</strong>{' '}
                      {formatDate(registration.registeredAt)}
                    </div>
                    <div className="mt-2">
                      <strong>Status:</strong>{' '}
                      {registration.isCheckedIn ? (
                        <Badge bg="success">Checked In</Badge>
                      ) : (
                        <Badge bg="warning">Not Checked In</Badge>
                      )}
                    </div>
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => handleShowQR(registration)}
                  >
                    Show QR Code
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* QR Code Modal */}
      <Modal show={showQRModal} onHide={handleCloseQR} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            QR Code for {selectedRegistration?.event.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedRegistration && (
            <>
              <div className="mb-3">
                <QRCode
                  value={selectedRegistration.qrCode}
                  size={256}
                  level="H"
                />
              </div>
              <p className="mb-1">
                <strong>Event:</strong> {selectedRegistration.event.title}
              </p>
              <p className="mb-1">
                <strong>Date:</strong>{' '}
                {formatDate(selectedRegistration.event.date)}
              </p>
              <p className="mb-1">
                <strong>Time:</strong> {selectedRegistration.event.time}
              </p>
              <p className="mb-1">
                <strong>Location:</strong> {selectedRegistration.event.location}
              </p>
              <Alert variant="info" className="mt-3">
                Present this QR code at the event for check-in.
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseQR}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyRegistrations;
