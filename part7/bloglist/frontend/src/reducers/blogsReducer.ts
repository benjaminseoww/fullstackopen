import { createSlice } from '@reduxjs/toolkit'
import { AppDispatch } from '../store'
import { BlogProps } from '../components/Blog'
import blogServices from '../services/blog'

const initialState = [] as Array<BlogProps>

const blogsSlice = createSlice({
    name: 'notification',
    initialState: initialState,
    reducers: {
        setBlogs: (state, action) => {
            return action.payload
        },
        appendBlog: (state, action) => {
            return [...state, action.payload]
        },
        like: (state, action) => {
            const blogLiked = state.find(b => b.id === action.payload.id)

            if (!blogLiked) {
                return state
            }

            const newBlog = {
                ...blogLiked,
                likes: blogLiked.likes + 1
            }
            return state.map(b => b.id !== action.payload.id ? b : newBlog).slice().sort((a, b) => b.likes - a.likes)
        },
        deleteBlogAction: (state, action) => {
            return state.filter(b => b.id !== action.payload.id)
        }
    }
  })

const { actions, reducer } = blogsSlice
export const { setBlogs, appendBlog, like, deleteBlogAction } = actions

export const initialiseBlogs = () => {
    return async (dispatch: AppDispatch) => {
        const blogs : BlogProps[] = await blogServices.getAllBlogs()
        dispatch(setBlogs(blogs.slice().sort((a, b) => b.likes - a.likes)))
    }
}

export const createNew = (title : string, author : string, url : string) => {
    return async (dispatch: AppDispatch) => {
        const newBlog = await blogServices.createBlog(title, author, url)
        dispatch(appendBlog(newBlog))
    }
}

export const likeBlog = (id : string) => {
    return async (dispatch: AppDispatch) => {
        await blogServices.likeBlog(id)
        dispatch(like({id}))
    }
}

export const deleteBlog = (id : string) => {
    return async (dispatch: AppDispatch) => {
        await blogServices.deleteBlog(id)
        dispatch(deleteBlogAction({id}))
    }
}

export default reducer