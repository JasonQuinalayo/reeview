import React, { useMemo, useState } from 'react';
import {
  Container, Popup, Header, Icon, Segment, Transition, Button, Grid, Divider,
} from 'semantic-ui-react';
import { useStateValue } from '../../state';
import QuestionItem from '../../components/QuestionItem';

const ResultItem = ({ singleObjectQuestions, result, examQuestions }) => {
  const [showItems, setShowItems] = useState(false);
  return (
    <Grid.Column>
      <Segment>
        <Button type="button" size="mini" onClick={() => setShowItems((p) => !p)}>{showItems ? 'Hide' : 'Show'}</Button>
        {result.name}
        {' '}
        {result.score}
        <Transition visible={showItems}>
          <div>
            {result.answers.map((answer, index) => {
              const question = singleObjectQuestions[examQuestions[index]];
              const correct = question.answer === answer;
              return (
                <Popup
                  on="click"
                  key={question.id}
                  trigger={<Icon name={correct ? 'check' : 'x'} color={correct ? 'green' : 'red'} />}
                >
                  <div className="popup-content">
                    <Header size="small">{index + 1}</Header>
                    <QuestionItem question={singleObjectQuestions[examQuestions[index]]} />
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
        <Header>Results</Header>
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
