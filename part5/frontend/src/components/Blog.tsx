import { useState } from 'react';
import PropTypes from 'prop-types';

interface UserProps {
    username: string,
    name: string,
    id: string
}

export interface BlogProps {
    title: string,
    author: string,
    url: string,
    likes: number,
    user: UserProps,
    id: string,
    likeFunction: (id: string) => void,
    deleteFunction: (id: string) => void
}

export const Blog = ({blog, user} : {blog: BlogProps, user: {
    name: string,
    token: string,
    username: string
  }}) => {
    const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
    const showWhenVisible = { display: detailsVisible ? '' : 'none' }
    const buttonLabel = detailsVisible ? 'hide' : 'view';
    const isSameUser = blog.user.username === user.username;

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const toggleVisibility = () => {
        setDetailsVisible(!detailsVisible);
    }

    const incrementLikes = async (event : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        await blog.likeFunction(blog.id);
    }

    const deleteBlog = async (event : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
            await blog.deleteFunction(blog.id);
        }
    }

    return (
        <div style={blogStyle} className="blog">
            <div className="blogDefaultView">
                {blog.title} {blog.author} <button onClick = {toggleVisibility}> {buttonLabel} </button>
            </div>
            <div className="blogToggledView" style = {showWhenVisible}>
                {blog.url} <br/>
                likes {blog.likes} <button onClick={incrementLikes}>like</button> <br/>
                {blog.user.name} <br/>
                {isSameUser && <button onClick={deleteBlog}>remove</button>}
            </div>
        </div>  
    );
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired
}

export default Blog;