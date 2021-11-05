const questionObjectToArray = (questions) => {
  const results = [];
  Object.keys(questions).forEach((q) => results.push(questions[q]));
  return results;
};

export default questionObjectToArray;
