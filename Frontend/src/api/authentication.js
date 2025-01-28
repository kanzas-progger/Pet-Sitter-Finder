import axios from "axios"

export const getUserIdWithRoles = async (login) => {
    try {
        const response = await axios.get(`https://localhost:5000/authentication/${login}`,
            {
                withCredentials: true
            })
        console.log(response)
        return response
    } catch (e) {
        console.error(e)
    }
}