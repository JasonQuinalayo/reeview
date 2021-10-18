import React from 'react';
import { Container, Menu, Segment } from 'semantic-ui-react';

const App = () => (
  <div className="App">
    <Container>
      <Menu pointing secondary>
        <Menu.Item>
          Hello
        </Menu.Item>
        <Menu.Item>
          World
        </Menu.Item>
      </Menu>
      <Segment>
        LOREM IPSUM
      </Segment>
    </Container>
  </div>
);

export default App;
