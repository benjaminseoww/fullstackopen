import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {

    const dispatch = useDispatch()

    const create = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log('create')
        const formElems = event.currentTarget.elements as typeof event.currentTarget.elements & {
          anecdote: HTMLInputElement,
        }
        dispatch(createAnecdote({content: formElems.anecdote.value}))
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={create}>
                <div><input name="anecdote" /></div>
                <button type="submit">create</button>
            </form>
        </>
    )
}

export default AnecdoteForm