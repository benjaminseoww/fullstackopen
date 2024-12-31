import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { logout } from '../reducers/userReducer'

import { NavLink } from "react-router";

export default function NavBar() {
    const dispatch = useDispatch() as AppDispatch
    const user = useSelector((state : RootState) => state.user)

    if (!user) {
        return null;
    }
    
    const handleLogout = () => {
        dispatch(logout())
    };
    
    return (
        <div className="navbar flex flex-row items-center bg-slate-300 py-2">
            <div className='inline-block px-4'><NavLink to="/">blogs</NavLink></div>
            <div className='inline-block px-4'><NavLink to="/user">users</NavLink></div>
            <div className='inline-block px-4'>{user.name} logged in</div>
            <button className='inline-block px-4 py-1 bg-gray-200 rounded' onClick={handleLogout}>logout</button>
        </div>
    );
}