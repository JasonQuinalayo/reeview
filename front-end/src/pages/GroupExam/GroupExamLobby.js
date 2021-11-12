import React, {
  useEffect, useMemo, useState, useRef,
} from 'react';
import {
  Button, Container, Divider, Grid, Loader, Segment, Header, Form, TextArea,
} from 'semantic-ui-react';
import { v4 as uuidv4 } from 'uuid';
import ExamQuestionItem from '../../components/ExamQuestionItem';
import { useStateValue } from '../../state';
import Results from './Results';

const CurrentParticipants = ({ socket }) => {
  const [participants, setParticipants] = useState([]);
  useEffect(() => {
    socket.emit('get-participants');
    socket.on('participants', (newParticipants) => setParticipants(newParticipants));
    return () => {
      socket.off('participants');
    };
  }, [socket]);
  return (
    <Container className="overflow-y-scroll fixed-height-500px">
      <Header>In Lobby</Header>
      {participants.map((participant) => (
        <div key={participant.id}>
          {participant.name}
        </div>
      ))}
    </Container>
  );
};

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

  const handleSend = (e) => {
    e.preventDefault();
    if (!typedMessage) return;
    socket.emit('new-message', typedMessage);
    setTypedMessage('');
  };

  return (
    <div className="chat-box overflow-y-scroll fixed-height-500px" ref={messageBoxRef}>
      <Form onSubmit={handleSend}>
        <Grid className="chat-box-grid">
          <Grid.Column width={13} className="one-px-padding-left-right">
            <TextArea
              value={typedMessage}
              rows={2}
              onChange={(e) => setTypedMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.keyCode === 13 && e.shiftKey === false) {
                  handleSend(e);
                }
              }}
            />
          </Grid.Column>
          <Grid.Column width={3} stretched className="one-px-padding-left-right">
            <Button fluid size="medium" type="submit">Send</Button>
          </Grid.Column>
        </Grid>
      </Form>
      {messages.map((message) => (
        <div key={message.id} className="chat-box-message">
          <strong>{message.sender}</strong>
          :
          {' '}
          {message.content}
        </div>
      ))}
    </div>
  );
};

const GroupExamLobby = ({ socket, create }) => {
  const [{ questions }] = useStateValue();
  const { approved: approvedQuestions } = questions;
  const singleObjectQuestions = useMemo(() => ({
    ...approvedQuestions.ee, ...approvedQuestions.esas, ...approvedQuestions.math,
  }), [approvedQuestions]);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentNumber, setCurrentNumber] = useState(-1);
  const [calculatingResults, setCalculatingResults] = useState(false);
  const [examQuestions, setExamQuestions] = useState(null);
  const [results, setResults] = useState(null);
  useEffect(() => {
    if (!socket) return () => {};
    socket.on('new-question', (questionId, number) => {
      socket.emit('answer', currentAnswer, currentNumber);
      setCurrentQuestionId(questionId);
      setCurrentAnswer('');
      setCurrentNumber(number);
    });
    socket.on('finishing', () => {
      socket.emit('answer', currentAnswer, currentNumber);
      setCalculatingResults(true);
    });
    socket.on('results', ({ examResults, examQuestions: examQuestions_ }) => {
      setResults(examResults);
      setExamQuestions(examQuestions_);
      setCalculatingResults(false);
      setCurrentQuestionId(null);
    });
    socket.emit('get-results');
    return () => {
      socket.off('new-question');
      socket.off('results');
      socket.off('finishing');
    };
  }, [socket, currentAnswer, currentNumber]);
  return (
    <Container>
      <Loader active={calculatingResults} />
      {currentQuestionId
        ? (
          <Segment size="big">
            <ExamQuestionItem
              question={singleObjectQuestions[currentQuestionId]}
              answerState={currentAnswer}
              updateFunction={(value) => setCurrentAnswer(value)}
            />
          </Segment>
        )
        : (
          <div>
            {create && !results
            && (
              <Button type="button" fluid onClick={() => { if (!socket) return; socket.emit('start'); }}>Start</Button>
            )}
            {results && examQuestions
            && (
              <Results results={results} examQuestions={examQuestions} />
            )}
            <Divider />
            <Grid columns={2}>
              <Grid.Column stretched>
                <Segment>
                  <CurrentParticipants socket={socket} />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment>
                  <ChatBox socket={socket} />
                </Segment>
              </Grid.Column>
            </Grid>
          </div>
        )}
    </Container>
  );
};

export default GroupExamLobby;
