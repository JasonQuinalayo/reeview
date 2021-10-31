import React from 'react';
import { Container, Grid, Label } from 'semantic-ui-react';

const Card = ({ question }) => {
  const questionStyle = { whiteSpace: 'pre-wrap' };
  return (
    <Container key={question.id}>
      <Container style={questionStyle}>
        {question.question}
      </Container>
      {question.maximumLengthChoice > 25
        ? (
          Object.keys(question.choices).map((choice) => (
            <Container key={choice}>
              {`${choice.toUpperCase()}. ${question.choices[choice]}`}
            </Container>
          ))
        )
        : (
          <Grid columns={2}>
            <Grid.Column>
              <Container>
                {`A. ${question.choices.a}`}
              </Container>
              <Container>
                {`B. ${question.choices.b}`}
              </Container>
            </Grid.Column>
            <Grid.Column>
              <Container>
                {`C. ${question.choices.c}`}
              </Container>
              <Container>
                {`D. ${question.choices.d}`}
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
    </Container>
  );
};

export default Card;
