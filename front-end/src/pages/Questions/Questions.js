import React, { useMemo } from 'react';
import {
  Button,
  Container, Grid, Segment, Tab,
} from 'semantic-ui-react';
import { useStateValue } from '../../state';
import { questionObjectToArray } from '../../utils';
import QuestionItem from '../../components/QuestionItem';

const QuestionsTab = ({ questions }) => (
  <Container className="padded-top">
    <Grid columns={2}>
      <Grid.Column>
        {questions.slice(0, Math.floor(questions.length / 2))
          .map((question) => (
            <Segment key={question.id}>
              <QuestionItem question={question} />
            </Segment>
          ))}
      </Grid.Column>
      <Grid.Column>
        {questions.slice(Math.floor(questions.length / 2))
          .map((question) => (
            <Segment key={question.id}>
              <QuestionItem question={question} />
            </Segment>
          ))}
      </Grid.Column>
    </Grid>
  </Container>
);

const Questions = () => {
  const [{ questions }] = useStateValue();
  const { approved: approvedQuestions, pending: pendingQuestions } = questions;
  const approvedQuestionsArray = useMemo(() => questionObjectToArray(approvedQuestions.ee).concat(
    questionObjectToArray(approvedQuestions.esas),
    questionObjectToArray(approvedQuestions.math),
  ), [approvedQuestions]);
  const panes = useMemo(() => ([
    { menuItem: 'Approved', render: () => <QuestionsTab questions={approvedQuestionsArray} /> },
    { menuItem: 'Pending', render: () => <QuestionsTab questions={pendingQuestions} /> },
  ]), [pendingQuestions, approvedQuestionsArray]);
  return (
    <Container>
      <Button floated="right" type="button">Add Question</Button>
      <Tab panes={panes} />
    </Container>
  );
};

export default Questions;
