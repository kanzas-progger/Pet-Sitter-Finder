import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import { Box } from '@mui/material'
import ProfileMenu from '../../Components/ProfileMenu/ProfileMenu'
import EditContact from '../../Components/EditContact/EditContact'
import ProfileLayout from '../../Components/Layout/ProfileLayout'

const Contact = () => {
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
            <EditContact />
          </Box> */}
          <ProfileLayout>
        <EditContact />
      </ProfileLayout>
        </>
      )
}

export default Contact