import { useEffect } from "react";

import { Blog } from "./components/Blog.tsx";
import { Notification } from "./components/Notification.tsx";
import BlogCreateForm from "./components/BlogCreateForm.tsx";
import AltToggable from "./components/AltToggable.tsx";
import NavBar from "./components/NavBar.tsx";

import blogServices from "./services/blog.ts";

import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'
import { showNotification } from "./reducers/notificationReducer.ts";
import { initialiseBlogs, createNew, deleteBlog } from "./reducers/blogsReducer.ts";
import { login, setUser } from "./reducers/userReducer.ts";

export default function App() {
  const dispatch = useDispatch() as AppDispatch
  const blogs = useSelector((state : RootState) => state.blogs)
  const user = useSelector((state : RootState) => state.user)

  useEffect(() => {
    dispatch(initialiseBlogs())
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const userInfo = JSON.parse(loggedUserJSON);
      dispatch(setUser(userInfo));
      blogServices.setToken(userInfo.token);
    }
  }, []);

  // handle notifications
  const notify = (message: string, type: string) => {
    dispatch(showNotification(message, type, 5))
  };

  // event handlers
  // login
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElems = event.currentTarget
      .elements as typeof event.currentTarget.elements & {
      username: HTMLInputElement;
      password: HTMLInputElement;
    };

    const username = formElems.username.value;
    const password = formElems.password.value;

    const response = await dispatch(login(username, password))
    
    if (response.error) {
      notify(`wrong username or password`, "error");
    }
  };

  // blog creation
  const handleCreateBlog = async (
    title: string,
    author: string,
    url: string,
  ) => {
    dispatch(createNew(title, author, url))
    notify(
      `a new blog "${title}" by ${author} added`,
      "success",
    );
  };

  // blog deletion
  const handleDelete = async (id: string) => {
    dispatch(deleteBlog(id))
  };

  if (user === null) {
    return (
      <div className="container px-8">
        <h2 className="text-2xl font-bold">Log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">username: </label>
            <input className="border-2" type="text" name="username" required />
          </div>
          <div>
            <label htmlFor="password">password: </label>
            <input className="border-2" type="text" name="password" required />
          </div>
          <div>
            <input className="rounded-lg border-2 bg-gray-200 px-4" type="submit" value="Login!" />
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <NavBar/>
      <div className="container px-8">
        <Notification />
        <h2 className="text-2xl font-bold">blogs app</h2>
        <AltToggable showButtonLabel="new note">
          <BlogCreateForm handleCreateBlog={handleCreateBlog} />
        </AltToggable>
        {blogs.slice().map((blog) => {
          const newBlog = {
            ...blog,
            deleteFunction: handleDelete,
          }
          return <Blog key={newBlog.id} blog={newBlog} />;
        })}
      </div>
    </div>
  );
}
