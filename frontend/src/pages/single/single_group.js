import { Container, Row, Spinner, Alert, Button } from "react-bootstrap";
import Header from "../../components/header";
import AddBtn from "../../components/addBtn";
import Post from "../../components/post"; // Предполагается, что у вас есть компонент Post
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../things";
import axios from "axios";

export default function SingleGroup() {
    const location = useLocation();
    const { id } = useParams();
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState();
    const [showFullText, setShowFullText] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const filterBy = params.get('filterBy');
                const filter = params.get('filter');

                let url = `group/${id}`;
                if (filterBy && filter) {
                    url += `?filterBy=${filterBy}&filter=${filter}`;
                }

                const response = await axiosInstance.get(url);

                if (isMounted && response.status === 200) {
                    setData(response.data);
                }
            } catch (error) {
                console.error(error);
                let errorMessage = error.response?.data?.message || 'An error occurred';

                if (typeof errorMessage === 'object') {
                    errorMessage = Object.values(errorMessage).join(', ');
                }

                setErrMsg(errorMessage);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [location.search, id]);

    const toggleFullText = () => {
        setShowFullText(!showFullText);
    };

    const init_button = async (btn_type) => {
        try {
            if (btn_type === "exit") {
                const isSubmited = window.confirm("Do you really want exit? ") 
                if (isSubmited) {
                    const response = await axiosInstance.delete(`membership?group_id=${id}`)
                    if (response.status === 200) {
                        window.location.reload()
                    }
                }
            } else {
                const response = await axiosInstance.post('membership', {
                    group_id: id
                })

                if (response.status === 200) {
                    window.location.reload()
                }
            }
        } catch (error) {
            console.error(error);
            let errorMessage = error.response?.data?.message || 'An error occurred';

            if (typeof errorMessage === 'object') {
                errorMessage = Object.values(errorMessage).join(', ');
            }

            setErrMsg(errorMessage);
        }
    }

    return (
        <div>
            <Header />
            <Container>
                {loading && (
                    <Spinner animation="border" role="status" className="loading-spinner">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                )}
                {errMsg && <Alert variant="danger">{errMsg}</Alert>}
                {!loading && !errMsg && (
                    <div>
                        <Row>
                            <h1>{data.group.title}</h1>
                            <p className={showFullText ? "full-text" : "truncated-text"}>
                                {data.group.description}
                            </p>
                            <p className="truncated-text">
                                Was created: {data.group.created}
                            </p>
                            {!showFullText && (
                                <Button variant="link" onClick={toggleFullText}>
                                    Read More
                                </Button>
                            )}
                            {!data.am_i_owner && (
                                <div>
                                    {data.am_in ? (
                                        <Button variant="danger" onClick={() => init_button("exit")}>
                                            Exit
                                        </Button>
                                    ) : (
                                        <Button variant="primary" onClick={() => init_button("enter")}>
                                            Enter
                                        </Button>
                                    )}
                                </div>
                            )}

                        </Row>
                        <hr />
                        <Row>
                            {data.posts.map((post) => (
                                <Post key={post.id} post={post} />
                            ))}
                        </Row>
                        <AddBtn am_i_owner={data.am_i_owner} />
                    </div>
                )}
            </Container>
        </div>
    );
}
