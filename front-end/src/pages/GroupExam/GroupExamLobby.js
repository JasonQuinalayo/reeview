import React, { useEffect, useState } from 'react';
import { Container, Segment } from 'semantic-ui-react';
import ExamQuestionCard from '../../components/ExamQuestionCard';
import ChatBox from './ChatBox';

const GroupExamLobby = ({ socket }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  useEffect(() => {
    socket.on('new-question', (question) => {
      setCurrentQuestion(question);
    });
    return () => {
      socket.off('new-question');
    };
  }, [socket]);
  return (
    <Container>
      {currentQuestion
        ? (
          <Segment size="massive">
            <ExamQuestionCard />
          </Segment>
        )
        : <ChatBox />}
    </Container>
  );
};

export default GroupExamLobby;
