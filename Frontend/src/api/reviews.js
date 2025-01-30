import axios from "axios"

export const createReview = async (fromData) => {
    try {
        const response = await axios.post('https://localhost:5000/api/reviews/create',
            fromData,
            {
                withCredentials: true
            })
        return response
    } catch (e) {
        console.error(e)
    }
}

export const deleteReview = async (formData) => {
    try {
        const response = await axios.delete(
            'https://localhost:5000/api/reviews/delete',
            {
                data: formData,
                withCredentials: true
            })
        return response
        
    } catch (e) {
        console.error(e)
    }
}