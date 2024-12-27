import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

// helper functions
export interface Anecdote {
    content: string
    id: string
    votes: number
}

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote : string) => {
    return {
      content: anecdote,
      id: getId(),
      votes: 0
    }
  }

// axio service functions
const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content : string) => {
  const object = asObject(content)
  const response = await axios.post(baseUrl, object)
  return response.data
}

const vote = async (id : string) => {
  const anecdote = await axios.get(`${baseUrl}/${id}`)
  const updatedAnecdote = { ...anecdote.data, votes: anecdote.data.votes + 1 }
  const response = await axios.put(`${baseUrl}/${id}`, updatedAnecdote)
  return response.data
}

export default { getAll, createNew, vote }