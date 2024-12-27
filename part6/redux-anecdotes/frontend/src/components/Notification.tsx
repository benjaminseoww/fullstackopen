import { useSelector } from 'react-redux'
import type { RootState } from '../store'

const Notification = () => {
  const notification = useSelector((state : RootState) => state.notification)
  const isNotificationEmpty = notification === null

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  if (isNotificationEmpty) {
    return null
  }
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification