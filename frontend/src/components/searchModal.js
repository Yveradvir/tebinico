import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cookies } from "../things";
import { Alert, Button, ButtonGroup, Col, Form, Modal, Row } from "react-bootstrap";

export default function SearchModal({ showModal, closeModal }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [filter, setFilter] = useState('');
    const [filterBy, setFilterBy] = useState('posts_by_name');
    const [errors, setErrors] = useState('');

    const handleClose = () => {
        setFilter('');
        setFilterBy('name');
        closeModal();
    }

    const handleSearch = async () => {
        try {
            const params = {
                in_group: location.pathname.startsWith('/group/'),
                id: location.pathname.split('/').pop()
            }
            if (filterBy === 'groups_by_name') {
                navigate(`/groups?filterBy=${filterBy}&filter=${filter}`);
            } else if (['posts_by_name', 'my_posts', 'posts_by_rating'].includes(filterBy)) {
                if (params.in_group) {
                    navigate(`/group/${params.id}?filterBy=${filterBy}&filter=${filter}`);
                }
            } else if (filterBy === 'all_my_posts') {
                navigate('/home');
            }
            
            window.location.reload()
            handleClose();
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
        if (cookies.get('refresh')) {
            try {
                await handleSearch();
            } catch (error) {
                console.error("Error during search:", error);
            }
        } else {
            setErrors('You are unauthorized')
        }
    }

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Search</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={(ev) => { ev.preventDefault() }}>
                    <Row className="mb-3">
                        <Form.Label column sm="2">Filter</Form.Label>
                        <Col sm="10">
                            <Form.Select
                                value={filterBy}
                                onChange={(e) => setFilterBy(e.target.value)}
                            >
                                <option value="posts_by_name" selected>Post by name</option>
                                <option value="posts_by_rating">Post by rating</option>
                                <option value="my_posts">My posts</option>
                                <option value="all_my_posts">All my posts</option>
                                <option value="groups_by_name" selected>Groups by name</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Form.Group as={Col} controlId="password" >
                        <Form.Label>Filter</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={`Enter your ${filterBy} query`}
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
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
