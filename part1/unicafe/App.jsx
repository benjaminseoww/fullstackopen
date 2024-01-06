import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = (good / all) * 100 + " %"// percent of positive feedback amongst all

  const handleGood = () => {
    setGood(good => good + 1)
  }

  const handleNeutral = () => {
    setNeutral(neutral => neutral + 1)
  }

  const handleBad = () => {
    setBad(bad => bad + 1)
  }

  return (
    <div>
      <h1> give feedback </h1>
      <Button eventhandle={handleGood} text='good'/>
      <Button eventhandle={handleNeutral} text='neutral'/>
      <Button eventhandle={handleBad} text='bad'/>
      <h1> statistics </h1>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive}/>
    </div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.eventhandle}>{props.text}</button>
  )
}

const Statistics = ({good, neutral, bad, all, average, positive}) => {
  if (all == 0) {
    return <p>No feedback given</p>
  }
  
  return (
    <table>
      <StatisticLine text = 'good' value={good}/>
      <StatisticLine text = 'neutral' value={neutral}/>
      <StatisticLine text = 'bad' value={bad}/>
      <StatisticLine text = 'all' value={all}/>
      <StatisticLine text = 'average' value={average}/>
      <StatisticLine text = 'positive' value={positive}/>
    </table>  
  )
}

const StatisticLine = ({text, value}) => {
    return (
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
      
    )
}

export default App
