import React from 'react';
import { Container, Grid, Radio } from 'semantic-ui-react';

const ExamQuestionItem = ({ question, answerState, updateFunction }) => {
  const handleChange = (e, { value }) => {
    if (!updateFunction) return;
    updateFunction(value);
  };
  return (
    <Container>
      <div className="pre-wrap-whitespace">
        {question.question}
      </div>
      <Grid columns={2}>
        <Grid.Column>
          <div>
            <Radio
              label={`A. ${question.choices.a}`}
              name={`${question.id}-radioGroup`}
              value="a"
              checked={answerState === 'a'}
              onChange={handleChange}
            />
          </div>
          <div>
            <Radio
              name={`${question.id}-radioGroup`}
              value="b"
              checked={answerState === 'b'}
              onChange={handleChange}
              label={`B. ${question.choices.b}`}
            />
          </div>
        </Grid.Column>
        <Grid.Column>
          <div>
            <Radio
              name={`${question.id}-radioGroup`}
              value="c"
              checked={answerState === 'c'}
              onChange={handleChange}
              label={`C. ${question.choices.c}`}
            />
          </div>
          <div>
            <Radio
              name={`${question.id}-radioGroup`}
              value="d"
              checked={answerState === 'd'}
              onChange={handleChange}
              label={`D. ${question.choices.d}`}
            />
          </div>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default ExamQuestionItem;
