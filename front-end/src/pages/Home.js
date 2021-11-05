import React, { useEffect, useState } from 'react';
import { Container, Segment, Grid } from 'semantic-ui-react';
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
        <Grid columns={5}>
          {admins.map((admin) => (
            <Grid.Column key={admin.id}>
              {admin.name}
            </Grid.Column>
          ))}
        </Grid>
      </Segment>
      <Segment size="massive">
        Announcements:
      </Segment>
    </Container>
  );
};

export default Home;
