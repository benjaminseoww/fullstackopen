import { AnecdoteProps } from '../types'
import { Link } from 'react-router'

export const AnecdoteList = ({ anecdotes } : { anecdotes: AnecdoteProps[] }) => (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map(anecdote => <li key={anecdote.id}><Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link></li>)}
      </ul>
    </div>
)