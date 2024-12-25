import { useState, useEffect } from 'react'
import { BlogProps, Blog } from './components/Blog.tsx'
import { NotificationProps, Notification } from './components/Notification.tsx'
import BlogCreateForm from './components/BlogCreateForm.tsx'
import blogServices from './services/blog.ts'
import loginServices from './services/login.ts'
import AltToggable from './components/AltToggable.tsx'

interface User {
  name: string,
  token: string,
  username: string
}

export default function App() {
  const [blogs, setBlogs] = useState<Array<BlogProps>>([])
  const [blogChanged, setBlogChanged] = useState<boolean>(false) // ensure no infinite loop for getting all blogs
  const [user, setUser] = useState<User | null>(null)
  const [notification, setNotification] = useState<NotificationProps | null>(null)

  useEffect(() => {
    blogServices.getAllBlogs().then((blogs : Array<BlogProps>) =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )  
  }, [blogChanged])

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
  // login
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

  // logout
  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedNoteappUser')
  }

  // blog creation
  const handleCreateBlog = async (title: string, author: string, url: string) => {
    const response = await blogServices.createBlog(title, author, url)
    setBlogs(blogs.concat(response))
    notify(`a new blog ${response.title} by ${response.author} added`, 'success')
  }

  // blog likes
  const handleLike = async (id: string) => {
    await blogServices.likeBlog(id)
    setBlogChanged(!blogChanged)
  }

  // blog deletion
  const handleDelete = async (id: string) => {
    await blogServices.deleteBlog(id)
    setBlogChanged(!blogChanged)
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
        <button id="logout-button" onClick={handleLogout}>logout</button>
      </p>
      <AltToggable showButtonLabel='new note'>
        <BlogCreateForm handleCreateBlog={handleCreateBlog} />
      </AltToggable>
      {blogs.map((blog) => {
        blog.likeFunction = handleLike
        blog.deleteFunction = handleDelete
        return (
          <Blog key={blog.id} blog={blog} user={user} />
        )
      })}
    </div>
  )
}
