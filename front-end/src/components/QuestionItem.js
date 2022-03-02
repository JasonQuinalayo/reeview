import React from 'react';
import { Container, Label } from 'semantic-ui-react';

const Card = ({ question }) => (
  <Container>
    <div className="pre-wrap-whitespace">
      {question.question}
    </div>
    {Object.keys(question.choices).map((choice) => (
      <div key={choice}>
        {`${choice.toUpperCase()}. ${question.choices[choice]}`}
      </div>
    ))}
    <Label>
      {`answer: ${question.answer.toUpperCase()}`}
    </Label>
    <Label>
      {question.category}
    </Label>
    {question.year && (
      <Label>
        {question.year}
      </Label>
    )}
    {question.tags?.map((tag) => (
      <Label key={tag}>
        {tag}
      </Label>
    ))}
  </Container>
);

export default Card;
