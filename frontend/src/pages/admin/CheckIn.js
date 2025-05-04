import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { registrationService } from '../../services/api';

const CheckIn = () => {
  const [qrData, setQrData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [checkInResult, setCheckInResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!qrData.trim()) {
      setError('Please enter QR code data');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setCheckInResult(null);

    try {
      const response = await registrationService.checkInWithQR(qrData);
      setSuccess('Check-in successful!');
      setCheckInResult(response.data.data);
      setQrData('');
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in failed. Please try again.');
      
      // If the error is that the user is already checked in, still show the user data
      if (err.response?.data?.data) {
        setCheckInResult(err.response.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTOTPCheckIn = () => {
    // Redirect to TOTP check-in page
    window.location.href = '/admin/check-in/totp';
  };

  return (
    <Container>
      <h1 className="mb-4">Check-In Attendees</h1>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">QR Code Check-In</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="qrData">
                  <Form.Label>QR Code Data</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={qrData}
                    onChange={(e) => setQrData(e.target.value)}
                    placeholder="Paste QR code data here..."
                    required
                  />
                  <Form.Text className="text-muted">
                    Scan the QR code and paste the data here, or use a QR code scanner that directly inputs the data.
                  </Form.Text>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="me-2"
                >
                  {loading ? 'Processing...' : 'Check In'}
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleTOTPCheckIn}
                >
                  TOTP Check-In
                </Button>
              </Form>

              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" className="mt-3">
                  {success}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          {checkInResult && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">Attendee Information</h5>
              </Card.Header>
              <Card.Body>
                <p>
                  <strong>Name:</strong> {checkInResult.user.name}
                </p>
                <p>
                  <strong>Email:</strong> {checkInResult.user.email}
                </p>
                <p>
                  <strong>Student ID:</strong> {checkInResult.user.studentID}
                </p>
                <p>
                  <strong>Event:</strong> {checkInResult.event.title}
                </p>
                {checkInResult.checkedInAt && (
                  <p>
                    <strong>Checked In At:</strong>{' '}
                    {new Date(checkInResult.checkedInAt).toLocaleString()}
                  </p>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CheckIn;
