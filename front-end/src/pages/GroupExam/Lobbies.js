import React, { useEffect, useState } from 'react';
import { Button, Container } from 'semantic-ui-react';

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
    </Container>
  );
};

export default Lobbies;
