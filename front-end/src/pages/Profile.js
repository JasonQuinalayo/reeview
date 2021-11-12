import React from 'react';
import { Container, Grid, Header } from 'semantic-ui-react';
import { useStateValue } from '../state';

const Profile = () => {
  const [{ user }] = useStateValue();
  return (
    <Container>
      <Grid columns={2}>
        <Grid.Column width={5}>
          hallo
        </Grid.Column>
        <Grid.Column width={11}>
          <Header>
            {user.name}
          </Header>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default Profile;
