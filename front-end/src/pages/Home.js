import React, { useEffect, useState } from 'react';
import {
  Container, Segment, List, Header, Image,
} from 'semantic-ui-react';
import { userService } from '../services';
import photo from '../images/image1.jpeg';

const Home = () => {
  const [admins, setAdmins] = useState([]);
  useEffect(() => {
    const f = async () => {
      const newAdmins = await userService.getAdmins();
      setAdmins(newAdmins);
    };
    f();
  }, []);
  return (
    <Container>
      <Segment>
        <Header>Current admins:</Header>
        <List items={admins.map((admin) => admin.name)} />
      </Segment>
      <Image src={photo} size="big" centered />
    </Container>
  );
};

export default Home;
