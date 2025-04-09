import axios from "axios"

export const getAllOwnerAnimalProfiles = async (ownerId) => {
    try {
        const response = await axios.get(`https://localhost:5000/api/animals/profiles/all/${ownerId}`,
            {
                withCredentials: true
            })
        return response
    } catch (e) {
        console.error(e)
    }
}

export const getShortOwnerAnimalProfilesData = async (animalNames) => {
    try {
        const response = await axios.post('https://localhost:5000/api/animals/profiles/shortProfiles', animalNames, {
            withCredentials: true
        })

        return response
    } catch (e) {
        console.error(e)
    }
}

export const getOwnerAnimalProfileById = async (animalProfileId) => {
    try {
        const response = await axios.get(`https://localhost:5000/api/animals/profiles/${animalProfileId}`,
            {
                withCredentials: true
            })

        return response
    } catch (e) {
        console.error(e)
    }
}

export const createAnimalProfile = async (data) => {

    const formData = new FormData()
    formData.append('animalName', data.animalName)
    formData.append('name', data.name)
    formData.append('birthday', data.birthday)
    formData.append('gender', data.gender)
    if (data.type) {
        formData.append('type', data.type)
    }
    formData.append('count', data.count)

    if (data.description) {
        formData.append('description', data.description)
    }
    if (data.profileImage) {
        formData.append('profileImage', data.profileImage)
    }



    try {
        const response = await axios.post(`https://localhost:5000/api/animals/profiles`,
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
        return response
    } catch (e) {
        console.error(e)
    }
}

export const updateAnimalProfile = async (data) => {

    const formData = new FormData()
    formData.append('animalProfileId', data.animalProfileId)
    formData.append('animalName', data.animalName)
    formData.append('name', data.name)
    formData.append('birthday', data.birthday)
    formData.append('gender', data.gender)
    if (data.type) {
        formData.append('type', data.type)
    }
    formData.append('count', data.count)

    if (data.description) {
        formData.append('description', data.description)
    }
    if (data.profileImage) {
        formData.append('profileImage', data.profileImage)
    }
    formData.append('isProfileImageExist', data.isProfileImageExist)
    if (data.existingProfileImage) {
        formData.append('existingProfileImage', data.existingProfileImage)
    }

    try {
        const response = await axios.put(`https://localhost:5000/api/animals/profiles`,
            formData,
            {
                withCredentials: true
            })
        return response
    } catch (e) {
        console.error(e)
    }

}

export const deleteAnimalProfile = async (animalProfileId) => {
    try {
        await axios.delete(`https://localhost:5000/api/animals/profiles/${animalProfileId}`,
            {
                withCredentials: true
            }
        )
    } catch (e) {
        console.error(e)
    }
}