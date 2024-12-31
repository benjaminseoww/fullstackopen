import { useSelector } from 'react-redux'
import type { RootState } from '../store'

interface NotificationProps {
  message: string;
  type: string;
}

export function Notification() {
  const notification = useSelector((state : RootState) => state.notification)
  const isNotificationEmpty = notification === null

  if (notification === null) {
    return null;
  }

  const style = {
    color: notification.type === "error" ? "red" : "green",
    borderColor: notification.type === "error" ? "red" : "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return (
    <div style={style} id="notification">
      {!isNotificationEmpty && notification.message}
    </div>
  );
}
