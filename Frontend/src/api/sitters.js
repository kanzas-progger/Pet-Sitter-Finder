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

export const getSitterPersonal = async () => {
    try {
        const response = await axios.get('https://localhost:5000/api/sitters/profile/personal/edit',
            {
                withCredentials: true
            })
        console.log(response)
        return response
    } catch (e) {
        console.error(e)
    }
}

export const updateSitterPersonal = async (formData) => {
    try {
        const response = await axios.put(
            "https://localhost:5000/api/sitters/profile/personal/edit", formData,
            {
                withCredentials: true
            })
        return response
    } catch (e) {
        console.error(e)
    }
}

export const updateSitterProfileImage = async (profileImage) => {
    try {
        const formData = new FormData()
        formData.append('profileImage', profileImage)

        const response = await axios.put(
            "https://localhost:5000/api/sitters/profile/personal/edit/image", formData,
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

export const uploadSitterProfilePhotos = async (profilePhotos) => {
    try {
        const formData = new FormData();

        profilePhotos.forEach((photo) => {
            formData.append(`profilePhotos`, photo); 
        });

        const response = await axios.post(
            "https://localhost:5000/api/sitters/profile/personal/edit/photos", 
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response;
    } catch (e) {
        console.error(e);
    }
}

export const deleteSitterProfilePhoto = async (photoUrl) => {
    try {
        const response = await axios.delete("https://localhost:5000/api/sitters/profile/delete/photo", 
        {
            data: { photoUrl },
            withCredentials: true,
        });
        return response
    } catch (e) {
        console.error(e)
    }
}

export const deleteSitterProfileImage = async () => {
    try {
        const response = await axios.delete(
            "https://localhost:5000/api/sitters/profile/personal/edit/image",
            {
                withCredentials: true
            })
        return response
    } catch (e) {
        console.error(e)
    }
}

export const getFullSitterProfile = async (sitterId) => {
    try {
        const response = await axios.get(
            `https://localhost:5000/api/sitters/${sitterId}`,
            {
                withCredentials: true
            }
        )
        return response
    } catch (e) {
        console.error(e)
    }
}