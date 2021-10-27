import React from 'react';
import {
  Segment, Container, Grid, Label,
} from 'semantic-ui-react';
import { useStateValue } from '../state';

const Questions = () => {
  const [{ questions }] = useStateValue();
  const singleQuestionsArray = questions.ee.concat(questions.esas.concat(questions.math));
  const getQuestionComponent = (questionsArg) => (questionsArg.map((question) => (
    <Segment key={question.id}>
      {question.question}
      {question.maximumLengthChoice > 25
        ? (
          Object.keys(question.choices).map((choice) => (
            <Container key={choice}>
              {`${choice}. ${question.choices[choice]}`}
            </Container>
          ))
        )
        : (
          <Grid columns={2}>
            <Grid.Column>
              <Container>
                {`A. ${question.choices.A}`}
              </Container>
              <Container>
                {`B. ${question.choices.B}`}
              </Container>
            </Grid.Column>
            <Grid.Column>
              <Container>
                {`C. ${question.choices.C}`}
              </Container>
              <Container>
                {`D. ${question.choices.D}`}
              </Container>
            </Grid.Column>
          </Grid>
        )}
      <Label>
        {`answer: ${question.answer}`}
      </Label>
      <Label>
        {question.category}
      </Label>
      {question.year ? (
        <Label>
          {question.year}
        </Label>
      ) : null}
      {question.tags?.map((tag) => (
        <Label key={tag}>
          {tag}
        </Label>
      ))}
    </Segment>
  )));
  return (
    <Container>
      <Grid columns={2}>
        <Grid.Column>
          {getQuestionComponent(
            singleQuestionsArray.slice(0, Math.floor(singleQuestionsArray.length / 2)),
          )}
        </Grid.Column>
        <Grid.Column>
          {getQuestionComponent(
            singleQuestionsArray.slice(Math.floor(singleQuestionsArray.length / 2)),
          )}
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default Questions;
