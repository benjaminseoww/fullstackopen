import React, { useState } from 'react'
import { AnecdoteProps } from '../types'
import { useNavigate } from 'react-router'
import { useField } from './hooks/index'

export const CreateNew = ( {addNew, setNotification} : {
  addNew: (anecdote: Omit<AnecdoteProps, 'id'>) => void
  setNotification: React.Dispatch<React.SetStateAction<string>>
 }) => {

  const contentField = useField('text')
  const authorField = useField('text')
  const infoField = useField('text')

  const navigate = useNavigate()

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addNew({
      content: contentField.value,
      author: authorField.value,
      info: infoField.value,
      votes: 0
    })

    navigate('/')

    setNotification(`a new anecdote ${contentField.value} created!`)
    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  const handleReset = (e : React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    contentField.reset(e)
    authorField.reset(e)
    infoField.reset(e)
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' value={contentField.value} onChange={contentField.onChange} />
        </div>
        <div>
          author
          <input name='author' value={authorField.value} onChange={authorField.onChange} />
        </div>
        <div>
          url for more info
          <input name='info' value={infoField.value} onChange={infoField.onChange} />
        </div>
        <button type="submit">create</button>
        <button type="reset" onClick={handleReset}>reset</button>
      </form>
    </div>
  )

}