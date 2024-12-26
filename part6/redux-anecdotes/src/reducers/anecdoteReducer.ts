import { createAction, createReducer } from '@reduxjs/toolkit'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

export interface Ancedote {
  content: string
  id: string
  votes: number
}

const asObject = (anecdote : string) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState : Ancedote[] = anecdotesAtStart.map(asObject)

// action creators
function withPayloadType<T>() {
  return (t: T) => ({ payload: t })
}
export const voteAnecdote = createAction('VOTE',  withPayloadType<{id: string}>())
export const createAnecdote = createAction('CREATE',  withPayloadType<{content: string}>())

// reducer
const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(voteAnecdote, (state, action) => {
      const ancedoteVoted = state.find(a => a.id === action.payload.id)

      if (!ancedoteVoted) {
        return state
      }

      const votedAnecdote = {
        ...ancedoteVoted,
        votes: ancedoteVoted.votes + 1
      }
      return state.map(a => a.id !== action.payload.id ? a : votedAnecdote)
    })
    .addCase(createAnecdote, (state, action) => {
      return [...state, asObject(action.payload.content)]
    })
})

export default reducer