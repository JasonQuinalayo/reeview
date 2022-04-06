import React, { useEffect, useState } from 'react';
import {
  Container, Divider, Grid, Header, Image, Loader,
} from 'semantic-ui-react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Questions from './pages/Questions';
import PracticeExam from './pages/PracticeExam';
import GroupExam from './pages/GroupExam';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import jmon from './images/jmon.jpg';
import { useStateValue, setUser } from './state';
import { userService, questionsService } from './services';
import { fetchQuestions, approvedQuestionsAsArray } from './utils';

if (process.env.NODE_ENV === 'development') axios.defaults.withCredentials = true;

const AppWithLoggedInUser = () => {
  const [{ questions }] = useStateValue();
  return (
    approvedQuestionsAsArray(questions.approved).length > 0 ? (
      <Router>
        <NavBar />
        <Container className="padded-top">
          <Divider hidden />
          <Switch>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path="/practice-exam">
              <PracticeExam />
            </Route>
            <Route exact path="/group-exam">
              <GroupExam />
            </Route>
            <Route exact path="/admin">
              <Admin />
            </Route>
            <Route exact path="/questions">
              <Questions />
            </Route>
            <Route exact path="/questions/:id">
              <Questions />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Container>
      </Router>
    ) : <Loader />
  );
};

const App = () => {
  const [{ user }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const f = async () => {
      try {
        const currentUser = await userService.getCurrentUser();
        dispatch(setUser(currentUser));
      // eslint-disable-next-line no-empty
      } catch (e) {} finally {
        setLoading(false);
      }
    };
    f();
  }, [dispatch]);
  useEffect(() => {
    if (!user) return;
    const f = async () => {
      await fetchQuestions(dispatch, questionsService);
    };
    f();
  }, [dispatch, user, loading.user]);
  if (loading) { return <Loader />; }
  return (
    <div className="App">
      {user
        ? <AppWithLoggedInUser />
        : (
          <Router>
            <Divider hidden />
            <Container>
              <Header size="huge" textAlign="center">
                REEview xd
              </Header>
              <Grid columns={2} centered>
                <Grid.Column>
                  <Image centered src={jmon} />
                </Grid.Column>
                <Grid.Column stretched>
                  <Switch>
                    <Route exact path="/register/:id">
                      <Register />
                    </Route>
                    <Route path="/">
                      <Login />
                    </Route>
                  </Switch>
                </Grid.Column>
              </Grid>
            </Container>
          </Router>
        )}
    </div>
  );
};

export default App;
