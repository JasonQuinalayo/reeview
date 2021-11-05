import React, { useEffect, useState } from 'react';
import { Button, Container, Segment } from 'semantic-ui-react';
import { io } from 'socket.io-client';
import CreateLobbyModal from './CreateLobbyModal';
import GroupExamLobby from './GroupExamLobby';
import Lobbies from './Lobbies';
import { useStateValue, setQuestions } from '../../state';
import { questionsService } from '../../services';

const GroupExam = () => {
  const [, dispatch] = useStateValue();
  const [socket, setSocket] = useState(null);
  const [create, setCreate] = useState(false);
  const [lobbyId, setLobbyId] = useState('');

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    newSocket.on('join-lobby', async (id) => {
      setLobbyId(id);
      const questions = await questionsService.getQuestions();
      const categorizedQuestions = { ee: {}, esas: {}, math: {} };
      questions.forEach((question) => {
        categorizedQuestions[question.category][question.id] = question;
      });
      dispatch(setQuestions(categorizedQuestions));
    });
    setSocket(newSocket);
    return () => {
      newSocket.off('join-lobby');
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
        : <GroupExamLobby socket={socket} create={create} />}
    </Container>
  );
};

export default GroupExam;
