import React, { useEffect } from 'react';
import { Container, Divider, Header } from 'semantic-ui-react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Questions from './pages/Questions';
import PracticeExam from './pages/PracticeExam';
import { setQuestions, useStateValue, setUser } from './state';
import { questionsService, userService } from './services';
import GroupExam from './pages/GroupExam';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';

if (process.env.NODE_ENV === 'development') axios.defaults.withCredentials = true;

const App = () => {
  const [{ user }, dispatch] = useStateValue();
  useEffect(() => {
    if (!user) return;
    const f = async () => {
      const questions = await questionsService.getQuestions();
      const categorizedQuestions = { ee: {}, esas: {}, math: {} };
      questions.forEach((question) => {
        categorizedQuestions[question.category][question.id] = question;
      });
      dispatch(setQuestions(categorizedQuestions));
    };
    f();
  }, [dispatch, user]);
  useEffect(() => {
    const f = async () => {
      try {
        const currentUser = await userService.getCurrentUser();
        dispatch(setUser(currentUser));
      // eslint-disable-next-line no-empty
      } catch (e) {}
    };
    f();
  }, [dispatch]);
  return (
    <div className="App">
      {user
        ? (
          <Router>
            <Container>
              <NavBar />
              <Divider hidden />
              <Switch>
                <Route exact path="/profile">
                  <Profile />
                </Route>
                <Route exact path="/questions">
                  <Questions />
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
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </Container>
          </Router>
        )
        : (
          <Router>
            <Divider hidden />
            <Container>
              <Header size="huge" textAlign="center">
                REEview xd
              </Header>
              <Switch>
                <Route exact path="/register/:id">
                  <Register />
                </Route>
                <Route path="/">
                  <Login />
                </Route>
              </Switch>
            </Container>
          </Router>
        )}
    </div>
  );
};

export default App;
