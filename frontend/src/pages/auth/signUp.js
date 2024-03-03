import { useState } from "react";
import { Alert, Button, ButtonGroup, Container, Form, InputGroup, Row } from "react-bootstrap";
import { Envelope, Lock, ArrowClockwise } from "react-bootstrap-icons";
import { axiosInstance, cookies } from "../../things";
import tokenExp from "./tokenExp";

export default function SignUp({ formSetter }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState('');

    const handleToggle = () => {
        formSetter('l');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password === confirmPassword) {
            const signup = async () => {
                try {
                    const response = await axiosInstance.post('auth/signup', {
                        username, email, password
                    })

                    if (response && response.status === 201) {
                        const data = response.data
                        const tokensLife = await tokenExp();

                        cookies.set('refresh', data.refresh, {
                            expires: tokensLife.r
                        })
                        cookies.set('access', data.access, {
                            expires: tokensLife.a
                        })
                    }
                } catch (error) {
                    console.error(error);
                    let errorMessage = error.response?.data?.message || 'An error occurred';

                    if (typeof errorMessage === 'object') {
                        errorMessage = Object.values(errorMessage).join(', ');
                    }

                    setErrors(errorMessage);
                }
            }

            signup();
        } else {
            setErrors('Passwords do not match')
        }
    };

    return (
        <Container className="p-3 border rounded" id="flip_auth">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>
                            <Lock size={24} className="mr-2" />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            maxLength={60}
                            required
                        />
                    </InputGroup>
                </Form.Group>

                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>
                            <Envelope size={24} className="mr-2" />
                        </InputGroup.Text>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            maxLength={60}
                            required
                        />
                    </InputGroup>
                </Form.Group>

                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>
                            <Lock size={24} className="mr-2" />
                        </InputGroup.Text>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            maxLength={20}
                            required
                        />
                    </InputGroup>
                </Form.Group>

                <Form.Group controlId="formConfirmPassword">
                    <Form.Label>Confirm password</Form.Label>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>
                            <Lock size={24} className="mr-2" />
                        </InputGroup.Text>
                        <Form.Control
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            maxLength={20}
                            required
                        />
                    </InputGroup>
                </Form.Group>
                <Row>
                    <ButtonGroup>
                        <Button variant="primary" type="submit" className="mt-2">
                            Sign Up
                        </Button>
                        <Button variant="outline-primary" className="mt-2 btn-outline-primary" onClick={handleToggle}>
                            <ArrowClockwise size={24} className="mr-2" />
                        </Button>
                    </ButtonGroup>
                </Row>
            </Form>
            {errors && (
                <Alert variant="danger">
                    <Alert.Heading>
                        {errors}
                    </Alert.Heading>
                </Alert>
            )}

        </Container>
    );
}
