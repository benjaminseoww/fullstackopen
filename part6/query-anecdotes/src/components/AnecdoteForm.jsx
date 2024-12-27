import { useMutation, useQueryClient } from '@tanstack/react-query'
import anecdoteService from '.././services/anecdotes'
import { useContext } from 'react'
import { NotificationContext } from '../notificationContext'

const AnecdoteForm = () => {
  // notification context
  const [notification, notificationDispatch] = useContext(NotificationContext)

  // query handle 
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: anecdoteService.createNew,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: (error) => {
      notificationDispatch({ type: 'SET_NOTIFICATION', data: error.response.data.error });
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    const response = mutation.mutate(content)
    console.log(response)
    notificationDispatch({ type: 'SET_NOTIFICATION', data: `you created '${content}'` });
    setTimeout(() => {
      notificationDispatch({ type: 'REMOVE_NOTIFICATION' });
    }, 5000);
    console.log('new anecdote')
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
