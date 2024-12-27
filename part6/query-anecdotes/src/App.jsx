import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import anecdoteService from './services/anecdotes'
import { NotificationContextProvider } from './notificationContext'

const App = () => {
  // query handle
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: anecdoteService.vote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  // notification context

  const handleVote = (anecdote) => {
    console.log(anecdote)
    mutation.mutate(anecdote.id)
    console.log('vote')
  }

  // Queries
  const anecdotes = useQuery({ queryKey: ['anecdotes'], queryFn: anecdoteService.getAll, retry: false })
  console.log(JSON.parse(JSON.stringify(anecdotes)))

  if (anecdotes.isError) {
    return (<div>anecdotes service not avaliable due to problems in server</div>)
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.isLoading ? <div> loading </div>
        : anecdotes.data?.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ) }
    </div>
  )
}

export default App
