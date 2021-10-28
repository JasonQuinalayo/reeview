import React, { useState } from 'react';
import { Container, Button, Divider } from 'semantic-ui-react';
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
            <Divider hidden />
            <Button type="button" onClick={() => { setStarted(true); }}>Start</Button>
          </>
        )
        : (
          <ExamProper numOfQuestions={numOfQuestions} />
        )}
    </Container>
  );
};

export default PracticeExam;
