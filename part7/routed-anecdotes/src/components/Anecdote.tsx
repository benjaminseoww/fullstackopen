import { AnecdoteProps } from "../types";
import { useParams } from "react-router";

export const Anecdote = ({ anecdotes } : { anecdotes: AnecdoteProps[] }) => {

    const id = useParams<{ id: string }>().id;
    const anecdote = anecdotes.find(a => a.id === Number(id)) as AnecdoteProps;
    

    return (
        <>
            <h2>{anecdote.content}</h2>
            <p>has {anecdote.votes} votes</p>
            <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
        </>
    )
}