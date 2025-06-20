import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { Box, Typography } from '@mui/material';
import { getShortSitterProfile } from '../../api/sitters';
import { getShortOwnerProfile } from '../../api/owners';
import useAuth from '../../hooks/useAuth';
import { useState, useEffect } from 'react';

const NotificationCard = () => {

    const [shortProfile, setShortProfile] = useState(null)
    const { auth, setAuth } = useAuth()

    // useEffect(() => {
    //         const fetchData = async () => {
    //             try {
    //                 if (auth?.role?.includes('Sitter')) {
    //                     const response = await getShortOwnerProfile(ownerId)
    //                     setShortProfile(response.data) //firstname lastname login
    //                 } else {
    //                     const response = await getShortSitterProfile(sitterId)
    //                     setShortProfile(response.data)
    //                 }
    //             } catch (e) {
    //                 console.error(e)
    //             }
    //         }
    //         fetchData()
    //     }, [])

    const NotificationTypes = {
        Accept: {
            icon: CheckCircleIcon,
            color: 'green',
            text: 'Ситтер Дмитрий Иванов принял вашу заявку на передержку'
        },
        Reject: {
            icon: CancelIcon,
            color: '#f44336',
            text: 'Ситтер Дмитрий Иванов отклонил вашу заявку на передержку'
        },
        RejectByOwner: {
            icon: CancelIcon,
            color: '#f44336',
            text: 'Овнер Иван Иванов отозвал свою заявку на передержку'
        },
        New: {
            icon: NewReleasesIcon,
            color: '#4D7298',
            text: 'Овнер Иван Иванов создал новую заявку на передержку'
        }
    }

    const notification = NotificationTypes['Reject']

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <notification.icon sx={{ fill: notification.color, fontSize: '64px' }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
                    <Typography sx={{fontWeight:'bold'}}>{notification.text}</Typography>
                    <Typography sx={{color: '#6b7280'}}>сегодня</Typography>
                </Box>
            </Box>
        </>
    )
}

export default NotificationCard