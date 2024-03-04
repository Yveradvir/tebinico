import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { ArrowBarDown, ArrowBarUp } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { handleReaction } from '../things';

export default function Post({ post }) {
    const navigate = useNavigate();


    const handleGoToSinglePost = () => {
        navigate(`/post/${post.id}`);
    };

    return (
        <Card className="post-card m-2">
            <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.description.length > 300 ? `${post.description.slice(0, 300)}...` : post.description}</Card.Text>
                <div className="d-flex justify-content-between">
                    <div>
                        <Button variant="primary" onClick={() => handleReaction(1, post.id)}>
                            <ArrowBarUp /> Like
                        </Button>
                        <span className="ml-2">Rating: {post.rating}</span>
                        <Button variant="danger" onClick={() => handleReaction(-1, post.id)} className="ml-2">
                            <ArrowBarDown /> Dislike
                        </Button>
                    </div>
                    <div>
                        <Button variant="info" onClick={handleGoToSinglePost}>
                            Go to Single Post 
                        </Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};
