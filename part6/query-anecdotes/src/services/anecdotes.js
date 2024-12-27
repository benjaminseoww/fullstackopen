import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes/'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
    return {
      content: anecdote,
      id: getId(),
      votes: 0
    }
  }

// axio service functions
const getAll = () => axios.get(baseUrl).then(response => response.data)

const createNew = (content) => axios.post(baseUrl, asObject(content)).then(response => response.data)

const vote = (id) => axios.get(`${baseUrl}/${id}`).then(response => axios.put(`${baseUrl}/${id}`, { ...response.data, votes: response.data.votes + 1 }).then(response => response.data))

// async (id) => {
//   const anecdote = await axios.get(`${baseUrl}/${id}`)
//   const updatedAnecdote = { ...anecdote.data, votes: anecdote.data.votes + 1 }
//   const response = await axios.put(`${baseUrl}/${id}`, updatedAnecdote)
//   return response.data
// }

export default { getAll, createNew, vote }