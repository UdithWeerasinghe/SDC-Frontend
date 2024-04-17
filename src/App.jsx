import React from "react";
import PropTypes from "prop-types"; // Import PropTypes

import Quiz from "./Quiz";
const App = ({ questions }) => {
  return <Quiz questions={questions} />;
};

// Add prop type validation for the 'questions' prop
App.propTypes = {
  questions: PropTypes.array.isRequired, 
};

export default App;
