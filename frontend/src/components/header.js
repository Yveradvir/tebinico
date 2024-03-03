import { useState } from "react";
import { Alert, Button, ButtonGroup, Col, Container, Form, Modal, Nav, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { axiosInstance, cookies } from "../things";

function OutModal({ showModal, closeModal }) {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState('');

    const handleClose = () => {
        setPassword('');
        closeModal();
    }

    const handleLogout = async () => {
        try {
            const response = await axiosInstance.delete("auth/logout",
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${cookies.get('access')}`,
                        'X-Refresh-Token': cookies.get('refresh')
                    },
                    data: {
                        password
                    }
                }
            );
            if (response.status === 200) {
                cookies.remove('access')
                cookies.remove('refresh')
                handleClose();
                navigate('/')
            } else {
                setErrors(response.data.message)
            }
        } catch (error) {
            console.error(error);
            let errorMessage = error.response?.data?.message || 'An error occurred';

            if (typeof errorMessage === 'object') {
                errorMessage = Object.values(errorMessage).join(', ');
            }

            setErrors(errorMessage);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleLogout();
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Log out</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={(ev) => { ev.preventDefault() }}>
                    <Form.Group as={Col} controlId="password" >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Row>
                        {errors && (
                            <Alert variant="danger">
                                <Alert.Heading>
                                    {errors}
                                </Alert.Heading>
                            </Alert>
                        )}
                    <Col>
                        <ButtonGroup>
                            <Button variant="primary" type="button" onClick={handleSubmit}>
                                Submit
                            </Button>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                    </ButtonGroup>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>
    );
}


export default function Header() {
    const currUrl = useLocation();

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => setShowLogoutModal(true);
    const closeModal = () => setShowLogoutModal(false);


    const navs = [
        { href: "/home", text: "Home" },
        { href: "/features", text: "Features" },
        { href: "/pricing", text: "Pricing" },
        { href: "/faqs", text: "FAQs" },
        { href: "/about", text: "About" },
    ];

    return (
        <Container>
            <header className="py-4">
                <Row className="align-items-center">
                    <Col xs={8} className="d-flex justify-content-between align-items-center">
                        <div className='d-flex align-items-center'>
                            <h1 className="text-primary mb-0">
                                Tebinico
                            </h1>
                        </div>
                        <Nav className="nav-pills ms-3">
                            {navs.map((nav, index) => (
                                <Nav.Item key={index}>
                                    <Nav.Link
                                        href={nav.href}
                                        active={currUrl === nav.href}
                                    >
                                        {nav.text}
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                        </Nav>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-end">
                        <div className='btn-group'>
                            <Button href='/auth' variant="primary">Authorization</Button>
                            {cookies.get('access') && (
                                <Button variant='primary' onClick={handleLogoutClick}>Logout</Button>
                            )}
                        </div>
                    </Col>
                </Row>
            </header>
            <OutModal showModal={showLogoutModal} closeModal={closeModal} />
        </Container>
    );
}
