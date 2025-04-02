import axios from "axios"

export const createRequest = async (fromData) => {
    try {
        const response = await axios.post('https://localhost:5000/api/requests',
            fromData,
            {
                withCredentials: true
            })
        return response
    } catch (e) {
        console.error(e)
    }
}

export const getRequests = async () => {
    try {
        const response = await axios.get('https://localhost:5000/api/requests',
            {
                withCredentials: true
            })
        return response
    } catch (e) {
        console.error(e)
    }
}
