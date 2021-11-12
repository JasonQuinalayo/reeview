import React from 'react';
import { Container, Grid, Label } from 'semantic-ui-react';

const Card = ({ question }) => (
  <Container>
    <div className="pre-wrap-whitespace">
      {question.question}
    </div>
    {question.maximumLengthChoice > 25
      ? (
        Object.keys(question.choices).map((choice) => (
          <div key={choice}>
            {`${choice.toUpperCase()}. ${question.choices[choice]}`}
          </div>
        ))
      )
      : (
        <Grid columns={2}>
          <Grid.Column>
            <div>
              {`A. ${question.choices.a}`}
            </div>
            <div>
              {`B. ${question.choices.b}`}
            </div>
          </Grid.Column>
          <Grid.Column>
            <div>
              {`C. ${question.choices.c}`}
            </div>
            <div>
              {`D. ${question.choices.d}`}
            </div>
          </Grid.Column>
        </Grid>
      )}
    <Label>
      {`answer: ${question.answer.toUpperCase()}`}
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

export default Card;
