import React, { useState, useEffect } from 'react';
import axios from 'axios';

const URL: string = 'https://studies.cs.helsinki.fi/restcountries/api/'


// types
type SearchProps = {
  onChangeFunc: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type ResultsProps = {
  displayList: string[];
};

interface Country {
  name: {
    common: string;
  };
  capital: string[];
  area: number;
  languages: {
    [key: string]: string;
  };
  flags: {
    png: string;
    svg: string;
    alt: string;
  }
}

// components
const CountryData: React.FC<{country: string}> = ({country}) => {
  const [data, setData] = useState<Country | null>(null);

  useEffect(() => {
    axios.get<Country>(URL + 'name/' + country)
      .then(response => {
        setData(response.data);
      }).catch(
        (error) => console.log("error fetching country data", error) 
      );
  }, [country]);

  if (data === null) {
    return <p>Loading...</p>
  }

  return (
    <>
      <h1>{country}</h1>
      <div>
        capital: {data.capital[0]}
        <br />
        area: {data.area}
      </div>
      <h2>languages:</h2>
      <ul>
        {Object.entries(data.languages).map(([key, value]) => <li key = {key}>{value}</li>)}
      </ul>
      <img src={data.flags.png}/>
    </>
  );
}

const Search: React.FC<SearchProps> = ({onChangeFunc}) => {

  return (
    <>
      <label htmlFor="search_text">find countries </label>
      <input type="text" name="search_text" id="search_text" onChange={onChangeFunc}/>
    </>
  );
}

const Results: React.FC<ResultsProps> = ({ displayList }) => {

  const [currentCountryData, setCurrentCountryData] = useState<string | null>(null);

  const onClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    const countryName: string = event.currentTarget.value;
    setCurrentCountryData(countryName);
  }


  if (displayList.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (displayList.length > 1) {

    return (
      <>   
        {displayList.map((country) => {
          return (
            <div key={country}>
              {country} <button type = 'button' value={country} onClick = {onClick}>show</button>
            </div>
          );
        })}
        {currentCountryData !== null && displayList.includes(currentCountryData) ? <CountryData country={currentCountryData}/> : <></>}
      </>
    );

  } else if (displayList.length === 1) {
    const countryName: string = displayList[0];
    return <CountryData country={countryName} />
  } else {
    return <p>no matches</p>
  }

}

const App: React.FC = () => {
  const [countries, setCountries] = useState<string[]>([]);
  const [searchText, setFilterElement] = useState('');

  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    console.log(`searchText is now ${text}`);
    setFilterElement(text);
  }

  // get all countries into a single string[] when loading,
  useEffect(() => {
    axios.get<Country[]>(URL + 'all')
      .then(response => {
        const initialList: Country[] = response.data;
        const parsedCountries = initialList.map((country: Country) => country.name.common);
        setCountries(parsedCountries);
      }).catch(
        (error) => console.log("error fetching countries", error) 
      );

  }, [countries])

    // filtering country based on search text
  const filteredCountries: string[] = countries.filter(country => country.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <>
      <Search onChangeFunc={handleSearch} />
      <Results displayList = {filteredCountries}/>
    </>
  )
}

export default App
