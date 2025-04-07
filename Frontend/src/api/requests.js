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

export const getDisabledDates = async (boardId) => {
    try {
        const response = await axios.get(`https://localhost:5000/api/requests/${boardId}`,
            {
                withCredentials: true
            })
        return response
    } catch (e) {
        console.error(e)
    }
}

export const updateStatus = async (updateData) => {
    try {
        const response = await axios.put('https://localhost:5000/api/requests', updateData,
            {
                withCredentials: true
            })
        return response
    } catch (e) {
        console.error(e)
    }
}

export const deleteRequest = async (requestId) => {
    try {
        const response = await axios.delete(`https://localhost:5000/api/requests/${requestId}`,
            {
                withCredentials: true
            })
        return response
    } catch (e) {
        console.error(e)
    }
}


