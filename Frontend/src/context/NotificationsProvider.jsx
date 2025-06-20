import { createContext, useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { getUnreadNotificationsCount } from '../api/notifications'

const NotificationsContext = createContext({})

export const NotificationsProvider = ({ children }) => {
    const { auth } = useAuth()
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        const fetchUnread = async () => {
          try {
            if (!auth?.userId) return
            const response = await getUnreadNotificationsCount(auth?.userId)
            setUnreadCount(response.data)
          } catch (e) {
            console.error('Ошибка при загрузке уведомлений:', e)
          }
        }
        fetchUnread()
      }, [auth?.userId])

    return (
        <NotificationsContext.Provider value={{ unreadCount, setUnreadCount }}>
          {children}
        </NotificationsContext.Provider>
      )
}

export default NotificationsContext