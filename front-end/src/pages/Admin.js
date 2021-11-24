import React, { useEffect, useState } from 'react';
import {
  Button, Confirm, Container, Grid, Header, Input, Segment,
} from 'semantic-ui-react';
import { userService, registerService } from '../services';

const Admin = () => {
  const [registrationLink, setRegistrationLink] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const f = async () => {
      try {
        const newUsers = await userService.getAllUsers();
        setUsers(newUsers);
      } catch (e) {
        setError(e.response.data.error);
      }
    };
    f();
  }, []);
  const createRegistrationLink = async () => {
    try {
      const newRegistrationLink = await registerService.createLink();
      setRegistrationLink(`http://localhost:3001/register/${newRegistrationLink}`);
    } catch (e) {
      setError(e.response.data.error);
    }
  };
  return (
    <Container>
      <Confirm
        content={error}
        open={!!error}
        onCancel={() => setError('')}
        onConfirm={() => setError('')}
      />
      <Segment>
        <Grid columns={2}>
          <Grid.Column width={4}>
            <Button type="button" fluid onClick={createRegistrationLink}>Create Registration Link</Button>
          </Grid.Column>
          <Grid.Column width={12}>
            <Input
              fluid
              action={{
                labelPosition: 'right',
                icon: 'copy',
                content: 'Copy',
                onClick: () => navigator.clipboard.writeText(registrationLink),
              }}
              value={registrationLink}
            />
          </Grid.Column>
        </Grid>
        <Header size="small">Links are only valid for 5 minutes!</Header>
      </Segment>
      <Segment>
        <Header>
          All users
        </Header>
        <Grid columns={5}>
          {users.map((user) => (
            <Grid.Column key={user.id}>
              <strong>{user.name}</strong>
              {' -- '}
              {user.isAdmin ? 'Admin'
                : <Button size="tiny">Promote</Button>}
            </Grid.Column>
          ))}
        </Grid>
      </Segment>
    </Container>
  );
};

export default Admin;
