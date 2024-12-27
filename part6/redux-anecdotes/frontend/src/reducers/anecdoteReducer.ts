import { createSlice } from '@reduxjs/toolkit'
import { Anecdote } from '../services/anecdotes'
import ancedotesService from '../services/anecdotes'
import { AppDispatch } from '../store'

// slice 
const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [] as Anecdote[],
  reducers: {
    voteAnecdote: (state, action) => {
      const ancedoteVoted = state.find(a => a.id === action.payload.id)

      if (!ancedoteVoted) {
        return state
      }

      const votedAnecdote = {
        ...ancedoteVoted,
        votes: ancedoteVoted.votes + 1
      }
      return state.map(a => a.id !== action.payload.id ? a : votedAnecdote)
    },
    appendAnecdote: (state, action) => {
      return [...state, action.payload]
    },
    setAnecdotes: (state, action) => {
      return action.payload
    }
  }
})

const {actions, reducer } = anecdoteSlice
export const { voteAnecdote, appendAnecdote, setAnecdotes } = actions

export const initializeAnecdotes = () => {
  return async (dispatch: AppDispatch) => {
    const data: Anecdote[] = await ancedotesService.getAll()
    dispatch(setAnecdotes(data))
  }
}

export const createAnecdote = (content: string) => {
  return async (dispatch: AppDispatch) => {
    const newAnecdote = await ancedotesService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdoteAction = (id : string) => {
  return async (dispatch: AppDispatch) => {
    const votedAnecdote = await ancedotesService.vote(id)
    dispatch(voteAnecdote({id: votedAnecdote.id}))
  }
}

export default reducer