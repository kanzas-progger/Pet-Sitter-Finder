import axios from "axios"

export const getSitters = async () => {
    try {
        const response = await axios.get('https://localhost:5000/sitters', {}, { withCredentials: true })
        console.log(response)
        return response
    } catch(e)
    {
        console.error(e)
    }  
}