import React from 'react';
import { Container, Radio } from 'semantic-ui-react';

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
      {Object.keys(question.choices).map((choice) => (
        <div
          key={question.id.concat(choice)}
        >
          <Radio
            label={`${choice.toUpperCase()}. ${question.choices[choice]}`}
            name={`${question.id}-radioGroup`}
            value={choice}
            checked={answerState === choice}
            onChange={handleChange}
          />
        </div>
      ))}
    </Container>
  );
};

export default ExamQuestionItem;
