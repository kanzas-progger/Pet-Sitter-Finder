import axios from "axios"

export const getBoardsForSitter = async (sitterId) => {
    try {
        const response = await axios.get(`https://localhost:5000/api/boards/${sitterId}`,
            {
                withCredentials: true
            })
        return response
    } catch (e) {
        console.error(e)
    }
}

export const createBoard = async (data) => {
    try {
        const response = await axios.post('https://localhost:5000/api/boards', data,
            {
                withCredentials: true
            })
        
        return response
    } catch (e) {
        console.error(e)
    }
}