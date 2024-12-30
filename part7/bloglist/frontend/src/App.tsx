import { useEffect } from "react";

import { Blog } from "./components/Blog.tsx";
import { Notification } from "./components/Notification.tsx";
import BlogCreateForm from "./components/BlogCreateForm.tsx";
import AltToggable from "./components/AltToggable.tsx";

import blogServices from "./services/blog.ts";

import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'
import { showNotification } from "./reducers/notificationReducer.ts";
import { initialiseBlogs, createNew, likeBlog, deleteBlog } from "./reducers/blogsReducer.ts";
import { login, logout, setUser } from "./reducers/userReducer.ts";

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

    try {
      dispatch(login(username, password))
    } catch (error) {
      notify(`wrong username or password`, "error");
    }
  };

  // logout
  const handleLogout = () => {
    dispatch(logout())
  };

  // blog creation
  const handleCreateBlog = async (
    title: string,
    author: string,
    url: string,
  ) => {
    dispatch(createNew(title, author, url))
    notify(
      `a new blog ${title} by ${author} added`,
      "success",
    );
  };

  // blog likes
  const handleLike = async (id: string) => {
    dispatch(likeBlog(id))
  };

  // blog deletion
  const handleDelete = async (id: string) => {
    dispatch(deleteBlog(id))
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
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
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in
        <button id="logout-button" onClick={handleLogout}>
          logout
        </button>
      </p>
      <AltToggable showButtonLabel="new note">
        <BlogCreateForm handleCreateBlog={handleCreateBlog} />
      </AltToggable>
      {blogs.slice().map((blog) => {
        const newBlog = {
          ...blog,
          likeFunction: handleLike,
          deleteFunction: handleDelete,
        }
        return <Blog key={newBlog.id} blog={newBlog} user={user} />;
      })}
    </div>
  );
}
