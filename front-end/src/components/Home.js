import React from 'react';
import { Button, Segment } from 'semantic-ui-react';

const Home = () => (
  <div className="Home">
    <Button type="button">
      Take A Practice Exam
    </Button>
    <Segment>
      No currently hosted group exams. Try refreshing.
    </Segment>
    <Segment size="massive">
      Top 3 (Most Recent Group Exams)
    </Segment>
  </div>
);

export default Home;
