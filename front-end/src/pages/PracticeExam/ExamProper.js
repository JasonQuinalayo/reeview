import React, { useState, useMemo } from 'react';
import sampleSize from 'lodash.samplesize';
import shuffle from 'lodash.shuffle';
import {
  Button, Container, Grid, Segment, Icon, Divider,
} from 'semantic-ui-react';
import { useStateValue } from '../../state';
import ExamQuestionItem from '../../components/ExamQuestionItem';
import { objectValuesToArray } from '../../utils';

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
          <ExamQuestionItem question={item.question} answerState={item.answer.user} />
          {item.answer.user === item.answer.correct
            ? <Icon name="check" color="green" /> : (
              <div>
                <Icon name="x" color="red" />
                Correct answer:
                {' '}
                {item.answer.correct.toUpperCase()}
              </div>
            )}
        </Segment>
      ))}
    </Container>
  );
};

const ExamProper = ({ numOfQuestions, finish }) => {
  const [{ questions }] = useStateValue();
  const { approved: approvedQuestions } = questions;
  const [submitted, setSubmitted] = useState(false);
  const [examItems, setExamItems] = useState(
    shuffle(
      sampleSize(objectValuesToArray(approvedQuestions.ee), numOfQuestions.ee).concat(
        sampleSize(objectValuesToArray(approvedQuestions.esas), numOfQuestions.esas),
        sampleSize(objectValuesToArray(approvedQuestions.math), numOfQuestions.math),
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

  const retry = () => {
    setSubmitted(false);
    setExamItems((items) => items.map((item) => ({ ...item, answer: { ...item.answer, user: '' } })));
    setCurrentPageNumber(0);
    setCurrentPageItems(examItems.slice(0, 10));
  };

  return (
    <Container>
      {!submitted
        ? (
          <div>
            <Grid columns={3}>
              <Grid.Column width={2} verticalAlign="middle">
                {currentPageNumber > 0
                  && <Button type="button" onClick={handlePrevPage}>Previous</Button>}
              </Grid.Column>
              <Grid.Column width={12}>
                {currentPageItems.map((item, i) => (
                  <Segment key={item.question.id}>
                    <ExamQuestionItem
                      question={item.question}
                      answerState={item.answer.user}
                      updateFunction={(value) => {
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
          </div>
        )
        : (
          <>
            <Results examItems={examItems} />
            <Divider />
            <Button type="button" onClick={finish}>Done</Button>
            <Button type="button" onClick={retry}>Retry</Button>
          </>
        )}
    </Container>
  );
};

export default ExamProper;
