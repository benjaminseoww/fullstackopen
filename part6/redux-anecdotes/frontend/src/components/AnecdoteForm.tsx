import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'
import { AppDispatch } from '../store'

const AnecdoteForm = () => {

    const dispatch = useDispatch() as AppDispatch

    const create = async (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log('create')
        const formElems = event.currentTarget.elements as typeof event.currentTarget.elements & {
          anecdote: HTMLInputElement,
        }
        const content = formElems.anecdote.value
        dispatch(createAnecdote(content))
        dispatch(setNotification(`You created '${content}'`))
        setTimeout(() => {
            dispatch(clearNotification())
        }, 5000)
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