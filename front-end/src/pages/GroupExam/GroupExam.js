import React, { useEffect, useState } from 'react';
import { Button, Container, Segment } from 'semantic-ui-react';
import { io } from 'socket.io-client';
import CreateLobbyModal from './CreateLobbyModal';
import GroupExamLobby from './GroupExamLobby';

const GroupExam = () => {
  const [socket, setSocket] = useState(null);
  const [lobbies, setLobbies] = useState([]);
  const [create, setCreate] = useState(false);
  const [lobbyId, setLobbyId] = useState('');

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    newSocket.emit('get-lobbies');
    newSocket.on('lobbies', (lobbiesKeys) => { setLobbies(lobbiesKeys); });
    newSocket.on('join-lobby', (id) => {
      setLobbyId(id);
    });
    setSocket(newSocket);
    return () => {
      newSocket.off('lobbies');
      newSocket.off('join-lobby');
      newSocket.close();
    };
  }, []);

  return (
    <Container>
      {lobbyId === ''
        ? (
          <>
            <Segment>
              Currently hosted:
              {lobbies.map((lobby) => (
                <Container>
                  {lobby}
                  <Button
                    type="button"
                    onClick={() => {
                      if (!socket) return;
                      socket.emit('join-lobby', lobby);
                    }}
                  >
                    Join
                  </Button>
                </Container>
              ))}
            </Segment>
            <Button type="button" onClick={() => setCreate((p) => !p)}>
              Create Lobby
            </Button>
            <CreateLobbyModal
              socket={socket}
              modalOpen={create}
              onClose={() => setCreate((p) => !p)}
            />
          </>
        )
        : <GroupExamLobby socket={socket} />}
    </Container>
  );
};

export default GroupExam;
