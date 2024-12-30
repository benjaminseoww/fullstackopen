import { createSlice } from '@reduxjs/toolkit'
import { NotificationProps } from '../components/Notification'
import { AppDispatch } from '../store'

const initialState = null

const notificationSlice = createSlice({
    name: 'notification',
    initialState: initialState as NotificationProps | null,
    reducers: {
        setNotification: (state, action) => {
            return action.payload
        },
        clearNotification: () => initialState
    },
  })

const { actions, reducer } = notificationSlice
export const { setNotification, clearNotification } = actions

export const showNotification = (message : string, type: string, time : number) => {
    return async (dispatch: AppDispatch) => {
        dispatch(setNotification({message, type}))
        setTimeout(() => {
            dispatch(clearNotification())
        }, time * 1000)
      }
  }

export default reducer