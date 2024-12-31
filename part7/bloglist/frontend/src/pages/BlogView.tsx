import { useState, useEffect } from 'react'
import { Notification } from '../components/Notification'
import NavBar from '../components/NavBar'

import blogServices from '../services/blog'
import userServices from '../services/users'

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { setUser } from '../reducers/userReducer'

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
  comments: string[] | [];
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

    // handle comments
    const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formElems = event.currentTarget
            .elements as typeof event.currentTarget.elements & {
            comment: HTMLInputElement;
        };
        const comment = formElems.comment.value;

        if (id) {
            await blogServices.addComment(id, comment)

            await blogServices.getBlog(id).then(blog => {
                setBlogInfo(blog)
            })
        }
    }

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
                <h2 className="text-2xl font-bold">blogs app</h2>
                {
                    blogInfo ? 
                    <div>
                        <div>
                            <h2 className="text-2xl font-bold">{blogInfo.title} by {blogInfo.author}</h2>
                            <p>{blogInfo.url}</p>
                            <p>{blogInfo.likes} likes <button className="rounded-lg border-2 bg-gray-200 px-3" onClick={incrementLikes}>like</button></p>
                            <p>added by {userInfo?.name}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">comments</h3>
                            <form onSubmit={handleCommentSubmit}>
                                <input className="border-2" type="text" name="comment" placeholder="comment" />
                                <button className="rounded-md border-2 bg-gray-200 px-3">add comment</button>
                            </form>
                            {blogInfo.comments && blogInfo.comments.map((comment, index) => {
                                return <li key={index}>{comment}</li>
                            })}
                        </div>
                    </div> : <>no such blog</>
                }
            </div>
        </div>
    )
}