import { useEffect } from "react";
import { createNotificationHubConnection } from "../hubs/notificationHub";
import useAuth from "./useAuth";
import useNotificationsCount from "./useNotificationsCount";

const useNotificationHub = () => {
    const { auth } = useAuth()
    const {unreadCount, setUnreadCount} = useNotificationsCount()

    useEffect(() => {
        if (!auth?.token) return
    
        const connection = createNotificationHubConnection(auth.token)
    
        connection.start()
          .then(() => {
            console.log('NotificationHub connected.')
          })
          .catch(e => {
            console.error('NotificationHub connection error:', e)
          })
    
        connection.on('ReceiveNotification', data => {
          console.log('🔔 Notification received:', data)
          let newUnreadCount = unreadCount + 1
          setUnreadCount(newUnreadCount)
        })
    
        // connection.on('UpdateUnreadNotificationsCount', count => {
        //   console.log('🔄 Unread count updated:', count)
        // })
    
        return () => {
          connection.stop()
        }
      }, [auth.token])
}

export default useNotificationHub