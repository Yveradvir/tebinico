import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Clock, Envelope, ShieldCheck } from "react-bootstrap-icons";

export default function UserCard({about}) {
    const adminTooltip = (
        <Tooltip id="admin-tooltip">User is an admin</Tooltip>
    );
    
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
        </Card>

    )
}