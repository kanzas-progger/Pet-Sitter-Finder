import axios from "axios"

export const getOwnerPersonal = async () => {
    try {
        const response = await axios.get('https://localhost:5000/api/owners/profile/personal/edit',
            {
                withCredentials: true
            })
        console.log(response)
        return response
    } catch (e) {
        console.error(e)
    }
}

export const getShortOwnerProfile = async (ownerId) => {
    try {
        const response = await axios.get(`https://localhost:5000/api/owners/anonymous/profile/short/${ownerId}`,
            {
                withCredentials: true
            })
        return response
    } catch (e) {
        console.error(e)
    }
}

export const getFullOwnerProfile = async (ownerId) => {
    try {
        const response = await axios.get(
            `https://localhost:5000/api/owners/anonymous/profile/full/${ownerId}`,
            {
                withCredentials: true
            }
        )
        return response
    } catch (e) {
        console.error(e)
    }
}

export const updateOwnerPersonal = async (formData) => {
    try {
        const response = await axios.put(
            "https://localhost:5000/api/owners/profile/personal/edit", formData,
            {
                withCredentials: true
            })
        return response
    } catch (e) {
        console.error(e)
    }
}

export const updateOwnerProfileImage = async (profileImage) => {
    try {
        const formData = new FormData()
        formData.append('profileImage', profileImage)

        const response = await axios.put(
            "https://localhost:5000/api/owners/profile/personal/edit/image", formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
        return response
    } catch (e) {
        console.error(e)
    }
}

export const deleteOwnerProfileImage = async () => {
    try {
        const response = await axios.delete(
            "https://localhost:5000/api/owners/profile/personal/edit/image",
            {
                withCredentials: true
            })
        return response
    } catch (e) {
        console.error(e)
    }
}