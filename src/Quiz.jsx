// Quiz.jsx

// Import necessary modules from React and prop-types
import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Import initial state for result
import { resultInitialState } from './constants';

// Define the Quiz component
const Quiz = ({ questions }) => {
    // Define state variables using the useState hook
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswerIdx, setSelectedAnswerIdx] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [result, setResult] = useState(resultInitialState);
    const [showResults, setShowResults] = useState(false);

    // Destructure properties from the current question object
    const { question, choices, correctAnswer, generalFeedback, specificFeedback } = questions[currentQuestion];

    // Event handler for clicking on an answer choice
    const onAnswerClick = (choice, index) => {
        // Allow selecting an answer only if not already submitted
        if (!isSubmitted) {
            setSelectedAnswerIdx(index);
        }
    };

    // Event handler for submitting an answer
    const onSubmitAnswer = () => {
        // Submit answer only if an answer is selected and not already submitted
        if (selectedAnswerIdx !== null && !isSubmitted) {
            // Check if the selected answer is correct
            const isCorrect = choices[selectedAnswerIdx] === correctAnswer;
            // Update the result based on the correctness of the answer
            setResult(prev => ({
                ...prev,
                score: isCorrect ? prev.score + 10 : prev.score,
                correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
                wrongAnswers: !isCorrect ? prev.wrongAnswers + 1 : prev.wrongAnswers,
            }));
            // Set the submitted state to true
            setIsSubmitted(true);
        }
    };

    // Event handler for clicking on the next button
    const onClickNext = () => {
        // Proceed to the next question or show results if all questions are answered
        if (isSubmitted) {
            setSelectedAnswerIdx(null);
            setIsSubmitted(false);
            if (currentQuestion !== questions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
            } else {
                setShowResults(true);
            }
        }
    };

    // Render the Quiz component
    return (
        <div className="quiz-container">
            {showResults ? (
                // Display final results if showResults state is true
                <div className="final-results">
                    <h3>Final Results</h3>
                    <p>Total Questions: {questions.length}</p>
                    <p>Total Score: {result.score}</p>
                    <p>Correct Answers: {result.correctAnswers}</p>
                    <p>Wrong Answers: {result.wrongAnswers}</p>
                    <button onClick={() => setShowResults(false)}>Play Game</button>
                </div>
            ) : (
                // Display the current question and answer choices
                <>
                    <span className="active-question-no">{currentQuestion + 1}</span>
                    <span className="total-question">/{questions.length}</span>
                    <h2>{question}</h2>
                    <ul>
                        {choices.map((choice, index) => (
                            <li
                                key={choice}
                                className={`
                                    ${selectedAnswerIdx === index ? 'selected-answer' : ''}
                                    ${isSubmitted && choice === correctAnswer ? 'correct-answer' : ''}
                                    ${isSubmitted && selectedAnswerIdx === index && choice !== correctAnswer ? 'wrong-answer' : ''}
                                `}
                                onClick={() => onAnswerClick(choice, index)}
                            >
                                <span>{`${String.fromCharCode(65 + index)}. ${choice}`}</span>
                                {isSubmitted && selectedAnswerIdx === index && (
                                    <p className="feedback">{specificFeedback[selectedAnswerIdx]}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                    <p className="general-feedback">{isSubmitted && generalFeedback}</p>
                    <div className="footer">
                        {!isSubmitted && (
                            // Display the submit button if the answer is not yet submitted
                            <button onClick={onSubmitAnswer} disabled={selectedAnswerIdx === null}>
                                Submit
                            </button>
                        )}
                        {isSubmitted && (
                            // Display the next button if the answer is submitted
                            <button onClick={onClickNext}>
                                Next
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

// Define prop types for the Quiz component
Quiz.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      choices: PropTypes.arrayOf(PropTypes.string).isRequired,
      correctAnswer: PropTypes.string.isRequired,
      generalFeedback: PropTypes.string.isRequired,
      specificFeedback: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
};

// Export the Quiz component as default
export default Quiz;
