/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Button, Checkbox, Container, Divider, Form, Input, Label, Modal, Segment, Tab,
} from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { useStateValue, addQuestion, approveQuestion } from '../state';
import { approvedQuestionsAsArray } from '../utils';
import { PendingQuestionCard, ApprovedQuestionCard } from '../components/QuestionItem';
import { questionsService } from '../services';

const FilterCheckBoxes = ({ items, updateFunction }) => (
  <Segment>
    {items.map((t) => (
      <Checkbox
        key={t}
        label={t}
        defaultChecked
        onClick={updateFunction}
      />
    ))}
  </Segment>
);

const QuestionsTab = ({ questions, onSuggestUpdate, onApprove }) => {
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [numOfDisplayed, setNumOfDisplayed] = useState(10);
  const [pageYOffset, setPageYOffset] = useState();
  const [searchString, setSearchString] = useState('');
  const [allYears, setAllYears] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [filterYears, setFilterYears] = useState();
  const [filterTags, setFilterTags] = useState();
  const [filterCategories, setFilterCategories] = useState();
  useEffect(() => {
    const years = new Set();
    const tags = new Set();
    questions.forEach((q) => {
      if (q.year) years.add(q.year);
      q.tags.forEach((t) => {
        tags.add(t);
      });
    });
    setFilteredQuestions([...questions]);
    setAllYears(Array.from(years).sort());
    setAllTags(Array.from(tags).sort());
    setFilterYears(Array.from(years));
    setFilterTags(Array.from(tags));
    setFilterCategories(['ee', 'esas', 'math']);
  }, [questions]);
  useEffect(() => {
    const onScroll = () => {
      setPageYOffset(window.scrollY);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (pageYOffset + window.innerHeight + 2 >= document.body.scrollHeight) {
      setNumOfDisplayed((prev) => (prev < questions.length ? prev + 10 : prev));
    }
  }, [pageYOffset, questions.length, numOfDisplayed]);
  const filter = () => {
    const newFilteredQuestions = questions.filter((q) => {
      let validStrings = true;
      if (searchString) {
        validStrings = (q.question.includes(searchString)
          || q.choices.a.includes(searchString)
          || q.choices.b.includes(searchString)
          || q.choices.c.includes(searchString)
          || q.choices.d.includes(searchString));
      }
      const validYears = filterYears.includes(q.year);
      const validTags = filterTags.length === 0
      || q.tags.reduce((acc, cur) => acc && filterTags.includes(cur), true);
      const validCategory = filterCategories.includes(q.category);
      return validStrings && validYears && validTags && validCategory;
    });
    setFilteredQuestions(newFilteredQuestions);
  };
  return (
    <Container className="padded-top">
      <Segment>
        <Input
          fluid
          placeholder="Search for a substring within questions..."
          onChange={(e) => setSearchString(e.target.value)}
        />
        <FilterCheckBoxes
          items={['ee', 'esas', 'math']}
          updateFunction={(_, { label, checked }) => (
            setFilterCategories((p) => (checked ? p.concat(label) : p.filter((e) => e !== label)))
          )}
        />
        {allYears.length > 0
          && (
          <FilterCheckBoxes
            items={allYears}
            updateFunction={(_, { label, checked }) => (
              setFilterYears((p) => (checked ? p.concat(label) : p.filter((e) => e !== label))))}
          />
          )}
        {allTags.length > 0
          && (
          <FilterCheckBoxes
            items={allTags}
            updateFunction={(_, { label, checked }) => (
              setFilterTags((p) => (checked ? p.concat(label) : p.filter((e) => e !== label)))
            )}
          />
          )}
        <Button fluid onClick={filter}>Filter</Button>
      </Segment>
      {filteredQuestions.slice(0, numOfDisplayed)
        .map((question) => (
          <Segment key={question.id}>
            {onSuggestUpdate
              ? (
                <ApprovedQuestionCard
                  onSuggestUpdate={() => onSuggestUpdate(question)}
                  question={question}
                />
              )
              : (
                <PendingQuestionCard
                  onApprove={() => onApprove(question.id)}
                  question={question}
                />
              )}
          </Segment>
        ))}
    </Container>
  );
};

const validYears = ['unknown'];
for (let i = 1970; i <= (new Date().getFullYear()); i++) {
  validYears.push(i.toString());
}

const NewQuestionModal = ({
  openModal, onClose, sourceQuestion, onSubmit,
}) => {
  const [tags, setTags] = useState(
    sourceQuestion && sourceQuestion.tags.length > 0 ? sourceQuestion.tags : [],
  );
  const [inputTag, setInputTag] = useState('');
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: sourceQuestion
      ? {
        question: sourceQuestion.question,
        choiceA: sourceQuestion.choices.a,
        choiceB: sourceQuestion.choices.b,
        choiceC: sourceQuestion.choices.c,
        choiceD: sourceQuestion.choices.d,
        answer: sourceQuestion.answer,
        year: sourceQuestion.year,
        category: sourceQuestion.category,
      }
      : {
        question: '',
        choiceA: '',
        choiceB: '',
        choiceC: '',
        choiceD: '',
        answer: 'a',
        year: 'unknown',
        category: 'ee',
      },
    validate: (values) => {
      const errors = {};
      if (!values.question) {
        errors.question = 'Required';
      } else if (values.question.length > 500) {
        errors.question = 'Too long!';
      }

      ['a', 'b', 'c', 'd'].forEach((c) => {
        const fValue = `choice${c.toUpperCase()}`;
        if (!values[fValue]) {
          errors[fValue] = 'Required';
        } else if (values[fValue].length > 200) {
          errors[fValue] = 'Too long!';
        }
      });

      return errors;
    },
    onSubmit: async (values) => {
      const q = {
        question: values.question,
        choices: {
          a: values.choiceA,
          b: values.choiceB,
          c: values.choiceC,
          d: values.choiceD,
        },
        answer: values.answer,
        category: values.category,
        tags,
      };
      if (values.year !== 'unknown') q.year = parseInt(values.year, 10);
      if (sourceQuestion) q.sourceQuestionId = sourceQuestion.id;
      onSubmit(q);
    },
  });
  return (
    <Modal open={openModal} closeIcon onClose={onClose}>
      <Modal.Header>New Question/Update Question</Modal.Header>
      <Modal.Content>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Field
            label="Question"
            control={Form.TextArea}
            {...formik.getFieldProps('question')}
            error={formik.touched.question && formik.errors.question && {
              content: formik.errors.question,
            }}
          />
          <div>Choices</div>
          {['a', 'b', 'c', 'd'].map((c) => (
            <Form.Field
              key={c}
              label={c}
              control={Form.Input}
              {...formik.getFieldProps(`choice${c.toUpperCase()}`)}
              error={formik.touched[`choice${c.toUpperCase()}`] && formik.errors[`choice${c.toUpperCase()}`] && {
                content: formik.errors[`choice${c.toUpperCase()}`],
              }}
            />
          ))}
          <Form.Group widths="equal">
            <Form.Field
              label="Category"
              control="select"
              {...formik.getFieldProps('category')}
            >
              {['ee', 'esas', 'math'].map((y) => (
                <option
                  key={y}
                  text={y}
                  value={y}
                  label={y}
                />
              ))}
            </Form.Field>
            <Form.Field
              label="Answer"
              control="select"
              {...formik.getFieldProps('answer')}
            >
              {['a', 'b', 'c', 'd'].map((y) => (
                <option
                  key={y}
                  text={y}
                  value={y}
                  label={y}
                />
              ))}
            </Form.Field>
            <Form.Field
              label="Year"
              control="select"
              {...formik.getFieldProps('year')}
            >
              {validYears.map((y) => (
                <option
                  key={y}
                  text={y}
                  value={y}
                  label={y}
                />
              ))}
            </Form.Field>
          </Form.Group>
          <Input
            action={{
              content: 'Add Tag',
              onClick: () => setTags((p) => p.concat(inputTag)),
              type: 'button',
            }}
            value={inputTag}
            onChange={(e) => setInputTag(e.target.value)}
          />
          {tags.length > 0
            && (
            <Segment>
              {tags.map((t) => (
                <Label key={t}>{t}</Label>
              ))}
            </Segment>
            )}
          <Divider />
          <Form.Button type="submit" fluid>Submit</Form.Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

const Questions = () => {
  const [{ questions }, dispatch] = useStateValue();
  const [openNewQuestionModal, setOpenNewQuestionModal] = useState(false);
  const [modalSourceQuestion, setModalSourceQuestion] = useState(null);
  const { id } = useParams();
  const { approved: approvedQuestions, pending: pendingQuestions } = questions;
  const approvedQuestionsArray = useMemo(() => (
    approvedQuestionsAsArray(approvedQuestions)), [approvedQuestions]);

  const onSuggestUpdate = (sourceQuestion) => {
    setModalSourceQuestion(sourceQuestion);
    setOpenNewQuestionModal((p) => !p);
  };

  const panes = useMemo(() => {
    const onApprove = async (questionId) => {
      try {
        const q = await questionsService.approvePendingQuestion(questionId);
        dispatch(approveQuestion(q));
      } catch (e) {
        alert(e.response.data.error);
      }
    };
    return ([
      { menuItem: 'Approved', render: () => <QuestionsTab onSuggestUpdate={onSuggestUpdate} questions={approvedQuestionsArray} /> },
      { menuItem: 'Pending', render: () => <QuestionsTab onApprove={onApprove} questions={pendingQuestions} /> },
    ]);
  }, [dispatch, pendingQuestions, approvedQuestionsArray]);
  if (id) {
    let question = approvedQuestionsArray.find((x) => x.id === id);
    if (question) {
      return <ApprovedQuestionCard question={question} onSuggestUpdate={onSuggestUpdate} />;
    }
    question = pendingQuestions.find((x) => x.id === id);
    if (question) {
      return <PendingQuestionCard question={question} />;
    }
    return <div>Question not found</div>;
  }

  const onCloseModal = () => {
    setOpenNewQuestionModal(((p) => !p));
    setModalSourceQuestion(null);
  };

  const onSubmitModal = async (newQuestion) => {
    try {
      if (newQuestion.sourceQuestionId) {
        await questionsService.suggestUpdateQuestion(newQuestion, newQuestion.sourceQuestionId);
      } else {
        await questionsService.addNewQuestion(newQuestion);
      }
      dispatch(addQuestion(newQuestion));
    } catch (e) {
      alert(e.response.data.error);
    }
    onCloseModal();
  };

  return (
    <Container>
      <Button floated="right" type="button" onClick={() => setOpenNewQuestionModal((p) => !p)}>Add Question</Button>
      <NewQuestionModal
        openModal={openNewQuestionModal}
        onClose={onCloseModal}
        onSubmit={onSubmitModal}
        sourceQuestion={modalSourceQuestion}
      />
      <Tab panes={panes} />
    </Container>
  );
};

export default Questions;
