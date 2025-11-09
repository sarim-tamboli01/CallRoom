import React from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'
import { Container, Navbar, Nav, Button, Row, Col } from 'react-bootstrap'
import Logo from '../components/Logo'

export default function LandingPage() {
    const router = useNavigate();

    return (
        <div className='landingPageContainer'>
            <Navbar expand="lg" className="px-3 px-md-4 py-3" variant="dark" style={{ background: 'transparent' }}>
                <Container fluid>
                    <Navbar.Brand className="d-flex align-items-center gap-2">
                        <Logo size={36} />
                        <span className="fw-bold fs-4">Apna Video Call</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto align-items-center gap-3">
                            <Nav.Link 
                                onClick={() => router("/aljk23")}
                                className="text-white-50 hover-white"
                                style={{ cursor: 'pointer' }}
                            >
                                Join as Guest
                            </Nav.Link>
                            <Nav.Link 
                                onClick={() => router("/auth")}
                                className="text-white-50 hover-white"
                                style={{ cursor: 'pointer' }}
                            >
                                Register
                            </Nav.Link>
                            <Button 
                                variant="outline-light" 
                                onClick={() => router("/auth")}
                                className="px-3"
                            >
                                Login
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container fluid className="px-3 px-md-5 py-5" style={{ minHeight: 'calc(100vh - 80px)' }}>
                <Row className="align-items-center h-100">
                    <Col lg={6} className="text-center text-lg-start mb-5 mb-lg-0">
                        <h1 className="display-3 fw-bold mb-4">
                            <span style={{ color: "#FF9839" }}>Connect</span> with your loved Ones
                        </h1>
                        <p className="lead text-white-50 mb-4 fs-5">
                            High-quality video calls that bring people together. 
                            Whether it's family, friends, or colleagues, stay connected with Apna Video Call.
                        </p>
                        <div className="d-flex flex-column flex-sm-row gap-3 mb-5">
                            <Link to={"/auth"} style={{ textDecoration: 'none' }}>
                                <Button 
                                    size="lg" 
                                    className="px-5 py-3 fw-semibold"
                                    style={{ 
                                        background: '#FF9839', 
                                        border: 'none',
                                        borderRadius: '20px',
                                        boxShadow: '0 4px 15px rgba(255, 152, 57, 0.3)'
                                    }}
                                >
                                    Get Started
                                </Button>
                            </Link>
                            <Button 
                                variant="outline-light"
                                size="lg"
                                className="px-5 py-3"
                                onClick={() => router("/aljk23")}
                            >
                                Join as Guest
                            </Button>
                        </div>
                        <Row className="g-4 mt-4">
                            <Col xs={6} sm={4}>
                                <div className="text-white">
                                    <div className="fs-2 mb-2">🎥</div>
                                    <div className="small text-white-50">HD Quality</div>
                                </div>
                            </Col>
                            <Col xs={6} sm={4}>
                                <div className="text-white">
                                    <div className="fs-2 mb-2">🔒</div>
                                    <div className="small text-white-50">Secure</div>
                                </div>
                            </Col>
                            <Col xs={6} sm={4}>
                                <div className="text-white">
                                    <div className="fs-2 mb-2">⚡</div>
                                    <div className="small text-white-50">Fast</div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={6} className="d-flex justify-content-center align-items-center">
                        <div className="position-relative">
                            <div style={{
                                width: '400px',
                                height: '600px',
                                background: 'linear-gradient(135deg, rgba(108, 140, 255, 0.2), rgba(255, 152, 57, 0.2))',
                                borderRadius: '30px',
                                border: '2px solid rgba(255, 255, 255, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <Logo size={150} />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
