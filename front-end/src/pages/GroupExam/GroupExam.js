import React, { useEffect, useState } from 'react';
import {
  Button, Container, Divider, Segment, Confirm, Modal, Input,
} from 'semantic-ui-react';
import { io } from 'socket.io-client';
import GroupExamLobby from './GroupExamLobby';
import { useStateValue } from '../../state';
import { questionsService } from '../../services';
import ExamQuestionsOptions from '../../components/ExamQuestionsOptions/ExamQuestionsOptions';
import { fetchQuestions } from '../../utils';

const CreateLobbyModal = ({ onSubmit, modalOpen, onClose }) => {
  const [numOfQuestions, setNumOfQuestions] = useState({ ee: 0, esas: 0, math: 0 });
  const [timeInterval, setTimeInterval] = useState(5);
  const handleTimeIntervalInput = (e) => {
    let val = e.target.value;
    if (val < 5) val = 5;
    else if (val > 30) val = 30;
    setTimeInterval(val);
  };

  return (
    <Modal open={modalOpen} onClose={onClose} closeIcon>
      <Modal.Header>Create Lobby</Modal.Header>
      <Modal.Content>
        <ExamQuestionsOptions
          numOfQuestions={numOfQuestions}
          setNumOfQuestions={setNumOfQuestions}
        />
        <Input
          label="Time interval between questions. (min: 5s, max : 30s)"
          value={timeInterval}
          onChange={handleTimeIntervalInput}
        />
        <Divider hidden />
        <Button type="button" fluid onClick={() => onSubmit(numOfQuestions, timeInterval)}>Create</Button>
      </Modal.Content>
    </Modal>
  );
};

const Lobbies = ({ socket }) => {
  const [lobbies, setLobbies] = useState([]);
  useEffect(() => {
    if (!socket) return () => {};
    socket.emit('get-lobbies');
    socket.on('lobbies', (newLobbies) => setLobbies(newLobbies));
    return () => {
      socket.off('lobbies');
    };
  }, [socket]);

  return (
    <Container>
      Currently hosted:
      {lobbies.map((lobby) => (
        <div key={lobby.id}>
          {lobby.host}
          <Button
            type="button"
            onClick={() => {
              if (!socket) return;
              socket.emit('join-lobby', lobby.id);
            }}
          >
            Join
          </Button>
        </div>
      ))}
    </Container>
  );
};

const GroupExam = () => {
  const [, dispatch] = useStateValue();
  const [socket, setSocket] = useState(null);
  const [create, setCreate] = useState(false);
  const [lobbyId, setLobbyId] = useState('');
  const [leave, setLeave] = useState(false);

  useEffect(() => {
    let newSocket;
    if (process.env.NODE_ENV === 'development') {
      newSocket = io('http://localhost:3000', { withCredentials: true });
    } else {
      newSocket = io();
    }
    newSocket.emit('get-lobby');
    newSocket.on('lobby', (lobby) => {
      if (!lobby) return;
      const { id, host } = lobby;
      setCreate(host);
      setLobbyId(id);
      newSocket.emit('reconnect');
    });
    newSocket.on('join-lobby', async (id) => {
      setLobbyId(id);
      await fetchQuestions(dispatch, questionsService);
    });
    newSocket.on('leave-lobby', async () => {
      setCreate(false);
      setLobbyId('');
    });
    setSocket(newSocket);
    return () => {
      newSocket.off('join-lobby');
      newSocket.off('lobby');
      newSocket.off('leave-lobby');
      newSocket.close();
    };
  }, [dispatch]);

  const onCreate = (numOfQuestions, timeInterval) => {
    if (!socket) return;
    socket.emit('create-lobby', numOfQuestions, timeInterval);
  };

  return (
    <Container>
      {lobbyId === ''
        ? (
          <>
            <Segment>
              <Lobbies socket={socket} />
            </Segment>
            <Button type="button" onClick={() => setCreate((p) => !p)}>
              Create Lobby
            </Button>
            <CreateLobbyModal
              onSubmit={onCreate}
              modalOpen={create}
              onClose={() => setCreate((p) => !p)}
            />
          </>
        )
        : (
          <Container>
            <GroupExamLobby socket={socket} create={create} />
            <Divider />
            <Button
              type="button"
              onClick={() => setLeave(true)}
              floated="right"
            >
              Leave lobby
            </Button>
            <Divider hidden />
            <Confirm
              open={leave}
              onCancel={() => setLeave(false)}
              onConfirm={() => {
                if (!socket) return;
                socket.emit('leave-lobby');
                setLeave(false);
              }}
            />
          </Container>
        )}
    </Container>
  );
};

export default GroupExam;
