import React from 'react'
import ProfileLayout from '../../Components/Layout/ProfileLayout'
import EditAnimals from '../../Components/EditAnimals/EditAnimals'

const Animals = () => {
    return (
        <>
            <ProfileLayout>
                <EditAnimals />
            </ProfileLayout>
        </>
    )
}

export default Animals