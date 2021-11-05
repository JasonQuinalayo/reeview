import React, { useEffect, useState, useRef } from 'react';
import {
  Button, Container, Form, Grid, TextArea,
} from 'semantic-ui-react';
import { v4 as uuidv4 } from 'uuid';

const ChatBox = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState('');
  const messageBoxRef = useRef();
  useEffect(() => {
    socket.on('new-message', (message) => setMessages(
      (prevMessages) => {
        const newMessages = prevMessages.slice();
        newMessages.unshift({ ...message, id: uuidv4() });
        return newMessages;
      },
    ));
    return () => {
      socket.off('new-message');
    };
  }, [socket]);

  useEffect(() => {
    messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    socket.emit('new-message', typedMessage);
    setTypedMessage('');
  };

  return (
    <div className="chat-box" ref={messageBoxRef}>
      <Form>
        <Grid className="chat-box-grid">
          <Grid.Column width={13} className="zero-padding">
            <TextArea
              value={typedMessage}
              rows={2}
              onChange={(e) => setTypedMessage(e.target.value)}
            />
          </Grid.Column>
          <Grid.Column width={3} stretched className="zero-padding">
            <Button fluid size="huge" type="button" onClick={handleSend}>Send</Button>
          </Grid.Column>
        </Grid>
      </Form>
      {messages.map((message) => (
        <Container key={message.id}>
          <strong>{message.sender}</strong>
          :
          {' '}
          {message.content}
        </Container>
      ))}
    </div>
  );
};

export default ChatBox;
