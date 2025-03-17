import axios from "axios"


export const getAllFilteredBoards = async (filterData) => {
    try {
        const response = await axios.post('https://localhost:5000/api/boards/anonymous/filtered', filterData,
            {
                withCredentials: true
            })
        return response
    } catch (e) {
        console.error(e)
    }
}


export const getBoardsForSitter = async (sitterId) => {
    try {
        const response = await axios.get(`https://localhost:5000/api/boards/anonymous/${sitterId}`,
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

export const updateBoard = async (data) => {
    try {
        const response = await axios.put('https://localhost:5000/api/boards', data,
            {
                withCredentials: true
            })

        return response
    } catch (e) {
        console.error(e)
    }
}

export const deleteBoard = async (boardId) => {
    try {
        await axios.delete(`https://localhost:5000/api/boards/${boardId}`,
            {
                withCredentials: true
            })

    } catch (e) {
        console.error(e)
    }
}