import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Country {
  found : boolean,
  data : {
    name : string,
    capital : string,
    population : number,
    flag : string
  }
}

const useField = (type : string) => {
  const [value, setValue] = useState('')

  const onChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name : string) => {
  const [country, setCountry] = useState<Country | null>(null)

  useEffect(() => {
    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then(response => {
        const data = response.data
        setCountry({found: true, data: {name: data.name.common, capital: data.capital[0], population: data.population, flag: data.flags.png}})
      }).catch(err => {
        setCountry({found: false, data: {name: '', capital: '', population: 0, flag: ''}})
      })
  }, [name])

  return country
}

const Country = ({ country } : {
  country : Country | null
}) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div> 
      <img src={country.data.flag} height='100' alt={`flag of ${country.data.name}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e : React.FormEvent) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App
