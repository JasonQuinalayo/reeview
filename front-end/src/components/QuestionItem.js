import React from 'react';
import {
  Button, Container, Divider, Label,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const QuestionCard = ({ question }) => (
  <>
    <div className="pre-wrap-whitespace">
      {question.question}
    </div>
    {Object.keys(question.choices).map((choice) => (
      <div key={choice}>
        {`${choice.toUpperCase()}. ${question.choices[choice]}`}
      </div>
    ))}
    <Label>
      {`answer: ${question.answer.toUpperCase()}`}
    </Label>
    <Label>
      {question.category}
    </Label>
    {question.year && (
      <Label>
        {question.year}
      </Label>
    )}
    {question.tags?.map((tag) => (
      <Label key={tag}>
        {tag}
      </Label>
    ))}
  </>
);

export const ApprovedQuestionCard = ({ question, onSuggestUpdate }) => (
  <Container>
    <QuestionCard question={question} />
    {onSuggestUpdate
    && (
      <>
        <Button size="mini" floated="right" onClick={onSuggestUpdate}>Suggest Update</Button>
        {question.suggestedUpdates?.length > 0
        && (
          <>
            <Divider />
            <span>Suggested Updates</span>
            <ul>
              {question.suggestedUpdates.map((v) => (
                <li key={v}><Link to={`/questions/${v}`}>{v}</Link></li>
              ))}
            </ul>
          </>
        )}
      </>
    )}
  </Container>
);

export const PendingQuestionCard = ({ question, onApprove }) => (
  <Container>
    <QuestionCard question={question} />
    {onApprove && <Button size="mini" floated="right" onClick={onApprove}>Approve</Button>}
    {question.updateTo
    && (
      <>
        <Divider />
        <span>Update To: </span>
        <Link to={`/questions/${question.updateTo}`}>{question.updateTo}</Link>
      </>
    )}
  </Container>
);
