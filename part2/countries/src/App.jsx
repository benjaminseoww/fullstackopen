import { useState, useEffect } from 'react';

const CountryForm = () => {
  return (
    <>
      find countries <input value = {countryQuery}/>
    </>
  )
}

const Countries = () => {
  return (
    <div>
      list of countries here....
    </div>
  )
}

const App = () => {
  
  return (
    <div>
      <CountryForm/>
      <Countries/>
    </div>
  )
}

export default App