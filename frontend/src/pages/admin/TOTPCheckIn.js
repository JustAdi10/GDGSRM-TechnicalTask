import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { registrationService } from '../../services/api';

const TOTPCheckIn = () => {
  const [formData, setFormData] = useState({
    userId: '',
    token: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userData, setUserData] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setUserData(null);

    try {
      const response = await registrationService.verifyTOTPForCheckIn(
        formData.userId,
        formData.token
      );
      setSuccess('TOTP verification successful!');
      setUserData(response.data.data.user);
      setFormData({ userId: '', token: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'TOTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1 className="mb-4">TOTP Check-In</h1>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Verify TOTP</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="userId">
                  <Form.Label>User ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    placeholder="Enter user ID"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="token">
                  <Form.Label>TOTP Token</Form.Label>
                  <Form.Control
                    type="text"
                    name="token"
                    value={formData.token}
                    onChange={handleChange}
                    placeholder="Enter 6-digit TOTP token"
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="me-2"
                >
                  {loading ? 'Verifying...' : 'Verify TOTP'}
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => window.location.href = '/admin/check-in'}
                >
                  Back to QR Check-In
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
          {userData && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">User Information</h5>
              </Card.Header>
              <Card.Body>
                <p>
                  <strong>Name:</strong> {userData.name}
                </p>
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
                <p>
                  <strong>Student ID:</strong> {userData.studentID}
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TOTPCheckIn;
