import React, { useMemo } from 'react';
import { Container, Segment } from 'semantic-ui-react';
import ExamQuestionCard from '../../components/ExamQuestionCard';

const Results = ({ examItems }) => {
  const score = useMemo(() => (
    examItems.reduce((acc, cur) => (cur.answer.user === cur.answer.correct ? acc + 1 : acc), 0)),
  [examItems]);
  return (
    <Container>
      <Segment size="big">
        {`Score: ${score} / ${examItems.length}`}
      </Segment>
      {examItems.map((item) => (
        <Segment key={item.question.id}>
          <ExamQuestionCard question={item.question} answerState={item.answer.user} />
          {`Correct answer: ${item.answer.correct.toUpperCase()}`}
        </Segment>
      ))}
    </Container>
  );
};

export default Results;
