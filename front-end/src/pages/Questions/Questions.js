import React from 'react';
import { Container, Grid, Segment } from 'semantic-ui-react';
import { useStateValue } from '../../state';
import Card from './Card';

const Questions = () => {
  const [{ questions }] = useStateValue();
  const singleQuestionsArray = questions.ee.concat(questions.esas.concat(questions.math));
  return (
    <Container>
      <Grid columns={2}>
        <Grid.Column>
          {singleQuestionsArray.slice(0, Math.floor(singleQuestionsArray.length / 2))
            .map((question) => (
              <Segment key={question.id}>
                <Card question={question} />
              </Segment>
            ))}
        </Grid.Column>
        <Grid.Column>
          {singleQuestionsArray.slice(Math.floor(singleQuestionsArray.length / 2))
            .map((question) => (
              <Segment key={question.id}>
                <Card question={question} />
              </Segment>
            ))}
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default Questions;
