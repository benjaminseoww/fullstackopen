import { useState } from 'react'

export const useField = (type : string) => {
  const [value, setValue] = useState('')

  const onChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const reset = (event : React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}