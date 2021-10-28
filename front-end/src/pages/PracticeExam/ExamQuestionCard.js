import React from 'react';
import { Container, Grid, Radio } from 'semantic-ui-react';

const ExamQuestionCard = ({ question, answers, setAnswers }) => {
  const handleCheck = (e, { value }) => setAnswers((prev) => (
    {
      ...prev,
      [question.category]: {
        ...answers[question.category],
        [question.id]: { ...answers[question.category][question.id], user: value },
      },
    }));
  return (
    <Container>
      {question.question}
      <Grid columns={2}>
        <Grid.Column>
          <Container>
            <Radio
              label={question.choices.a}
              name={`${question.id}-radioGroup`}
              value="a"
              checked={answers[question.category][question.id]?.user === 'a'}
              onChange={handleCheck}
            />
          </Container>
          <Container>
            <Radio
              name={`${question.id}-radioGroup`}
              value="b"
              checked={answers[question.category][question.id]?.user === 'b'}
              onChange={handleCheck}
              label={question.choices.b}
            />
          </Container>
        </Grid.Column>
        <Grid.Column>
          <Container>
            <Radio
              name={`${question.id}-radioGroup`}
              value="c"
              checked={answers[question.category][question.id]?.user === 'c'}
              onChange={handleCheck}
              label={question.choices.c}
            />
          </Container>
          <Container>
            <Radio
              name={`${question.id}-radioGroup`}
              value="d"
              checked={answers[question.category][question.id]?.user === 'd'}
              onChange={handleCheck}
              label={question.choices.d}
            />
          </Container>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default ExamQuestionCard;
