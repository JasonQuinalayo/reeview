import React from 'react';
import { Container, Button, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Home = () => (
  <Container>
    <Link to="/practice-exam">
      <Button type="button">
        Take A Practice Exam
      </Button>
    </Link>
    <Segment>
      No currently hosted group exams. Try refreshing.
    </Segment>
    <Segment size="massive">
      Announcements:
    </Segment>
  </Container>
);

export default Home;
