import React from 'react';
import { Segment } from 'semantic-ui-react';
import { useStateValue } from '../../state';
import SliderComponent from './SliderComponent';
import { objectValuesToArray } from '../../utils';

const ExamQuestionsOptions = ({ numOfQuestions, setNumOfQuestions }) => {
  const [{ questions }] = useStateValue();
  const { approved: approvedQuestions } = questions;

  return (
    Object.keys(numOfQuestions).map((category) => (
      <Segment key={category}>
        <SliderComponent
          category={category}
          max={objectValuesToArray(approvedQuestions[category]).length}
          categoryNumOfQuestions={numOfQuestions[category]}
          setNumOfQuestions={setNumOfQuestions}
        />
      </Segment>
    ))
  );
};

export default ExamQuestionsOptions;
