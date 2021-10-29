import React from 'react';
import { Container, Grid, Radio } from 'semantic-ui-react';

const ExamQuestionCard = ({ question, answerState, updateFunction }) => {
  const handleChange = (e, res) => {
    if (!updateFunction) return;
    updateFunction(e, res);
  };
  return (
    <Container>
      {question.question}
      <Grid columns={2}>
        <Grid.Column>
          <Container>
            <Radio
              label={`A. ${question.choices.a}`}
              name={`${question.id}-radioGroup`}
              value="a"
              checked={answerState === 'a'}
              onChange={handleChange}
            />
          </Container>
          <Container>
            <Radio
              name={`${question.id}-radioGroup`}
              value="b"
              checked={answerState === 'b'}
              onChange={handleChange}
              label={`B. ${question.choices.b}`}
            />
          </Container>
        </Grid.Column>
        <Grid.Column>
          <Container>
            <Radio
              name={`${question.id}-radioGroup`}
              value="c"
              checked={answerState === 'c'}
              onChange={handleChange}
              label={`C. ${question.choices.c}`}
            />
          </Container>
          <Container>
            <Radio
              name={`${question.id}-radioGroup`}
              value="d"
              checked={answerState === 'd'}
              onChange={handleChange}
              label={`D. ${question.choices.d}`}
            />
          </Container>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default ExamQuestionCard;
