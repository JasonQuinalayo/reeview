import React, { useState } from 'react';
import { Button, Input, Modal } from 'semantic-ui-react';
import ExamQuestionsOptions from '../../components/ExamQuestionsOptions/ExamQuestionsOptions';

const CreateLobbyModal = ({ onSubmit, modalOpen, onClose }) => {
  const [numOfQuestions, setNumOfQuestions] = useState({ ee: 0, esas: 0, math: 0 });
  const [timeInterval, setTimeInterval] = useState(5);
  const handleTimeIntervalInput = (e) => {
    let val = e.target.value;
    if (val < 5) val = 5;
    else if (val > 30) val = 30;
    setTimeInterval(val);
  };

  return (
    <Modal open={modalOpen} onClose={onClose} closeIcon>
      <Modal.Header>Create Lobby</Modal.Header>
      <Modal.Content>
        <ExamQuestionsOptions
          numOfQuestions={numOfQuestions}
          setNumOfQuestions={setNumOfQuestions}
        />
        <Input
          label="Time interval between questions. (min: 5s, max : 30s)"
          value={timeInterval}
          onChange={handleTimeIntervalInput}
        />
        <Button type="button" onClick={() => onSubmit(numOfQuestions, timeInterval)}>Create</Button>
      </Modal.Content>
    </Modal>
  );
};

export default CreateLobbyModal;
