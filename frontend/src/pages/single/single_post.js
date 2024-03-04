import React, { useEffect, useState } from 'react';
import { Container, Spinner, Card, Button } from 'react-bootstrap';
import Header from '../../components/header';
import { useParams } from 'react-router-dom';
import { axiosInstance, handleReaction } from '../../things';
import AddBtn from '../../components/addBtn';
import { ArrowBarDown, ArrowBarUp } from 'react-bootstrap-icons';

const SinglePost = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [am_i_owner, setAm_I_Owner] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`post?id=${id}`);
                if (response.status === 200) {
                    setPost(response.data.post);
                    setAm_I_Owner(response.data.am_i_owner)
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
                setError('An error occurred while fetching data.');
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return (
        <div>
            <Header />
            <Container>
                {loading && (
                    <Spinner animation="border" role="status" className="loading-spinner">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                )}
                {!loading && !error && post && (
                    <div>
                        <Card>
                            <Card.Body>
                                <Card.Title>{post.title}</Card.Title>
                                <Card.Text>{post.description}</Card.Text>
                                <Card.Footer>
                                    <Button variant="primary" onClick={() => handleReaction(1, post.id)}>
                                        <ArrowBarUp /> Like
                                    </Button>
                                    <span className="ml-2">Rating: {post.rating}</span>
                                    <Button variant="danger" onClick={() => handleReaction(-1, post.id)} className="ml-2">
                                        <ArrowBarDown /> Dislike
                                    </Button>
                                </Card.Footer>
                            </Card.Body>
                        </Card>
                        <AddBtn am_i_owner={am_i_owner} />
                    </div>
                )}
                {error && (
                    <div>
                        <p>Error: {error}</p>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default SinglePost;
