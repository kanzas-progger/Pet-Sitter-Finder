import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import { Box } from '@mui/material'
import ProfileMenu from '../../Components/ProfileMenu/ProfileMenu'
import EditProfile from '../../Components/EditProfile/EditProfile'
import ProfileLayout from '../../Components/Layout/ProfileLayout'


const Personal = () => {

  return (
    <>
      {/* <Navbar />
      <Box sx={{
        padding: '20px 10%',
        display: 'flex',
        gap: '20px',
        width: '100%',
      }}>
        <ProfileMenu />
        <EditProfile />
      </Box> */}
      <ProfileLayout>
        <EditProfile />
      </ProfileLayout>
    </>

  )
}

export default Personal