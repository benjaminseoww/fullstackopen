import React from "react";

interface BlogCreateFormProps {
  handleCreateBlog: (
    title: string,
    author: string,
    url: string,
  ) => Promise<void>;
}

function BlogCreateForm(props: BlogCreateFormProps) {
  const createBlog = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElems = event.currentTarget
      .elements as typeof event.currentTarget.elements & {
      title: HTMLInputElement;
      author: HTMLInputElement;
      url: HTMLInputElement;
    };
    const title = formElems.title.value;
    const author = formElems.author.value;
    const url = formElems.url.value;
    await props.handleCreateBlog(title, author, url);
  };

  return (
    <>
      <h2 className="text-lg font-bold">create new</h2>
      <form onSubmit={createBlog}>
        <div>
          <label htmlFor="title">title: </label>
          <input className="border-2" type="text" id="title" name="title" required />
        </div>
        <div>
          <label htmlFor="author">author: </label>
          <input className="border-2" type="text" id="author" name="author" required />
        </div>
        <div>
          <label htmlFor="url">url: </label>
          <input className="border-2" type="text" id="url" name="url" required />
        </div>
        <div>
          <input className="rounded-lg border-2 bg-gray-200 px-4" type="submit" value="create" />
        </div>
      </form>
    </>
  );
}

export default BlogCreateForm;
