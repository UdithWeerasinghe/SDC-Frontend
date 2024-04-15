import React, { useState } from "react";
import PropTypes from "prop-types";
import { resultInitialState } from "./constants";

const Quiz = ({ questions }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswerIdx, setSelectedAnswerIdx] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [result, setResult] = useState(resultInitialState);
    const [showResults, setShowResults] = useState(false);

    const { question, choices, correctAnswer, generalFeedback, specificFeedback } = questions[currentQuestion];

    const onAnswerClick = (choice, index) => {
        if (!isSubmitted) {
            setSelectedAnswerIdx(index);
        }
    };

    const onSubmitAnswer = () => {
        if (selectedAnswerIdx !== null && !isSubmitted) {
            const isCorrect = choices[selectedAnswerIdx] === correctAnswer;
            setResult(prev => ({
                ...prev,
                score: isCorrect ? prev.score + 10 : prev.score,
                correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
                wrongAnswers: !isCorrect ? prev.wrongAnswers + 1 : prev.wrongAnswers,
            }));
            setIsSubmitted(true);
        }
    };

    const onClickNext = () => {
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

    return (
        <div className="quiz-container">
            {showResults ? (
                <div className="final-results">
                    <h3>Final Results</h3>
                    <p>Total Questions: {questions.length}</p>
                    <p>Total Score: {result.score}</p>
                    <p>Correct Answers: {result.correctAnswers}</p>
                    <p>Wrong Answers: {result.wrongAnswers}</p>
                    <button onClick={() => setShowResults(false)}>Play Again</button>
                </div>
            ) : (
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
                            <button onClick={onSubmitAnswer} disabled={selectedAnswerIdx === null}>
                                Submit
                            </button>
                        )}
                        {isSubmitted && (
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

Quiz.propTypes = {
    questions: PropTypes.arrayOf(
        PropTypes.shape({
            question: PropTypes.string.isRequired,
            choices: PropTypes.arrayOf(PropTypes.string).isRequired,
            correctAnswer: PropTypes.string.isRequired,
            generalFeedback: PropTypes.string.isRequired,
            specificFeedback: PropTypes.arrayOf(PropTypes.string).isRequired,
        })
    ).isRequired
};

export default Quiz;



