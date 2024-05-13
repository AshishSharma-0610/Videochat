import React, { useState, useEffect, useRef } from 'react';
import './TextChat.css';
import io from 'socket.io-client';

const TextChat = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const socket = useRef(null);

    useEffect(() => {
        // Initialize socket connection to signaling server
        socket.current = io('http://localhost:3000');

        // Clean up socket connection when component unmounts
        return () => {
            socket.current.disconnect();
        };
    }, []);

    // Function to send message
    const handleMessageSend = () => {
        // Send message to peer
        // Update messages state
        setMessages([...messages, inputValue]);
        setInputValue('');
    };

    return (
        <div className="text-chat-container">
            <div className="message-container">
                {messages.map((message, index) => (
                    <div key={index} className="message">{message}</div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="chat-input"
                    placeholder='type your message here...'
                />
                <button onClick={handleMessageSend} className="send-button">Send</button>
            </div>
        </div>
    );
};

export default TextChat;
