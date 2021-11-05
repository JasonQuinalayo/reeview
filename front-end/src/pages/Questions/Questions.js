import React from 'react';
import { Container, Grid, Segment } from 'semantic-ui-react';
import { useStateValue } from '../../state';
import { questionObjectToArray } from '../../utils';
import Card from './Card';

const Questions = () => {
  const [{ questions }] = useStateValue();
  const singleQuestionsArray = questionObjectToArray(questions.ee).concat(
    questionObjectToArray(questions.esas),
    questionObjectToArray(questions.math),
  );
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
