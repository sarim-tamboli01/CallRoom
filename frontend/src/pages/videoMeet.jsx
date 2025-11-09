import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField, Tooltip, Chip } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/VideoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PeopleIcon from '@mui/icons-material/People';
import MeetingTimer from '../components/MeetingTimer';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import server from '../environment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {
    const { url: meetingCode } = useParams();
    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState([]);
    let [audio, setAudio] = useState();
    let [screen, setScreen] = useState();
    let [showModal, setModal] = useState(false);
    let [screenAvailable, setScreenAvailable] = useState();
    let [messages, setMessages] = useState([])
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");
    const [meetingStartTime] = useState(Date.now());
    const [participantCount, setParticipantCount] = useState(1);

    const videoRef = useRef([])
    let [videos, setVideos] = useState([])

    // TODO
    // if(isChrome() === false) {


    // }

    useEffect(() => {
        console.log("HELLO")
        getPermissions();

    })

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);

        }


    }, [video, audio])
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();

    }




    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }





    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }




    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
                setParticipantCount(prev => Math.max(1, prev - 1));
                toast.info('A participant left the meeting');
            })

            socketRef.current.on('user-joined', (id, clients) => {
                setParticipantCount(clients.length + 1);
                if (id !== socketIdRef.current) {
                    toast.success('A new participant joined');
                }
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        const newState = !video;
        try {
            const mediaStream = localVideoref.current && localVideoref.current.srcObject;
            if (mediaStream && mediaStream.getVideoTracks) {
                mediaStream.getVideoTracks().forEach(track => {
                    track.enabled = newState;
                })
            }
        } catch (e) { console.log(e) }
        setVideo(newState);
    }
    let handleAudio = () => {
        const newState = !audio;
        try {
            const mediaStream = localVideoref.current && localVideoref.current.srcObject;
            if (mediaStream && mediaStream.getAudioTracks) {
                mediaStream.getAudioTracks().forEach(track => {
                    track.enabled = newState;
                })
            }
        } catch (e) { console.log(e) }
        setAudio(newState);
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        if (window.confirm('Are you sure you want to leave the meeting?')) {
            try {
                if (socketRef.current) {
                    socketRef.current.disconnect();
                }
                let tracks = localVideoref.current?.srcObject?.getTracks()
                if (tracks) {
                    tracks.forEach(track => track.stop())
                }
            } catch (e) { 
                console.log(e);
            }
            window.location.href = "/home"
        }
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };



    let sendMessage = () => {
        if (!message.trim()) return;
        if (socketRef.current) {
            socketRef.current.emit('chat-message', message, username)
            setMessage("");
        }
    }

    
    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }


    return (
        <div>

            {askForUsername === true ?

                <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '20px' }}>
                    <div className="text-center mb-4" style={{ maxWidth: '400px', width: '100%' }}>
                        <h2 className="text-white mb-4">Enter into Lobby</h2>
                        <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
                            <TextField 
                                id="outlined-basic" 
                                label="Username" 
                                value={username} 
                                onChange={e => setUsername(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && username.trim() && connect()}
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{ sx: { color: 'var(--color-text-muted)' } }}
                                InputProps={{ sx: { color: '#fff', 
                                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-elev-2)' },
                                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-primary)' },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-primary)' }
                                } }}
                            />
                            <Button 
                                variant="contained" 
                                onClick={connect}
                                disabled={!username.trim()}
                                sx={{ 
                                    bgcolor: 'var(--color-primary)', 
                                    '&:hover': { bgcolor: 'var(--color-primary-600)' },
                                    minWidth: '120px',
                                    py: 1.5
                                }}
                            >
                                Connect
                            </Button>
                        </div>

                        <div className="d-flex justify-content-center">
                            <video 
                                ref={localVideoref} 
                                autoPlay 
                                muted
                                style={{
                                    width: '100%',
                                    maxWidth: '400px',
                                    borderRadius: '12px',
                                    background: '#000'
                                }}
                            ></video>
                        </div>
                    </div>
                </div> :


                <div className={styles.meetVideoContainer}>
                    <div className={styles.meetingHeader}>
                        <div className="d-flex align-items-center gap-3">
                            <MeetingTimer startTime={meetingStartTime} />
                            <Chip 
                                icon={<PeopleIcon />}
                                label={`${participantCount} ${participantCount === 1 ? 'Participant' : 'Participants'}`}
                                sx={{ 
                                    background: 'rgba(0,0,0,0.5)',
                                    color: '#fff',
                                    '& .MuiChip-icon': { color: '#fff' }
                                }}
                            />
                            <Chip 
                                label={meetingCode}
                                sx={{ 
                                    background: 'rgba(0,0,0,0.5)',
                                    color: '#fff',
                                    fontFamily: 'monospace'
                                }}
                            />
                            <Tooltip title="Copy meeting code">
                                <IconButton 
                                    onClick={() => {
                                        navigator.clipboard.writeText(meetingCode);
                                        toast.success('Meeting code copied!');
                                    }}
                                    sx={{ 
                                        color: '#fff',
                                        background: 'rgba(0,0,0,0.3)',
                                        '&:hover': { background: 'rgba(0,0,0,0.5)' }
                                    }}
                                    size="small"
                                >
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>

                    {showModal ? <div className={styles.chatRoom}>
                        <div className={styles.chatContainer}>
                            <h1 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#111' }}>Chat</h1>

                            <div className={styles.chattingDisplay}>
                                {messages.length !== 0 ? messages.map((item, index) => {
                                    return (
                                        <div style={{ marginBottom: "16px", padding: "8px", background: "#f5f5f5", borderRadius: "8px" }} key={index}>
                                            <p style={{ fontWeight: "bold", marginBottom: "4px", color: "#333" }}>{item.sender}</p>
                                            <p style={{ color: "#555", margin: 0 }}>{item.data}</p>
                                        </div>
                                    )
                                }) : <p style={{ color: "#999", textAlign: "center", marginTop: "20px" }}>No Messages Yet</p>}
                            </div>

                            <div className={styles.chattingArea}>
                                <TextField 
                                    value={message} 
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && message.trim() && sendMessage()}
                                    id="outlined-basic" 
                                    label="Enter Your message" 
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                />
                                <Button 
                                    variant='contained' 
                                    onClick={sendMessage}
                                    disabled={!message.trim()}
                                    sx={{ minWidth: '80px' }}
                                >
                                    Send
                                </Button>
                            </div>
                        </div>
                    </div> : <></>}


                    <div className={styles.buttonContainers}>
                        <IconButton 
                            onClick={handleVideo} 
                            sx={{
                                bgcolor: video ? 'var(--color-elev-2)' : '#d32f2f', 
                                color: '#fff', 
                                mx: { xs: 0.5, sm: 1 },
                                '&:hover': { bgcolor: video ? 'var(--color-surface)' : '#c62828' },
                                width: { xs: 48, sm: 56 },
                                height: { xs: 48, sm: 56 }
                            }}
                            aria-label={video ? "Turn off camera" : "Turn on camera"}
                        >
                            {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <IconButton 
                            onClick={handleEndCall}
                            sx={{ 
                                bgcolor: 'var(--color-danger)', 
                                color: '#fff', 
                                mx: { xs: 0.5, sm: 1 }, 
                                '&:hover': { opacity: .9 },
                                width: { xs: 48, sm: 56 },
                                height: { xs: 48, sm: 56 }
                            }}
                            aria-label="End call"
                        >
                            <CallEndIcon />
                        </IconButton>
                        <IconButton 
                            onClick={handleAudio}
                            sx={{
                                bgcolor: audio ? 'var(--color-elev-2)' : '#d32f2f', 
                                color: '#fff', 
                                mx: { xs: 0.5, sm: 1 },
                                '&:hover': { bgcolor: audio ? 'var(--color-surface)' : '#c62828' },
                                width: { xs: 48, sm: 56 },
                                height: { xs: 48, sm: 56 }
                            }}
                            aria-label={audio ? "Mute microphone" : "Unmute microphone"}
                        >
                            {audio === true ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>

                        {screenAvailable === true && (
                            <IconButton 
                                onClick={handleScreen}
                                sx={{
                                    bgcolor: screen ? 'var(--color-primary)' : 'var(--color-elev-2)', 
                                    color: '#fff', 
                                    mx: { xs: 0.5, sm: 1 },
                                    '&:hover': { bgcolor: screen ? 'var(--color-primary-600)' : 'var(--color-surface)' },
                                    width: { xs: 48, sm: 56 },
                                    height: { xs: 48, sm: 56 }
                                }}
                                aria-label={screen ? "Stop sharing" : "Share screen"}
                            >
                                {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton>
                        )}

                        <Badge badgeContent={newMessages} max={999} color='warning'>
                            <IconButton 
                                onClick={() => setModal(!showModal)}
                                sx={{
                                    bgcolor: showModal ? 'var(--color-primary)' : 'var(--color-elev-2)', 
                                    color: '#fff', 
                                    mx: { xs: 0.5, sm: 1 },
                                    '&:hover': { bgcolor: showModal ? 'var(--color-primary-600)' : 'var(--color-surface)' },
                                    width: { xs: 48, sm: 56 },
                                    height: { xs: 48, sm: 56 }
                                }}
                                aria-label="Toggle chat"
                            >
                                <ChatIcon />
                            </IconButton>
                        </Badge>
                    </div>


                    <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted></video>

                    <div className={styles.conferenceView}>
                        {videos.map((video) => (
                            <div key={video.socketId}>
                                <video

                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                >
                                </video>
                            </div>

                        ))}

                    </div>

                </div>

            }

        </div>
    )
}