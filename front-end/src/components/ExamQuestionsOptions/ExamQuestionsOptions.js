import React from 'react';
import { Segment } from 'semantic-ui-react';
import { useStateValue } from '../../state';
import SliderSegment from './SliderSegment';

const ExamQuestionsOptions = ({ numOfQuestions, setNumOfQuestions }) => {
  const [{ questions }] = useStateValue();

  return (
    Object.keys(numOfQuestions).map((category) => (
      <Segment key={category}>
        <SliderSegment
          category={category}
          max={questions[category].length}
          categoryNumOfQuestions={numOfQuestions[category]}
          setNumOfQuestions={setNumOfQuestions}
        />
      </Segment>
    ))
  );
};

export default ExamQuestionsOptions;
