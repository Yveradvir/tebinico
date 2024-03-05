import { Alert, Button, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Clock, Envelope, ShieldCheck } from "react-bootstrap-icons";
import { axiosInstance } from "../../things";
import { useState } from "react";

export default function UserCard({about}) {
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    const adminTooltip = (
        <Tooltip id="admin-tooltip">User is an admin</Tooltip>
    );

    const get_token = async () => {
        try {
            const response = await axiosInstance.get('telegram_token')

            if (response.status === 200) {
                setToken(response.data.token)
                console.log(response);
            }
        } catch (error) {
            console.error(error);
            let errorMessage = error.response?.data?.message || 'An error occurred';

            if (typeof errorMessage === 'object') {
                errorMessage = Object.values(errorMessage).join(', ');
            }

            setError(errorMessage);
        }
    }
    
    return (
        <Card>
            <Card.Header>
                <Row>
                    <Col>
                        <h2>
                            <span>
                                {about.me.isAdmin && (
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={adminTooltip}
                                    >
                                        <ShieldCheck size={26} className="me-2" />
                                    </OverlayTrigger>
                                )}
                            </span>
                            Hi, {about.me.username}!
                        </h2>
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                <>
                    <Card.Text>
                        <Envelope size={20} className="me-2" />
                        <strong>Email:</strong> {about.me.email}
                    </Card.Text>
                    <Card.Text>
                        <Clock size={20} className="me-2" />
                        <strong>Created:</strong>{" "}
                        {new Date(about.me.created).toLocaleString()}
                    </Card.Text>
                </>
            </Card.Body>
            <Card.Footer>
                <Row>
                    <Col>
                        <Button onClick={get_token} variant="primary">
                            Get telegram token
                        </Button>
                    </Col>
                    {error ? (
                        <Col>
                            <Alert>
                                <Alert.Heading>
                                    {error}
                                </Alert.Heading>
                            </Alert>
                        </Col>
                    ) : (
                        <>
                        {token && (
                            <Col>
                                <Alert variant="primary">
                                    <Alert.Heading>
                                        {token}
                                    </Alert.Heading>
                                </Alert>
                            </Col>
                        )}
                        </>
                    )}
                </Row>
            </Card.Footer>
        </Card>

    )
}