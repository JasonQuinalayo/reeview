import React, { useState } from 'react';
import {
  Segment, Grid, Container, Button, Divider, Checkbox, Input,
} from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';
import { useStateValue } from '../state';

const PracticeExam = () => {
  const [{ questions }] = useStateValue();
  const [numOfQuestions, setNumOfQuestions] = useState({ ee: 0, esas: 0, math: 0 });
  const [isOnePage, setIsOnePage] = useState(false);

  const getRangeSettings = (category) => ({
    start: 0,
    min: 0,
    max: questions[category].length,
    step: 1,
    onChange: (value) => {
      setNumOfQuestions((prevState) => ({ ...prevState, [category]: value }));
    },
  });

  const onInputChange = (category) => (e) => {
    let value = parseInt(e.target.value, 10);
    if (!value) value = 0;
    else if (value > questions[category].length) value = questions[category].length;
    setNumOfQuestions((prevState) => ({ ...prevState, [category]: value }));
  };

  const start = () => { console.log(isOnePage); };

  const getSliderComponent = (category) => (
    <Segment basic key={category}>
      <Grid columns={3}>
        <Grid.Column width={2}>
          {category.toUpperCase()}
        </Grid.Column>
        <Grid.Column width={10}>
          <Slider value={numOfQuestions[category]} settings={getRangeSettings(category)} />
        </Grid.Column>
        <Grid.Column width={4}>
          <Input value={numOfQuestions[category]} onChange={onInputChange(category)} />
        </Grid.Column>
      </Grid>
    </Segment>
  );
  return (
    <Container>
      {['ee', 'esas', 'math'].map((category) => (getSliderComponent(category)))}
      <Divider hidden />
      <Checkbox onClick={() => setIsOnePage((prev) => !prev)} label="View questions in one page" />
      <Divider hidden />
      <Button type="button" onClick={start}>Start</Button>
    </Container>
  );
};

export default PracticeExam;
