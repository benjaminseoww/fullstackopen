import { voteAnecdote } from '../reducers/anecdoteReducer'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'

const AnecdoteList = () => {
    const anecdotes = useSelector((state : RootState) => state.anecdotes)
    const dispatch = useDispatch()
  
    const vote = (event : React.MouseEvent<HTMLButtonElement>, id : string) => {
      console.log('vote', id)
      event.preventDefault()
      dispatch(voteAnecdote({id: id}))
    }

    return (
        <>
            {anecdotes
                .slice().sort((a, b) => b.votes - a.votes)
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