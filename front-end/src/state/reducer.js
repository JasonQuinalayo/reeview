export const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload.user };
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload.questions };
    case 'ADD_QUESTION':
      return {
        ...state,
        questions: {
          ...state.questions,
          pending: [...state.questions.pending, action.payload.question],
        },
      };
    case 'APPROVE_QUESTION':
      return {
        ...state,
        questions: {
          approved: {
            ...state.questions.approved,
            [action.payload.question.category]: Object.keys(
              state.questions.approved[action.payload.question.category],
            )
              .filter((key) => key !== action.payload.question.updateTo)
              .reduce((res, key) => (
                Object.assign(res,
                  { [key]: state.questions.approved[action.payload.question.category][key] })),
              {}),
          },
          pending: state.questions.pending.filter((q) => q.id !== action.payload.question.id),
        },
      };
    default:
      return state;
  }
};

export const setUser = (user) => (
  {
    type: 'SET_USER',
    payload: { user },
  }
);

export const setQuestions = (questions) => (
  {
    type: 'SET_QUESTIONS',
    payload: { questions },
  }
);

export const addQuestion = (question) => (
  {
    type: 'ADD_QUESTION',
    payload: { question },
  }
);

export const approveQuestion = (question) => (
  {
    type: 'APPROVE_QUESTION',
    payload: { question },
  }
);
