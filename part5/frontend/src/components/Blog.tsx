export interface BlogProps {
    title: string,
    author: string,
    url: string,
    likes: number,
    user: string,
    id: string
}

export function Blog({ blog }: {blog : BlogProps}) {
    return (
        <div>
            {blog.title} {blog.author}
        </div>  
    );
}