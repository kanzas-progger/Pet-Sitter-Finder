import { useContext } from "react"
import NotificationsContext from "../context/NotificationsProvider"

const useNotificationsCount = () => {
  return useContext(NotificationsContext)
}

export default useNotificationsCount