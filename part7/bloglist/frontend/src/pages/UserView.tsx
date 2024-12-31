import { useState, useEffect } from 'react'
import { Notification } from '../components/Notification'
import NavBar from '../components/NavBar'

import userServices from '../services/users'

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { setUser } from '../reducers/userReducer'

import { useNavigate, useParams } from "react-router";

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
    id: string;
}

export default function User() {

    const user = useSelector((state : RootState) => state.user)
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
            userServices.setToken(userInfo.token);
        }
    }, []);

    // get user info
    useEffect(() => {
        if (id) {
            userServices.get(id).then(user => {
                setUserInfo(user)
            })
        }
    }, []);

    if (!user) {
        return (
            <p>you are not logged in</p>
        )
    }

    return (
         <div>
            <NavBar/>
            <div className="container px-8">
                <Notification />
                <h2 className="text-2xl font-bold">{userInfo?.name}</h2>
                <h3 className="text-lg font-bold">added blogs</h3>
                <ul>
                    {userInfo?.blogs.map(blog => (
                        <li key={blog.id}>{blog.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}