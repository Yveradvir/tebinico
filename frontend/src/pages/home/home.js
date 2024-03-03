import { Col, Container, Row, Button, Spinner } from "react-bootstrap";
import Header from "../../components/header";
import { axiosInstance } from "../../things";
import { useEffect, useState } from "react";
import UserCard from "./userCard";
import Sidebar from "./sidebar";

export default function Home() {
    const [about, setAbout] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("me");
                console.log(response);
                if (isMounted) {
                    setAbout(response.data.about);
                    setLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    setError(error);
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div style={{height: '100vh'}}>
            <Header />
            <Container className="mt-2">
                {error && <div className="error-message">Error fetching data. Please try again later.</div>}
                {loading && <Spinner animation="border" role="status" className="loading-spinner">
                    <span className="sr-only">Loading...</span>
                </Spinner>}
                {!loading && !error && (
                    <Row className="h-100">
                        <Col lg={3} className="h-100">
                            <Sidebar />
                            {/* <Sidebar groupsData={about.my_groups}/> */}
                        </Col>
                        <Col>
                            <Button className="d-lg-none mt-2" onClick={() => alert("Toggle Sidebar")}>
                                &#9655; Show Sidebar
                            </Button>
                            <UserCard about={about} />
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );
}
