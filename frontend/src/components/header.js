import { useState } from "react";
import { Button, Col, Container, Nav, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";

import { cookies } from "../things";
import OutModal from "./outModal";

import { Search } from 'react-bootstrap-icons';
import SearchModal from "./searchModal";

export default function Header() {
    const currUrl = useLocation();

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);

    const closeOutModal = () => setShowLogoutModal(false);
    const closeSearchModal = () => setShowSearchModal(false);

    const navs = [
        { href: "/home", text: "Home" },
        { href: "/groups", text: "Groups" },
        { href: "/pricing", text: "Pricing" },
        { href: "/faqs", text: "FAQs" },
        { href: "/about", text: "About" },
    ];

    return (
        <Container>
            <header className="py-4">
                <Row className="align-items-center">
                    <Col xs={8} className="d-flex justify-content-between align-items-center">
                        <div className='d-flex align-items-center'>
                            <h1 className="text-primary mb-0">
                                Tebinico
                            </h1>
                        </div>
                        <Nav className="nav-pills ms-3">
                            {navs.map((nav, index) => (
                                <Nav.Item key={index}>
                                    <Nav.Link
                                        href={nav.href}
                                        active={currUrl.pathname === nav.href}
                                    >
                                        {nav.text}
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                            {cookies.get('refresh') && (<Button onClick={() => setShowSearchModal(true)} variant='primary' style={{ borderRadius: '26px' }}>
                                <Search />
                            </Button>)}
                        </Nav>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-end">
                        <div className='btn-group'>
                            <Button href='/auth' variant="primary">Authorization</Button>
                            {cookies.get('refresh') && (
                                <>
                                    <Button variant='primary' onClick={() => setShowLogoutModal(true)}>Logout</Button>
                                </>
                            )}
                        </div>
                    </Col>
                </Row>
            </header>
            <OutModal showModal={showLogoutModal} closeModal={closeOutModal} />
            <SearchModal showModal={showSearchModal} closeModal={closeSearchModal} />
        </Container>
    );
}
