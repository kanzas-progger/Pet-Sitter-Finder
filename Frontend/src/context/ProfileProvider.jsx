import React from 'react'
import { createContext, useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { getOwnerPersonal } from '../api/owners'
import { getSitterPersonal } from '../api/sitters'

const ProfileContext = createContext({})

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState({})
    const { auth } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            try {

                if (auth?.role?.includes('Owner')) {
                    const response = await getOwnerPersonal()
                    console.log("Из провайдера данные:")
                    console.log(response.data)
                    setProfile(response.data)
                }
                else if (auth?.role?.includes('Sitter'))
                {
                    const response = await getSitterPersonal()
                    console.log("Данные ситтера")
                    console.log(response.data)
                    setProfile(response.data)
                }
                else {
                    console.log('Роль другая') // getSitterPersonal()
                }

            } catch (e) {
                console.error(e)
            }
        }
        fetchData()
    }, [])

    return (
        <ProfileContext.Provider value={{ profile, setProfile }}>
            {children}
        </ProfileContext.Provider>
    )
}


export default ProfileContext