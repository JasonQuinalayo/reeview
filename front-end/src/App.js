import React, { useEffect } from 'react';
import { Container, Divider } from 'semantic-ui-react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Profile from './components/Profile';
import Questions from './components/Questions';
import { setUser, useStateValue } from './state';
import userService from './services/user';

const App = () => {
  const [, dispatch] = useStateValue();
  useEffect(() => {
    const f = async () => {
      const user = userService.getUser();
      dispatch(setUser(user));
    };
    f();
  }, [dispatch]);
  return (
    <div className="App">
      <Router>
        <Container>
          <NavBar />
          <Divider hidden />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path="/questions">
              <Questions />
            </Route>
          </Switch>
        </Container>
      </Router>
    </div>
  );
};

export default App;
