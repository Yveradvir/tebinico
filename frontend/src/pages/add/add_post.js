import { Alert, Container, Form, Button } from "react-bootstrap";
import Header from "../../components/header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance, cookies } from "../../things";

export default function AddPost() {
    const navigate = useNavigate();
    const [myGroups, setMyGroups] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [inGroup, setInGroup] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        if (!cookies.get('refresh')) {
            navigate('/auth');
        }

        const fetchMyGroups = async () => {
            try {
                const response = await axiosInstance.get('my_groups');

                if (isMounted && response.status === 200) {
                    setMyGroups(response.data);
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

        fetchMyGroups();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('post', {
                title, description, 'group_id':inGroup
            })

            navigate(`/post/${response.data.post_id}`)
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
            <Header />
            <Container>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter post title"
                            value={title}
                            maxLength={40}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter post description"
                            value={description}
                            maxLength={1400}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="inGroup">
                        <Form.Label>Select Group</Form.Label>
                        <Form.Select
                            value={inGroup}
                            onChange={(e) => setInGroup(e.target.value)}
                        >
                            <option value="" disabled>Select a group</option>
                            {myGroups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.title}
                                </option>
                            ))}
                        </Form.Select>
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
