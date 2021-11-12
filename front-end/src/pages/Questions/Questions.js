import React from 'react';
import { Container, Grid, Segment } from 'semantic-ui-react';
import { useStateValue } from '../../state';
import { questionObjectToArray } from '../../utils';
import QuestionItem from '../../components/QuestionItem';

const Questions = () => {
  const [{ questions }] = useStateValue();
  const { approved: approvedQuestions } = questions;
  const singleQuestionsArray = questionObjectToArray(approvedQuestions.ee).concat(
    questionObjectToArray(approvedQuestions.esas),
    questionObjectToArray(approvedQuestions.math),
  );
  return (
    <Container>
      <Grid columns={2}>
        <Grid.Column>
          {singleQuestionsArray.slice(0, Math.floor(singleQuestionsArray.length / 2))
            .map((question) => (
              <Segment key={question.id}>
                <QuestionItem question={question} />
              </Segment>
            ))}
        </Grid.Column>
        <Grid.Column>
          {singleQuestionsArray.slice(Math.floor(singleQuestionsArray.length / 2))
            .map((question) => (
              <Segment key={question.id}>
                <QuestionItem question={question} />
              </Segment>
            ))}
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default Questions;
