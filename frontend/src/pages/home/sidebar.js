import { Col, Row, Button } from "react-bootstrap";
import { useState } from "react";
import AddBtn from "../../components/addBtn";
import { useNavigate } from "react-router-dom";

export default function Sidebar({groupsData}) {
    // const groupsData = Array.from({ length: 15 }, (_, index) => ({
    //     id: index + 1,
    //     title: `Group ${index + 1} with a long title for testing purposes`,
    // }));
    const navigate = useNavigate(); 
    const [visibleGroups, setVisibleGroups] = useState(6);

    const handleViewAllClick = () => {
        setVisibleGroups(groupsData.length);
    };

    return (
        <Col>
            {groupsData.slice(0, visibleGroups).map((group) => (
                <div key={group.id} className="mt-2">
                    <Row>
                        <Row>
                            <p className="truncated-text">{group.title.substring(0, 20)}</p>
                        </Row>
                        <Row>
                            <Button
                                variant="outline-primary"
                                onClick={() => navigate(`/group/${group.id}`)}
                            >
                                Go to Group
                            </Button>
                        </Row>
                    </Row>
                </div>
            ))}
            {groupsData.length > visibleGroups && (
                <div className="mt-2">
                    <Button
                        variant="outline-primary"
                        onClick={handleViewAllClick}
                    >
                        View All Groups
                    </Button>
                </div>
            )}
            <AddBtn/>
        </Col>
    );
}
