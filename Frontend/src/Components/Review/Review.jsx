import React from 'react'
import { Box, Avatar, Typography, Rating, IconButton, Link } from '@mui/material'
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import { getShortOwnerProfile } from '../../api/owners';
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

const Review = ({ review, onHandleDelete }) => {

    const { auth, setAuth } = useAuth()

    const {
        reviewId,
        sitterId,
        senderId,
        stars,
        content,
        creationDate,
        expirationToUpdateAndDelete
    } = review;

    const [shortOwnerProfile, setShortOwnerProfile] = useState([])
    const expirationDate = new Date(expirationToUpdateAndDelete);
    const nowDate = new Date()
    const canDelete = (expirationDate > nowDate && senderId === auth?.userId) || auth?.userId === sitterId

    useEffect(() => {
        const fetchShortOwnerProfile = async () => {
            try {
                const response = await getShortOwnerProfile(senderId)
                setShortOwnerProfile(response.data)
            } catch (e) {
                console.error("Error of receiving short owner profile: ", e)
            }
        }
        fetchShortOwnerProfile()
    }, [senderId])

    return (
        <>
            <Box sx={{ marginTop: '20px' }}>
                <Box sx={{ display: 'flex', gap: '20px' }}>
                    <Avatar

                        src={`https://localhost:5000${shortOwnerProfile?.profileImage}`}
                        alt="Н"
                        sx={{ width: 64, height: 64 }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
                        <Link href={`https://localhost:5173/${shortOwnerProfile?.login}`} underline="none"
                            sx={{
                                fontWeight: 'bold', fontSize: '16px', color: 'black',
                                '&:hover': {
                                    textDecoration: 'underline',
                                    textDecorationColor: 'inherit',
                                },
                            }}>{shortOwnerProfile?.firstname} {shortOwnerProfile?.lastname}</Link>
                        <Rating name="review-rating" value={stars} readOnly icon={<StarIcon
                            sx={{
                                fill: '#FFD700',
                                stroke: '#9B2D20',
                                strokeWidth: 1.5,
                                marginRight: '5px',
                            }} />}
                            emptyIcon={
                                <StarIcon
                                    sx={{
                                        fill: 'transparent',
                                        stroke: '#6b7280',
                                        strokeWidth: 1.5,
                                        marginRight: '5px',
                                    }}
                                />
                            }
                        />
                        <Box sx={{ width: '100%', maxWidth: '620px', overflow: 'hidden' }}>
                            <Typography sx={{ wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                                {content}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ color: '#6b7280', marginTop: '5px' }}>
                                {new Date(creationDate).toLocaleDateString('ru-RU')}
                            </Typography>
                            {canDelete && (
                                <IconButton onClick={() => onHandleDelete({ sitterId, reviewId })}>
                                    <DeleteIcon sx={{
                                        fill: '#f44336',
                                        cursor: 'pointer',
                                        fontSize: '30px',
                                        '&:hover': { fill: '#c9372c' }
                                    }} />
                                </IconButton>
                            )}

                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Review