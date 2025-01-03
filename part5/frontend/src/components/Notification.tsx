export interface NotificationProps {
    message: string,
    type: string
}

export function Notification({ notification } : { notification: NotificationProps}) {
    if (notification === null) {
        return null;
    }

    const style = {
        color: notification.type==='error' ? 'red' : 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    return (
        <div style={style} id="notification">
            {notification.message}
        </div>  
    );
}