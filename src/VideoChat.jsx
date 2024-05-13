import React, { useRef, useEffect } from 'react';
import './VideoChat.css';
import io from 'socket.io-client';

const VideoChat = () => {
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const socket = useRef(null);
    const peerConnection = useRef(null);
    const senderId = useRef(null);

    useEffect(() => {
        // Initialize socket connection to signaling server
        socket.current = io('http://localhost:3000');

        // Clean up socket connection when component unmounts
        return () => {
            socket.current.disconnect();
        };
    }, []);

    // Function to send offer message
    const sendOffer = (recipientId, offer) => {
        socket.current.emit('offer', { recipientId, offer });
    };

    // Handle incoming offer message
    useEffect(() => {
        if (!socket.current) return;

        socket.current.on('offer', async (data) => {
            const { senderId: offerSenderId, offer } = data;
            senderId.current = offerSenderId;
            try {
                // Create peer connection if not already exists
                if (!peerConnection.current) {
                    peerConnection.current = new RTCPeerConnection();
                    peerConnection.current.ontrack = (event) => {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    };
                    // Add local stream to peer connection
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

                    // Handle ICE candidate events
                    peerConnection.current.onicecandidate = (event) => {
                        if (event.candidate) {
                            // Send ICE candidate to the offer sender
                            socket.current.emit('ice-candidate', {
                                recipientId: senderId.current,
                                candidate: event.candidate
                            });
                        }
                    };
                }

                // Set remote description
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));

                // Create answer
                const answer = await peerConnection.current.createAnswer();
                await peerConnection.current.setLocalDescription(answer);

                // Send answer to the sender
                socket.current.emit('answer', { recipientId: senderId.current, answer });
            } catch (error) {
                console.error('Error handling offer:', error);
            }
        });

        // Cleanup function
        return () => {
            socket.current.off('offer');
        };
    }, []);

    // Handle incoming answer message
    useEffect(() => {
        if (!socket.current || !peerConnection.current) return;

        socket.current.on('answer', async (data) => {
            const { answer } = data;
            try {
                // Set remote description
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (error) {
                console.error('Error handling answer:', error);
            }
        });

        // Cleanup function
        return () => {
            socket.current.off('answer');
        };
    }, []);

    return (
        <div className="video-chat-container">
            <video ref={localVideoRef} autoPlay muted className="local-video"></video>
            <video ref={remoteVideoRef} autoPlay className="remote-video"></video>
        </div>
    );
};

export default VideoChat;
