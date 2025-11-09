import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Button, IconButton, TextField, Tooltip } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { AuthContext } from '../contexts/AuthContext';
import { Container, Navbar, Nav, Card, Row, Col } from 'react-bootstrap';
import { generateMeetingCode } from '../utils/generateMeetingCode';
import { toast } from 'react-toastify';
import Logo from '../components/Logo';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [newMeetingCode, setNewMeetingCode] = useState("");
    const { addToUserHistory } = useContext(AuthContext);

    const handleCreateMeeting = () => {
        const code = generateMeetingCode();
        setNewMeetingCode(code);
        toast.success('New meeting created! Share the code with participants.');
    };

    const handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) {
            toast.error('Please enter a meeting code');
            return;
        }
        try {
            await addToUserHistory(meetingCode);
            navigate(`/${meetingCode}`);
        } catch (error) {
            toast.error('Failed to join meeting');
        }
    };

    const handleJoinNewMeeting = async () => {
        if (!newMeetingCode) {
            handleCreateMeeting();
            return;
        }
        try {
            await addToUserHistory(newMeetingCode);
            navigate(`/${newMeetingCode}`);
        } catch (error) {
            toast.error('Failed to join meeting');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Meeting code copied to clipboard!');
    };

    return (
        <>
            <Navbar expand="lg" className="px-3 px-md-4" style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)' }}>
                <Container fluid>
                    <Navbar.Brand className="d-flex align-items-center gap-2">
                        <Logo size={32} />
                        <span className="fw-bold text-white">Apna Video Call</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto align-items-center gap-3">
                            <Tooltip title="Meeting History">
                                <IconButton 
                                    onClick={() => navigate("/history")}
                                    sx={{ color: 'var(--color-text)' }}
                                >
                                    <RestoreIcon />
                                </IconButton>
                            </Tooltip>
                            <span className="text-white-50 d-none d-md-inline">History</span>
                            <Button 
                                onClick={() => {
                                    localStorage.removeItem("token")
                                    navigate("/auth")
                                }}
                                variant="outlined"
                                sx={{ 
                                    color: 'var(--color-text)',
                                    borderColor: 'var(--color-elev-2)',
                                    '&:hover': { borderColor: 'var(--color-primary)' }
                                }}
                            >
                                Logout
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container fluid className="px-3 px-md-5 py-5" style={{ minHeight: 'calc(100vh - 80px)' }}>
                <Row className="g-4">
                    <Col lg={6} className="d-flex flex-column justify-content-center">
                        <div className="text-center text-lg-start mb-4">
                            <h1 className="display-4 fw-bold mb-3 text-white">
                                Connect Instantly
                            </h1>
                            <p className="lead text-white-50 mb-4">
                                Create or join video meetings with ease. High-quality video calls for everyone.
                            </p>
                        </div>

                        <Card className="mb-4" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-elev-2)' }}>
                            <Card.Body className="p-4">
                                <h5 className="text-white mb-3">
                                    <VideoCallIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Create New Meeting
                                </h5>
                                {newMeetingCode ? (
                                    <div>
                                        <div className="d-flex gap-2 mb-3">
                                            <TextField 
                                                value={newMeetingCode}
                                                label="Meeting Code"
                                                variant="outlined"
                                                fullWidth
                                                InputProps={{
                                                    readOnly: true,
                                                    sx: { 
                                                        color: '#fff',
                                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-elev-2)' }
                                                    }
                                                }}
                                                InputLabelProps={{ sx: { color: 'var(--color-text-muted)' } }}
                                            />
                                            <Tooltip title="Copy code">
                                                <IconButton 
                                                    onClick={() => copyToClipboard(newMeetingCode)}
                                                    sx={{ 
                                                        bgcolor: 'var(--color-primary)',
                                                        color: '#fff',
                                                        '&:hover': { bgcolor: 'var(--color-primary-600)' }
                                                    }}
                                                >
                                                    <ContentCopyIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                        <Button 
                                            onClick={handleJoinNewMeeting}
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            sx={{ 
                                                bgcolor: 'var(--color-primary)', 
                                                '&:hover': { bgcolor: 'var(--color-primary-600)' },
                                                py: 1.5
                                            }}
                                        >
                                            Start Meeting
                                        </Button>
                                    </div>
                                ) : (
                                    <Button 
                                        onClick={handleCreateMeeting}
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        sx={{ 
                                            bgcolor: 'var(--color-primary)', 
                                            '&:hover': { bgcolor: 'var(--color-primary-600)' },
                                            py: 1.5
                                        }}
                                    >
                                        Create Meeting
                                    </Button>
                                )}
                            </Card.Body>
                        </Card>

                        <Card style={{ background: 'var(--color-surface)', border: '1px solid var(--color-elev-2)' }}>
                            <Card.Body className="p-4">
                                <h5 className="text-white mb-3">Join Meeting</h5>
                                <div className="d-flex flex-column flex-sm-row gap-2">
                                    <TextField 
                                        onChange={e => setMeetingCode(e.target.value.toUpperCase())} 
                                        id="outlined-basic" 
                                        label="Enter Meeting Code" 
                                        variant="outlined" 
                                        value={meetingCode}
                                        onKeyPress={(e) => e.key === 'Enter' && handleJoinVideoCall()}
                                        InputLabelProps={{ sx: { color: 'var(--color-text-muted)' } }}
                                        InputProps={{ sx: { color: '#fff', 
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-elev-2)' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-primary)' },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-primary)' }
                                        } }}
                                        sx={{ flex: 1 }}
                                    />
                                    <Button 
                                        onClick={handleJoinVideoCall} 
                                        variant='contained'
                                        size="large"
                                        sx={{ 
                                            bgcolor: 'var(--color-accent)', 
                                            '&:hover': { bgcolor: '#e6892a' },
                                            py: 1.5,
                                            px: 4,
                                            minWidth: '120px'
                                        }}
                                    >
                                        Join
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={6} className="d-flex justify-content-center align-items-center">
                        <div className="text-center">
                            <div className="mb-4">
                                <Logo size={120} />
                            </div>
                            <h3 className="text-white mb-3">Features</h3>
                            <Row className="g-3 text-white-50">
                                <Col xs={6} sm={6}>
                                    <div className="p-3" style={{ background: 'var(--color-elev-2)', borderRadius: '12px' }}>
                                        <div className="fs-4 mb-2">🎥</div>
                                        <div className="small">HD Video</div>
                                    </div>
                                </Col>
                                <Col xs={6} sm={6}>
                                    <div className="p-3" style={{ background: 'var(--color-elev-2)', borderRadius: '12px' }}>
                                        <div className="fs-4 mb-2">💬</div>
                                        <div className="small">Live Chat</div>
                                    </div>
                                </Col>
                                <Col xs={6} sm={6}>
                                    <div className="p-3" style={{ background: 'var(--color-elev-2)', borderRadius: '12px' }}>
                                        <div className="fs-4 mb-2">🖥️</div>
                                        <div className="small">Screen Share</div>
                                    </div>
                                </Col>
                                <Col xs={6} sm={6}>
                                    <div className="p-3" style={{ background: 'var(--color-elev-2)', borderRadius: '12px' }}>
                                        <div className="fs-4 mb-2">🔒</div>
                                        <div className="small">Secure</div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default withAuth(HomeComponent)
