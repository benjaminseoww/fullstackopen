import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { showNotification } from '../reducers/notificationReducer'
import { useEffect } from 'react'
import { initializeAnecdotes, voteAnecdoteAction } from '../reducers/anecdoteReducer'


const AnecdoteList = () => {
    const anecdotes = useSelector((state : RootState) => state.anecdotes)
    const filter = useSelector((state : RootState) => state.filter)
    const dispatch = useDispatch() as AppDispatch

    useEffect(() => {
        dispatch(initializeAnecdotes())
    }, [])
  
    const vote = (event : React.MouseEvent<HTMLButtonElement>, id : string) => {
      console.log('vote', id)
      event.preventDefault()
      const anecdote = anecdotes.find(a => a.id === id)
      dispatch(voteAnecdoteAction(id))
      dispatch(showNotification(`You voted for '${anecdote?.content}'`, 5))
    }

    return (
        <>
            {anecdotes
                .slice()
                .filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
                .sort((a, b) => b.votes - a.votes)
                .map(anecdote =>
                <div key={anecdote.id}>
                <div>
                    {anecdote.content}
                </div>
                <div>
                    has {anecdote.votes}
                    <button onClick={(event) => vote(event, anecdote.id)}>vote</button>
                </div>
                </div>
            )}
        </>
    )
}

export default AnecdoteList