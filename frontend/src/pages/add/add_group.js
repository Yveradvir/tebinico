import { useState, useEffect } from "react";
import { Container, Form, InputGroup, Button, Alert } from "react-bootstrap";
import { axiosInstance, cookies } from "../../things";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";

export default function AddGroup() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true

        if (isMounted) {
            if (!cookies.get('refresh')) {
                navigate('/auth')
            }
        }

        return () => {
            isMounted = false
        }
    }, [navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('groups', {
                title,
                description,
            });

            if (response.status === 200) {
                navigate(`/group/${response.data.id}`, {
                    replace: true
                });
            }
            
        } catch (error) {
            console.error(error);

            let errorMessage = error.response?.data?.message || 'An error occurred';

            if (typeof errorMessage === 'object') {
                errorMessage = Object.values(errorMessage).join(', ');
            }

            setError(errorMessage);
        }
    };

    return (
        <div>
            <Header/>
            <Container>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Enter the title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={60}
                                minLength={4}
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                as="textarea"
                                placeholder="Enter the description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={300}
                                minLength={4}
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>

                {error && (
                    <Alert variant="danger" className="mt-3">
                        {error}
                    </Alert>
                )}
            </Container>
        </div>
    );
}
