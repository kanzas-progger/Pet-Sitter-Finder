import axios from "axios"


export const getUnreadNotificationsCount = async (userId) => {
    try {
        const response = await axios.get(`https://localhost:5000/api/notifications/count/${userId}`,
            {
                withCredentials: true
            })
        console.log(response)
        return response
    } catch (e) {
        console.error(e)
    }
}