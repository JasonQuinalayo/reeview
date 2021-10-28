import React, { useEffect } from 'react';
import { Container, Divider } from 'semantic-ui-react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Questions from './pages/Questions';
import PracticeExam from './pages/PracticeExam';
import { setQuestions, useStateValue } from './state';
import questionsService from './services/questions';

const App = () => {
  const [, dispatch] = useStateValue();
  useEffect(() => {
    const f = async () => {
      const questions = await questionsService.getQuestions();
      const categorizedQuestions = { ee: [], esas: [], math: [] };
      questions.forEach((question) => {
        categorizedQuestions[question.category].push(question);
      });
      dispatch(setQuestions(categorizedQuestions));
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
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path="/questions">
              <Questions />
            </Route>
            <Route exact path="/practice-exam">
              <PracticeExam />
            </Route>
          </Switch>
        </Container>
      </Router>
    </div>
  );
};

export default App;
