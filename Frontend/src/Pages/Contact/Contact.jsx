import React from 'react'
import EditContact from '../../Components/EditContact/EditContact'
import ProfileLayout from '../../Components/Layout/ProfileLayout'

const Contact = () => {
  return (
    <>
      <ProfileLayout>
        <EditContact />
      </ProfileLayout>
    </>
  )
}

export default Contact