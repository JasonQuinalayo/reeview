export const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload.user };
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload.questions };
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
