import React, { useEffect, useState } from 'react';
import {
  Container, Segment, List, Header,
} from 'semantic-ui-react';
import { adminService } from '../services';

const Home = () => {
  const [admins, setAdmins] = useState([]);
  useEffect(() => {
    const f = async () => {
      const newAdmins = await adminService.getAdmins();
      setAdmins(newAdmins);
    };
    f();
  }, []);
  return (
    <Container>
      <Segment>
        <Header>Current admins(char):</Header>
        <List items={admins.map((admin) => admin.name)} />
      </Segment>
      <Segment size="massive">
        Announcements:
      </Segment>
    </Container>
  );
};

export default Home;
