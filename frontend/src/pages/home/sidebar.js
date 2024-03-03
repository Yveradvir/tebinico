import { Col, Row, Button } from "react-bootstrap";
import { useState } from "react";

export default function Sidebar() {
    const groupsData = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        title: `Group ${index + 1} with a long title for testing purposes`,
    }));

    const [visibleGroups, setVisibleGroups] = useState(6);

    const handleViewAllClick = () => {
        setVisibleGroups(groupsData.length);
    };

    return (
        <>
            {groupsData.slice(0, visibleGroups).map((group) => (
                <div key={group.id} className="mt-2">
                    <Row>
                        <Col>
                            <p>{group.title.substring(0, 20)}</p>
                        </Col>
                        <Col>
                            <Button
                                variant="outline-primary"
                                onClick={() => alert(`Navigate to Group ${group.id}`)}
                            >
                                Go to Group
                            </Button>
                        </Col>
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
        </>
    );
}
