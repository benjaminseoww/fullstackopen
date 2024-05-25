import { useState, useEffect } from 'react';
import personServices from './services/persons';

const Filter = ({onChangeFunc}) => {
    return (
      <form>
        <div> filter shown with <input onChange = {onChangeFunc}/></div>
      </form>
    )
}

const PersonForm = ({onSubmitFunc, personOnChangeFunc, nameInputValue}) => {
    return (
      <form onSubmit = {onSubmitFunc}>
        <div>name: <input value = {nameInputValue} onChange = {personOnChangeFunc} /></div>
        <div>number: <input /></div>
        <div><button type="submit">add</button></div>
      </form>
    )
}

const Persons = ({displayList, deleteFunc}) => {
    return(
      displayList.map((person) => { 
        return (<div key = {person.id}>
                  {person.name} {person.number} 
                  <DeleteButton onSubmitFunc = {deleteFunc} id = {person.id} name = {person.name}/>
                </div>)
        })
      );
}

const DeleteButton = ({onSubmitFunc, id, name}) => {

  const value = id + name;

  return (
      <button type="submit" onClick = {onSubmitFunc} value = {value}>delete</button>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  const className = message.type

  return (
    <div className= {className} >
      {message.text}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [filterElement, setFilterElement] = useState('')
  const [notification, setNotification] = useState(null)

  // get initial data from data base to be shown once this url is loaded
  // [] means only run on initial loading??
  useEffect(() => {
    personServices
      .getAll()
      .then(response => {
        setPersons(response.data)
      }) 
      .catch(
        (error) => console.log('cant fetch initial data') 
      )
  }, [persons])

  const showMessage = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 2000);
  }


  // to collect info, then update the database
  // to add id for each Contact that is added 
  const addContact = (event) => {
    event.preventDefault() // stop form from submitting 

    const name = event.target[0].value;
    const number = event.target[1].value;

    // search persons array
    const index = persons.findIndex(obj => obj.name == name) + 1;

    if (index != 0) {
      const newPerson = {name: name, number: number, id: index.toString()}
      if (window.confirm(`${name} is already added to phonebook, replace the old number with a new one?`)) {
        personServices
          .updatePerson(newPerson, index)
          .then(response => {
            setPersons(persons.splice(index - 1, 1, newPerson));
          });
      }
    } else {
      const newPerson = {name: name, number: number, id: (persons.length + 1).toString()}
      personServices
        .addPerson(newPerson)
        .then(response => {
          setPersons(persons.concat(response.data));
          
          const message_dict = {
            text: "Added " + name,
            type: "notification"
          }

          showMessage(message_dict);
            setTimeout(() => {
              setNotification(null);
            }, 2000);         
        })
       .catch(error => {
          console.log('cant update database')
        })
    }
  }

  const updateNewName = (event) => {
    const updatedName = event.target.value;
    setNewName(updatedName);
    if (persons.map(person => person.name).includes(updatedName)) {
        alert(`${updatedName} is already added to phonebook`);
    }
  }

  // logic behind this 
  // if filter input is empty show all, if not show filtered input
  // this filtering needs to be done every time filter input is changed 
  const handleFilterNamelist = (event) => {
    const filterCon = event.target.value;
    
    if (filterCon !== '') {
      setShowAll(false)
    }
    else setShowAll(true)

    setFilterElement(filterCon)

  }

  const deleteFromForm = (event) => {
    event.preventDefault() // stop form from submitting 

    const eventOutput = event.target.value;
    const id = eventOutput[0];
    const name = eventOutput.substr(1);

    const confirmString = "Delete " + name + " ?";

    if (window.confirm(confirmString)) {
      personServices
        .deletePerson(id)
        .then(response => {
          const index = persons.indexOf(response.data);
          if (index > -1) {
            setPersons(persons.splice(index,1));
          }
        });
    }
    
  }

  const peopleToShow = showAll ? persons : persons.filter( (person) => 
  person.name.toLowerCase().includes(filterElement.toLowerCase()) ) // regex expression

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification}/>
      <Filter onChangeFunc = {handleFilterNamelist}/>

      <h3>add a new</h3>
      <PersonForm onSubmitFunc = {addContact} personOnChangeFunc = {updateNewName} nameInputValue = {newName}/>

      <h3>Numbers</h3>
      <Persons displayList = {peopleToShow} deleteFunc = {deleteFromForm}/>
    </div>
  )
}

export default App