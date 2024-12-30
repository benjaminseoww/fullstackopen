import { NavLink } from "react-router"

export const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <nav>
      <NavLink to="/" style={padding}>anecdotes</NavLink>
      <NavLink to="/create" style={padding}>create new</NavLink>
      <NavLink to="/about" style={padding}>about</NavLink>
    </nav>
  )
}