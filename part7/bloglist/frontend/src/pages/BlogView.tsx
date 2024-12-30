import { useState, useEffect } from 'react'
import { Notification } from '../components/Notification'

import blogServices from '../services/blog'
import userServices from '../services/users'

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { logout, setUser } from '../reducers/userReducer'

import { useNavigate, useParams } from "react-router";
import { likeBlog } from '../reducers/blogsReducer'

interface UserProps {
    username: string;
    name: string;
    id: string;
    blogs: BlogProps[];
}
  
interface BlogProps {
  title: string;
  author: string;
  url: string;
  likes: number;
  user: string;
  id: string;
}

export default function BlogView() {

    const user = useSelector((state : RootState) => state.user)
    const [blogInfo, setBlogInfo] = useState<BlogProps | null>(null)
    const [userInfo, setUserInfo] = useState<UserProps | null>(null)
    const dispatch = useDispatch() as AppDispatch
    let navigate = useNavigate();
    let { id } = useParams();

    // keep users log in
    useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
        if (loggedUserJSON) {
            const userInfo = JSON.parse(loggedUserJSON);
            dispatch(setUser(userInfo));
            blogServices.setToken(userInfo.token);
        }
    }, []);


    const handleLogout = () => {
        dispatch(logout())
        navigate('/')
    };

    // get blog info
    useEffect(() => {
        if (id) {
            blogServices.getBlog(id).then(blog => {
                setBlogInfo(blog)
                userServices.get(blog.user).then(user => {
                    setUserInfo(user)
                })
            })
        }
    }, []);

    // handle liks
    const incrementLikes = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      ) => {
        event.preventDefault();

        if (id) {
            await dispatch(likeBlog(id))

            await blogServices.getBlog(id).then(blog => {
                setBlogInfo(blog)
            })
        }
      };

    if (!user) {
        return (
            <p>you are not logged in</p>
        )
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
            {
                blogInfo ? 
                <div>
                    <h2>{blogInfo.title} by {blogInfo.author}</h2>
                    <p>{blogInfo.url}</p>
                    <p>{blogInfo.likes} likes <button onClick={incrementLikes}>like</button></p>
                    <p>added by {userInfo?.name}</p>
                </div> : <>no such blog</>
            }
        </div>
    )
}