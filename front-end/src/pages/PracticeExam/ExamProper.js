import React, { useState } from 'react';
import sampleSize from 'lodash.samplesize';
import shuffle from 'lodash.shuffle';
import {
  Button, Container, Grid, Segment,
} from 'semantic-ui-react';
import { useStateValue } from '../../state';
import ExamQuestionCard from '../../components/ExamQuestionCard';
import Results from './Results';

const ExamProper = ({ numOfQuestions }) => {
  const [{ questions }] = useStateValue();
  const [submitted, setSubmitted] = useState(false);
  const [examItems, setExamItems] = useState(
    shuffle(
      sampleSize(questions.ee, numOfQuestions.ee).concat(
        sampleSize(questions.esas, numOfQuestions.esas),
        sampleSize(questions.math, numOfQuestions.math),
      ).map((question) => ({ question, answer: { user: '', correct: question.answer } })),
    ),
  );
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [currentPageItems, setCurrentPageItems] = useState(
    examItems.slice(currentPageNumber * 10, currentPageNumber * 10 + 10),
  );

  const updateExam = () => {
    setExamItems((prevItems) => (
      prevItems.slice(0, 10 * currentPageNumber)
        .concat(currentPageItems.slice())
        .concat(prevItems.slice(10 * currentPageNumber + 10))
    ));
  };

  const handleNextPage = () => {
    updateExam();
    setCurrentPageItems(examItems
      .slice((currentPageNumber + 1) * 10, (currentPageNumber + 2) * 10));
    setCurrentPageNumber((p) => p + 1);
  };

  const handlePrevPage = () => {
    updateExam();
    setCurrentPageItems(examItems
      .slice((currentPageNumber - 1) * 10, (currentPageNumber) * 10));
    setCurrentPageNumber((p) => p - 1);
  };

  return (
    <Container>
      {!submitted
        ? (
          <Container>
            <Grid columns={3}>
              <Grid.Column width={2} verticalAlign="middle">
                {currentPageNumber > 0
                  && <Button type="button" onClick={handlePrevPage}>Previous</Button>}
              </Grid.Column>
              <Grid.Column width={12}>
                {currentPageItems.map((item, i) => (
                  <Segment key={item.question.id}>
                    <ExamQuestionCard
                      question={item.question}
                      answerState={item.answer.user}
                      updateFunction={(e, { value }) => {
                        setCurrentPageItems((prevItems) => prevItems.slice(0, i)
                          .concat({ ...item, answer: { ...item.answer, user: value } })
                          .concat(prevItems.slice(i + 1)));
                      }}
                    />
                  </Segment>
                ))}
                {currentPageNumber === Math.floor(examItems.length / 10)
                  && <Button type="button" fluid onClick={() => { setSubmitted(true); updateExam(); }}>Submit</Button>}
              </Grid.Column>
              <Grid.Column width={2} verticalAlign="middle">
                {currentPageNumber < Math.floor(examItems.length / 10)
                  && <Button type="button" onClick={handleNextPage}>Next</Button>}
              </Grid.Column>
            </Grid>
          </Container>
        )
        : <Results examItems={examItems} />}
    </Container>
  );
};

export default ExamProper;
