import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import { IconButton, Container, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Logo from '../components/Logo';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([])
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch {
                toast.error('Failed to load meeting history');
            }
        }
        fetchHistory();
    }, [getHistoryOfUser])

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${day}/${month}/${year} at ${hours}:${minutes}`
    }

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        toast.success('Meeting code copied!');
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-3">
                    <Tooltip title="Home">
                        <IconButton 
                            onClick={() => routeTo("/home")}
                            sx={{ color: 'var(--color-text)' }}
                        >
                            <HomeIcon />
                        </IconButton>
                    </Tooltip>
                    <div className="d-flex align-items-center gap-2">
                        <Logo size={32} />
                        <Typography variant="h4" className="fw-bold text-white">
                            Meeting History
                        </Typography>
                    </div>
                </div>
            </div>

            {meetings.length !== 0 ? (
                <Row className="g-3">
                    {meetings.map((e, i) => (
                        <Col xs={12} sm={6} lg={4} key={i}>
                            <Card 
                                variant="outlined" 
                                sx={{ 
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-elev-2)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: 'var(--color-primary)',
                                        boxShadow: 'var(--shadow-md)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                <CardContent>
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary">
                                            Meeting Code
                                        </Typography>
                                        <Tooltip title="Copy code">
                                            <IconButton 
                                                size="small"
                                                onClick={() => copyToClipboard(e.meetingCode)}
                                                sx={{ color: 'var(--color-text-muted)' }}
                                            >
                                                <ContentCopyIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                    <Typography 
                                        sx={{ 
                                            fontSize: 18, 
                                            fontWeight: 'bold',
                                            mb: 2,
                                            fontFamily: 'monospace',
                                            color: 'var(--color-primary)'
                                        }}
                                    >
                                        {e.meetingCode}
                                    </Typography>
                                    <Typography sx={{ mb: 2, fontSize: 14 }} color="text.secondary">
                                        📅 {formatDate(e.date)}
                                    </Typography>
                                    <Button 
                                        fullWidth
                                        variant="contained"
                                        startIcon={<VideoCallIcon />}
                                        onClick={() => routeTo(`/${e.meetingCode}`)}
                                        sx={{ 
                                            bgcolor: 'var(--color-primary)',
                                            '&:hover': { bgcolor: 'var(--color-primary-600)' }
                                        }}
                                    >
                                        Join Again
                                    </Button>
                                </CardContent>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center py-5">
                    <Logo size={80} />
                    <Typography className="text-white-50 mt-4" variant="h6">
                        No meeting history yet
                    </Typography>
                    <Typography className="text-white-50 mt-2" variant="body2">
                        Join or create a meeting to get started!
                    </Typography>
                    <Button 
                        variant="contained"
                        startIcon={<VideoCallIcon />}
                        onClick={() => routeTo("/home")}
                        sx={{ 
                            mt: 3,
                            bgcolor: 'var(--color-primary)',
                            '&:hover': { bgcolor: 'var(--color-primary-600)' }
                        }}
                    >
                        Go to Home
                    </Button>
                </div>
            )}
        </Container>
    )
}
