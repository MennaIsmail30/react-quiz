
import { useEffect, useReducer } from 'react';
import './App.css';
import Header from "./components/Header";
import Main from './components/Main';
import Loader from './components/Loader';
import Error from './components/Error';
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import NextButton from './components/NextButton';
import Progress from './components/Progress';
import FinishScreen from './components/FinishScreen';
const initialState = {
  questions: [],

  status: 'loading',
  index: 0,
  answer: null,
  points: 0
};
function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state, questions: action.payload,
        status: "ready",
      };
    case 'dataFailed':
      return {
        ...state,
        status: "error",
      };
    case 'start':
      return { ...state, status: "active" };
    case 'newAnswer':
      const question = state.questions.at(state.index)
      return {
        ...state, answer: action.payload,
        points: action.payload === question.correctOption ?
          state.points + question.points
          : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    case "progress":
      return { ...state, index: state.index + 1 }
    case 'finish':
      return { ...state, status: "finished" };
    case 'reset':
      return {
        ...state, status: "reset", index: 0,
        answer: null,
        points: 0
      };
    default:
      throw new Error('Action unKnown')


  }
}
function App() {
  const [{ questions, status, index, answer, points }, despatch] = useReducer(reducer, initialState)
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0)
  useEffect(function () {
    fetch('http://localhost:8000/questions')
      .then((res) => res.json())
      .then(data => despatch({ type: "dataReceived", payload: data }))
      .catch((err) => despatch({ type: "dataFailed" }))
  }, [])
  return (
    <div className='app'>
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={despatch} />}
        {status === 'active' && (
          <>
            <Progress answer={answer} index={index} numQuestions={numQuestions} points={points}
              maxPossiblePoints={maxPossiblePoints} />
            <Question question={questions[index]} dispatch={despatch} answer={answer} />
            <NextButton despatch={despatch} answer={answer} index={index} numQuestions={numQuestions} />

          </>
        )}
        {status === "finished" && <FinishScreen points={points}
          maxPossiblePoints={maxPossiblePoints} despatch={despatch} />}
        {status === 'reset' && <StartScreen numQuestions={numQuestions} dispatch={despatch} />}
      </Main>
    </div>
  );
}

export default App;
