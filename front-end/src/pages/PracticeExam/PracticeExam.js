import React, { useState } from 'react';
import {
  Container, Button, Divider, Segment,
} from 'semantic-ui-react';
import ExamQuestionsOptions from '../../components/ExamQuestionsOptions/ExamQuestionsOptions';
import ExamProper from './ExamProper';

const PracticeExam = () => {
  const [numOfQuestions, setNumOfQuestions] = useState({ ee: 0, esas: 0, math: 0 });
  const [started, setStarted] = useState(false);

  return (
    <Container>
      {!started
        ? (
          <>
            <ExamQuestionsOptions
              numOfQuestions={numOfQuestions}
              setNumOfQuestions={setNumOfQuestions}
            />
            <Segment>
              Total Questions:
              {' '}
              {numOfQuestions.ee + numOfQuestions.esas + numOfQuestions.math}
            </Segment>
            <Divider hidden />
            <Button type="button" fluid onClick={() => { setStarted(true); }}>Start</Button>
          </>
        )
        : (
          <ExamProper numOfQuestions={numOfQuestions} />
        )}
    </Container>
  );
};

export default PracticeExam;
