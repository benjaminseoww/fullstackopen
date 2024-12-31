import { useState, useEffect } from 'react'
import { Notification } from '../components/Notification'
import NavBar from '../components/NavBar'

import userServices from '../services/users'

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { setUser } from '../reducers/userReducer'

import { useNavigate, Link } from "react-router";

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

export default function UsersList() {

    const user = useSelector((state : RootState) => state.user)
    const [users, setUsers] = useState<UserProps[]>([])
    const dispatch = useDispatch() as AppDispatch

    let navigate = useNavigate();    

    // keep users log in
    useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
        if (loggedUserJSON) {
            const userInfo = JSON.parse(loggedUserJSON);
            dispatch(setUser(userInfo));
            userServices.setToken(userInfo.token);
        }
    }, []);

    // fetching users in db
    useEffect(() => {
        userServices.getAll().then(users => {
            setUsers(users)
        })
    }, []);

    if (!user) {
        return (
            <p>you are not logged in</p>
        )
    }

    return (
        <div>
            <NavBar />
            <div className="container px-8">
                <Notification />
                <h2 className="text-2xl font-bold" >Users</h2>
                <table>
                    <thead>
                    <tr>
                        <th></th>
                        <th>blogs created</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td><Link className="text-blue-600" to={user.id}>{user.name}</Link></td>
                            <td>{user.blogs.length}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}