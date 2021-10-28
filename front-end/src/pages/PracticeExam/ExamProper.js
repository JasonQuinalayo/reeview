import React, { useEffect, useState } from 'react';
import sampleSize from 'lodash.samplesize';
import {
  Button, Container, Label, Segment,
} from 'semantic-ui-react';
import { useStateValue } from '../../state';
import ExamQuestionCard from './ExamQuestionCard';

const ExamProper = ({ numOfQuestions }) => {
  const [{ questions }] = useStateValue();
  const [submitted, setSubmitted] = useState(false);
  const [sampleQuestions] = useState({
    ee: sampleSize(questions.ee, numOfQuestions.ee),
    esas: sampleSize(questions.esas, numOfQuestions.esas),
    math: sampleSize(questions.math, numOfQuestions.math),
  });
  const [answers, setAnswers] = useState({ ee: {}, esas: {}, math: {} });
  useEffect(() => {
    if (!sampleQuestions) return;
    const newAnswers = { ee: {}, esas: {}, math: {} };
    sampleQuestions.ee.forEach((question) => { newAnswers.ee[question.id] = { user: '', correct: question.answer }; });
    sampleQuestions.esas.forEach((question) => { newAnswers.esas[question.id] = { user: '', correct: question.answer }; });
    sampleQuestions.math.forEach((question) => { newAnswers.math[question.id] = { user: '', correct: question.answer }; });
    setAnswers(newAnswers);
  }, [sampleQuestions]);

  /*

    SPLIT INTO PAGES!!

  */
  return (
    <Container>
      {Object.keys(sampleQuestions).map((category) => (
        sampleQuestions[category].map((question) => (
          <Segment key={question.id}>
            <ExamQuestionCard question={question} answers={answers} setAnswers={setAnswers} />
            {submitted && <Label>{question.answer}</Label>}
          </Segment>
        ))
      ))}
      <Button type="button" onClick={() => setSubmitted(true)}>Submit</Button>
    </Container>
  );
};

export default ExamProper;
