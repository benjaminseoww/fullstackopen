import { useState, useEffect } from 'react'
import {BlogProps, Blog} from './components/Blog.tsx'
import {NotificationProps, Notification} from './components/Notification.tsx'
import blogServices from './services/blog.ts'
import loginServices from './services/login.ts'

interface User {
  name: string,
  token: string,
  username: string
}

export default function App() {
  const [blogs, setBlogs] = useState<Array<BlogProps>>([])
  const [user, setUser] = useState<User | null>(null)
  const [notification, setNotification] = useState<NotificationProps | null>(null)

  useEffect(() => {
    blogServices.getAllBlogs().then((blogs : Array<BlogProps>) =>
      setBlogs( blogs )
    )  
  }, [blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogServices.setToken(user.token)
    }
  }, [])

  // handle notification
  const notify = (message : string, type : string) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  // event handlers
  const handleLogin = async(event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElems = event.currentTarget.elements as typeof event.currentTarget.elements & {
      username: HTMLInputElement,
      password: HTMLInputElement
    }
  
    const username = formElems.username.value
    const password = formElems.password.value
  
    try {
      const user = await loginServices.login(username, password)
      setUser(user)
      blogServices.setToken(user.token)
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 
    } catch (error) {
      notify(`wrong username or password`, 'error')
    } 
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedNoteappUser')
  }

  const handleCreateBlog = async(event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElems = event.currentTarget.elements as typeof event.currentTarget.elements & {
        title: HTMLInputElement,
        author: HTMLInputElement,
        url: HTMLInputElement
    }
    const title = formElems.title.value
    const author = formElems.author.value
    const url = formElems.url.value

    const response = await blogServices.createBlog(title, author, url)
    setBlogs(blogs.concat(response))

    notify(`a new blog ${response.title} by ${response.author} added`, 'success')
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {notification != null && <Notification notification={notification} />}
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">username: </label>
            <input type="text" name="username" required />
          </div>
          <div>
            <label htmlFor="password">password: </label>
            <input type="text" name="password" required />
          </div>
          <div>
            <input type="submit" value="Login!" />
          </div>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {notification != null && <Notification notification={notification} />}
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <h2>create new</h2>
      <form onSubmit={handleCreateBlog}>
          <div>
            <label htmlFor="title">title: </label>
            <input type="text" name="title" required />
          </div>
          <div>
            <label htmlFor="author">author: </label>
            <input type="text" name="author" required />
          </div>
          <div>
            <label htmlFor="url">url: </label>
            <input type="text" name="url" required />
          </div>
          <div>
            <input type="submit" value="create" />
          </div>
        </form>
      {blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
    </div>
  )
}
