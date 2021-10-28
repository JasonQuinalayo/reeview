import React from 'react';
import { Slider } from 'react-semantic-ui-range';
import { Grid, Input, Container } from 'semantic-ui-react';

const SliderSegment = ({
  category, max, setNumOfQuestions, categoryNumOfQuestions,
}) => {
  const settings = {
    start: 0,
    min: 0,
    max,
    step: 1,
    onChange: (value) => {
      setNumOfQuestions((prevState) => ({ ...prevState, [category]: value }));
    },
  };

  const onInputChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (!value) value = 0;
    else if (value > max) value = max;
    setNumOfQuestions((prevState) => ({ ...prevState, [category]: value }));
  };

  return (
    <Container key={category}>
      <Grid columns={3}>
        <Grid.Column width={2}>
          {category.toUpperCase()}
        </Grid.Column>
        <Grid.Column width={10}>
          <Slider value={categoryNumOfQuestions} settings={settings} />
        </Grid.Column>
        <Grid.Column width={4}>
          <Input value={categoryNumOfQuestions} onChange={onInputChange} />
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default SliderSegment;
