import { createSlice } from '@reduxjs/toolkit'
import { AppDispatch } from '../store'
import loginService from '../services/login';

const initialState = null as User | null;

export interface User {
    name: string;
    token: string;
    username: string;
  }

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            return action.payload
        },
        removeUser: (state) => {
            return null
        }
    }
})


const { actions, reducer } = userSlice
export const { setUser, removeUser} = actions

export const login = (username: string, password: string) => {
    return async (dispatch: AppDispatch) => {
        const user : User = await loginService.login(username, password)
        dispatch(setUser(user))
        window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
    }
}

export const logout = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(removeUser())
        window.localStorage.removeItem("loggedBlogappUser");
    }
}

export default reducer