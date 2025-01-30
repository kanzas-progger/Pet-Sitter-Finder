import React from 'react'
import Navbar from '../Navbar/Navbar'
import ProfileMenu from '../ProfileMenu/ProfileMenu'
import { Box } from '@mui/material'

const ProfileLayout = ({ children }) => {
  return (
    <>
    {/* <Navbar /> */}
    <Box sx={{
        padding: '20px 10%',
        display: 'flex',
        gap: '20px',
        width: '100%',
      }}>
        <ProfileMenu /> 
        {children}
      </Box>
    </>
  )
}

export default ProfileLayout