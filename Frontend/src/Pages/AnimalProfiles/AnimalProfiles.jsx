import React from 'react'
import ProfileLayout from '../../Components/Layout/ProfileLayout'
import EditAnimalProfiles from '../../Components/EditAnimalProfiles/EditAnimalProfiles'

const AnimalProfiles = () => {
    return (
        <>
            <ProfileLayout>
                <>
                   <EditAnimalProfiles />
                </>
            </ProfileLayout>
        </>

    )
}

export default AnimalProfiles