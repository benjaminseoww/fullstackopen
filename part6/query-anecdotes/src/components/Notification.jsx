import { useContext } from 'react'
import { NotificationContext } from '../notificationContext'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  const notification = useContext(NotificationContext)
  const isNotificationNull = notification === null

  if (isNotificationNull) {
    return null
  }
  
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
