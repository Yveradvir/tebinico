import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import Header from "../components/header";
import AddBtn from "../components/addBtn";
import { useEffect } from "react";
import { axiosInstance } from "../things";
import { DoorOpen } from 'react-bootstrap-icons';
import ErrorModal from "../components/errModal";

export default function Groups() {
    const location = useLocation();
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [errModal, setErrModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const filterBy = params.get('filterBy');
                const filter = params.get('filter');

                let url = 'groups';
                if (filterBy && filter) {
                    url += `?filterBy=${filterBy}&filter=${filter}`;
                }

                const response = await axiosInstance.get(url);

                if (isMounted && response.status === 200) {
                    setGroups(response.data.groups);
                }
            } catch (error) {
                console.error(error);
                let errorMessage = error.response?.data?.message || 'An error occurred';

                if (typeof errorMessage === 'object') {
                    errorMessage = Object.values(errorMessage).join(', ');
                }

                setErrMsg(errorMessage);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [location.search]);

    const closeModal = () => {
        setErrModal(false);
        setErrMsg('');
    };

    return (
        <div>
            <Header />
            <Container>
                {groups.map(group => (
                    <Card key={group.id} className="mb-3">
                        <Card.Body>
                            <Card.Title>{group.title}</Card.Title>
                            <Card.Text>{group.description.slice(0, 100)}</Card.Text>
                            <Button variant="primary" onClick={() => navigate(`/group/${group.id}`)}>
                                <DoorOpen size={28} />
                            </Button>
                        </Card.Body>
                    </Card>
                ))}
            </Container>
            <AddBtn />
            <ErrorModal handleClose={closeModal} show={errModal} errorMessage={errMsg}/>
        </div>
    );
}
