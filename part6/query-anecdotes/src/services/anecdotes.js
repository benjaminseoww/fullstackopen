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

const createNew = (content) => {
    const anecdote = asObject(content)
    return axios.post(baseUrl, anecdote).then(response => response.data)
  }

const vote = (id) => axios.get(`${baseUrl}/${id}`).then(response => axios.put(`${baseUrl}/${id}`, { ...response.data, votes: response.data.votes + 1 }).then(response => response.data))

export default { getAll, createNew, vote }