import PropTypes from "prop-types";

import { Link } from "react-router";

export interface UserProps {
  username: string;
  name: string;
  id: string;
}

export interface BlogProps {
  title: string;
  author: string;
  url: string;
  likes: number;
  user: UserProps;
  id: string;
  likeFunction: (id: string) => void;
  deleteFunction: (id: string) => void;
}

export const Blog = ({
  blog,
  user,
}: {
  blog: BlogProps;
  user: {
    name: string;
    token: string;
    username: string;
  };
}) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle} className="blog">
      <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
};

export default Blog;
