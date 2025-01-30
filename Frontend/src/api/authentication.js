import axios from "axios"

export const getUserIdWithRoles = async (login) => {
    try {
        const response = await axios.get(`https://localhost:5000/authentication/user/${login}`,
            {
                withCredentials: true
            })
        return response
    } catch (e) {
        console.error(e)
    }
}