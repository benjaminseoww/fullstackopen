const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <b>Number of exercises {sum}</b>

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
    
  )
}
  

const Content = ({ parts }) => {
  return (
    <>
    {parts.map((mod) => {
      return <Part part={mod} />
    })}
    </>
  )
}


const Course = ({course}) => {
  const sum = course.parts.reduce((sum, part)=> {
      return sum + part.exercises
  }, 0)

  return (
    <>
      <Header course={course.name}/>
      <Content parts = {course.parts}/>
      <Total sum = {sum} />
    </>
    
  )
}