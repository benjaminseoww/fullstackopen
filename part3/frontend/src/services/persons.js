import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_BACKEND_URL}`;

// getting existing data from database and display on first render
const getAll = () => {
    return axios.get(baseUrl);
}

// add contact to database
const addPerson = (newPerson) => {
    return axios.post(baseUrl, newPerson);
}

const deletePerson = (id) => {
    return axios.delete(baseUrl + '/' + id)
}

const updatePerson = (newPerson, id) => {
    return axios.put(baseUrl + '/' + id, newPerson)
}

export default {
    getAll: getAll,
    addPerson: addPerson,
    deletePerson: deletePerson,
    updatePerson: updatePerson
}