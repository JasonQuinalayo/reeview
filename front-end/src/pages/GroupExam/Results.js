import React, { useMemo, useState } from 'react';
import {
  Container, Popup, Header, Icon, Segment, Transition, Button, Grid, Divider,
} from 'semantic-ui-react';
import { useStateValue } from '../../state';
import { ApprovedQuestionCard } from '../../components/QuestionItem';

const ResultItem = ({ singleObjectQuestions, result, examQuestions }) => {
  const [showItems, setShowItems] = useState(false);
  return (
    <Grid.Column>
      <Segment>
        <strong>{result.name}</strong>
        {' '}
        {result.score}
        {' '}
        <Button type="button" size="mini" onClick={() => setShowItems((p) => !p)}>{showItems ? 'Hide' : 'Show'}</Button>
        <Transition visible={showItems}>
          <div>
            {result.answers.map((answer, index) => {
              const question = singleObjectQuestions[examQuestions[index]];
              const correct = question.answer === answer;
              return (
                <Popup
                  key={question.id}
                  trigger={<Icon name={correct ? 'check' : 'x'} color={correct ? 'green' : 'red'} />}
                >
                  <div className="popup-content">
                    <Header size="small">{index + 1}</Header>
                    <ApprovedQuestionCard question={singleObjectQuestions[examQuestions[index]]} />
                    <Divider hidden />
                    {`${result.name}'s Answer: ${answer.toUpperCase()}`}
                  </div>
                </Popup>
              );
            })}
          </div>
        </Transition>
      </Segment>
    </Grid.Column>
  );
};

const Results = ({ results, examQuestions }) => {
  const [{ questions }] = useStateValue();
  const { approved: approvedQuestions } = questions;
  const singleObjectQuestions = useMemo(() => (
    { ...approvedQuestions.ee, ...approvedQuestions.esas, ...approvedQuestions.math }
  ), [approvedQuestions]);
  return (
    <Container>
      <Segment>
        <Header>
          Results. Total Number of Questions:
          {' '}
          {examQuestions.length}
        </Header>
        <Grid columns={3}>
          {Object.keys(results).map((id) => (
            <ResultItem
              key={id}
              singleObjectQuestions={singleObjectQuestions}
              result={results[id]}
              examQuestions={examQuestions}
            />
          ))}
        </Grid>
      </Segment>
    </Container>
  );
};

export default Results;
