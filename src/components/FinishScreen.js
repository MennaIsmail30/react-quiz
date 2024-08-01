import React from 'react'

function FinishScreen({ points, maxPossiblePoints, despatch }) {
    const percentage = (points / maxPossiblePoints) * 100
    return (
        <>

            <p className='result'>
                You Scored <strong>{points}</strong> Out of {maxPossiblePoints} ({Math.ceil(percentage)})%
            </p>
            <button className='btn btn-ui' onClick={() => despatch({ type: "reset" })}>Restart Quiz</button>
        </>
    )
}

export default FinishScreen