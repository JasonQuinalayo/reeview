import React, { useEffect, useState } from 'react';
import { Container, Grid } from 'semantic-ui-react';

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
    <Container>
      <Grid columns={5}>
        {participants.map((participant) => (
          <Grid.Column>
            {participant}
          </Grid.Column>
        ))}
      </Grid>
    </Container>
  );
};

export default CurrentParticipants;
