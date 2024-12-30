import { useState } from 'react'
import { AnecdoteProps } from './types'
import { AnecdoteList } from './components/AnecdoteList'
import { CreateNew } from './components/CreateNew'
import { About } from './components/About'
import { Footer } from './components/Footer'
import { Menu } from './components/Menu'
import { Anecdote } from './components/Anecdote'
import { Routes, Route } from "react-router"; 

const App = () => {
  const [anecdotes, setAnecdotes] = useState<AnecdoteProps[]>([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    } ,
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote : Omit<AnecdoteProps, 'id'>) => {
    const newAnecdote = anecdote as AnecdoteProps
    newAnecdote.id = Math.round(Math.random() * 10000), // Add the id
    setAnecdotes(anecdotes.concat(newAnecdote))
  }

  const anecdoteById = (id : number) =>
    anecdotes.find(a => a.id === id)

  const vote = (id : number) => {
    const anecdote = anecdoteById(id) as AnecdoteProps

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <div>
      <h1>Software anecdotes</h1>

      <Menu />

      <p>{notification}</p>

      <Routes>
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path="/anecdotes/:id" element={<Anecdote anecdotes={anecdotes}/>} />
        <Route path="/about" element={<About />} />
        <Route path="/create" element={<CreateNew addNew={addNew} setNotification={setNotification} />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
