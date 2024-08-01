import React from 'react'

function Options({ question, dispatch, answer }) {
    const hasAnswer = answer !== null
    return (
        <div className='options'>
            {question.options.map((option, index) => (<button disabled={hasAnswer} className={`btn btn-option ${index === answer ? "answer" : ""}  ${hasAnswer ? index === question.correctOption ? "correct" : "wrong" : ""}`} key={option}
                onClick={() => dispatch({ type: "newAnswer", payload: index })}
            >{option}</button>))}
        </div>
    )
}

export default Options