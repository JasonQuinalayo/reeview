import React, { useEffect, useMemo, useState } from 'react';
import {
  Button, Container, Loader, Segment,
} from 'semantic-ui-react';
import ExamQuestionCard from '../../components/ExamQuestionCard';
import { useStateValue } from '../../state';
import ChatBox from './ChatBox';
import CurrentParticipants from './CurrentParticipants';

const GroupExamLobby = ({ socket, create }) => {
  const [{ questions }] = useStateValue();
  const singleObjectQuestions = useMemo(() => ({
    ...questions.ee, ...questions.esas, ...questions.math,
  }), [questions]);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentNumber, setCurrentNumber] = useState(-1);
  const [calculatingResults, setCalculatingResults] = useState(false);
  const [examQuestions, setExamQuestions] = useState(null);
  const [results, setResults] = useState(null);
  useEffect(() => {
    if (!socket) return () => {};
    socket.on('new-question', (questionId, number) => {
      socket.emit('answer', currentAnswer, currentNumber);
      setCurrentQuestionId(questionId);
      setCurrentAnswer('');
      setCurrentNumber(number);
    });
    socket.on('finishing', () => {
      socket.emit('answer', currentAnswer, currentNumber);
      setCalculatingResults(true);
    });
    socket.on('results', (examResults, examQuestions_) => {
      setResults(examResults);
      setExamQuestions(examQuestions_);
      setCalculatingResults(false);
      setCurrentQuestionId(null);
    });
    return () => {
      socket.off('new-question');
      socket.off('results');
      socket.off('finishing');
    };
  }, [socket, currentAnswer, currentNumber]);
  return (
    <Container>
      <Loader active={calculatingResults} />
      {currentQuestionId
        ? (
          <Segment size="huge">
            <ExamQuestionCard
              question={singleObjectQuestions[currentQuestionId]}
              answerState={currentAnswer}
              updateFunction={(value) => setCurrentAnswer(value)}
            />
          </Segment>
        )
        : (
          <Container>
            {create && !results
            && <Button type="button" onClick={() => { if (!socket) return; socket.emit('start'); }}>Start</Button>}
            {results && examQuestions
            && (
            <Container>
              {examQuestions}
              {Object.keys(results).map((r) => (
                <Segment key={r}>
                  {`${r}: Score: ${results[r].score}`}
                </Segment>
              ))}
            </Container>
            )}
            <Segment>
              <CurrentParticipants socket={socket} />
            </Segment>
            <ChatBox socket={socket} />
          </Container>
        )}
    </Container>
  );
};

export default GroupExamLobby;
