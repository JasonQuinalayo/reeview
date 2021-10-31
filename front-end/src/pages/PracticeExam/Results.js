import React, { useMemo } from 'react';
import { Container, Icon, Segment } from 'semantic-ui-react';
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
          {item.answer.user === item.answer.correct
            ? <Icon name="check" color="green" /> : (
              <Container>
                <Icon name="x" color="red" />
                Correct answer:
                {' '}
                {item.answer.correct.toUpperCase()}
              </Container>
            )}
        </Segment>
      ))}
    </Container>
  );
};

export default Results;
