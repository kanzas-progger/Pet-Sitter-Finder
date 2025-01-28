import React from 'react'
import { Paper, Avatar, Box, Typography, Divider, Button, TextField, TextareaAutosize } from "@mui/material"
import { useState, useRef } from 'react'
import { updateOwnerPersonal, updateOwnerProfileImage, deleteOwnerProfileImage } from "../../api/owners"
import { updateSitterPersonal, updateSitterProfileImage, deleteSitterProfileImage } from '../../api/sitters'
import { useNavigate } from 'react-router'
import useProfile from '../../hooks/useProfile'
import useAuth from '../../hooks/useAuth'

const EditProfile = () => {

  const { profile, setProfile } = useProfile()
  const { auth, setAuth } = useAuth()

  const [image, setImage] = useState(null)
  const imageRef = useRef(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { id, value } = e.target
    setProfile(prev => ({ ...prev, [id]: value }))
  }

  const handleUploadImageClick = () => {
    imageRef.current.click()
  }

  const handleUploadImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Размер файла превышает 2MB');
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setImage({
        file: file,
        preview: imageUrl
      });
    }
  }

  const handleDeleteImage = () => {
    if (image) {
      setImage(null);
      if (imageRef.current) {
        imageRef.current.value = '';
      }
    }
    else {
      setProfile((prev) => ({
        ...prev,
        profileImage: ''
      }))
    }
  }

  const handleSubmit = async () => {
    try {

      if (auth?.role?.includes('Owner')) {
        const response = await updateOwnerPersonal(profile)
        if (response?.data) {
          console.log(response.data)
        }
        if (image) {
          const updateProfileImageResponse = await updateOwnerProfileImage(image.file)
          if (updateProfileImageResponse?.data) {
            console.log(updateProfileImageResponse.data)
          }
        }
        if (profile.profileImage === '' && !image) {
          const deleteProfileImageResponse = await deleteOwnerProfileImage()
          if (deleteProfileImageResponse?.data) {
            console.log(deleteProfileImageResponse.data)
          }
        }
      }
      else if (auth?.role?.includes('Sitter')) {
        const response = await updateSitterPersonal(profile)
        if (response?.data) {
          console.log(response.data)
        }
        if (image) {
          const updateProfileImageResponse = await updateSitterProfileImage(image.file)
          console.log('Avatar is updating')
          if (updateProfileImageResponse?.data) {
            console.log(updateProfileImageResponse.data)
          }
        }
        if (profile.profileImage === '' && !image) {
          const deleteProfileImageResponse = await deleteSitterProfileImage()
          if (deleteProfileImageResponse?.data) {
            console.log(deleteProfileImageResponse.data)
          }
        }
      }
      navigate(0)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Личная информация</Typography>
        <Divider sx={{ marginTop: '20px' }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
          <Avatar
            src={image ? image.preview
              : profile.profileImage ? `https://localhost:5000${profile.profileImage}`
                : ''}
            alt="Н"
            sx={{ width: 150, height: 150 }}
          />
          <input
            ref={imageRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            style={{ display: 'none' }}
            onChange={handleUploadImageChange}
          />
          <Typography sx={{ color: '#6b7280', textAlign: 'center', marginTop: '16px' }}>
            <b>Ваша фотография.</b> Формат: jpg, png.
            <br />
            Максимальный размер файла: 2Mb.
            <br />
            Рекомендованный размер: 200x200 px.
          </Typography>
          <Box sx={{ display: 'flex', gap: '5px', marginTop: '16px' }}>
            <Button variant="contained" color="primary" onClick={handleUploadImageClick}>
              Загрузить
            </Button>
            {(profile.profileImage || image) && (
              <>
                <Button variant="contained" color="error" onClick={handleDeleteImage}>
                  Удалить
                </Button>
              </>
            )}

          </Box>
        </Box>
        <Box sx={{ marginTop: '30px' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Ссылка на профиль <span style={{ color: '#c70000' }}>*</span></Typography>
          <TextField
            id="profile-link"
            size="small"
            value={`https://localhost:5173/${profile.login}`}
            sx={{ width: '70%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />

          <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>Имя <span style={{ color: '#c70000' }}>*</span></Typography>
          <Typography sx={{ color: '#6b7280' }}>Может состоять из букв, исключая цифры и спецсимволы</Typography>
          <TextField
            id="firstname"
            size="small"
            value={`${profile.firstname}`}
            onChange={handleChange}
            sx={{ width: '70%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
          />

          <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>Фамилия <span style={{ color: '#c70000' }}>*</span></Typography>
          <Typography sx={{ color: '#6b7280' }}>Может состоять из букв, исключая цифры и спецсимволы</Typography>
          <TextField
            id="lastname"
            size="small"
            value={`${profile.lastname}`}
            onChange={handleChange}
            sx={{ width: '70%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
          />

          <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>Отчество</Typography>
          <Typography sx={{ color: '#6b7280' }}>Может состоять из букв, исключая цифры и спецсимволы</Typography>
          <TextField
            id="fathername"
            size="small"
            value={`${profile.fathername}`}
            onChange={handleChange}
            sx={{ width: '70%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
          />

          <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>Страна</Typography>
          <Typography sx={{ color: '#6b7280' }}>Может состоять из букв, исключая цифры и спецсимволы</Typography>
          <TextField
            id="country"
            size="small"
            value={`${profile.country}`}
            onChange={handleChange}
            sx={{ width: '70%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
          />

          <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>Город</Typography>
          <Typography sx={{ color: '#6b7280' }}>Может состоять из букв, исключая цифры и спецсимволы</Typography>
          <TextField
            id="city"
            size="small"
            value={`${profile.city}`}
            onChange={handleChange}
            sx={{ width: '70%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
          />

          <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>Местоположение</Typography>
          <Typography sx={{ color: '#6b7280' }}>Можете указать улицу, дом или квартиру</Typography>
          <TextField
            id="address"
            size="small"
            value={`${profile.address}`}
            onChange={handleChange}
            sx={{ width: '70%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
          />

          <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>О себе</Typography>
          <Typography sx={{ color: '#6b7280' }}>Расскажите подробнее о себе. Минимальное количество символов — 50</Typography>
          <TextareaAutosize
            id='about'
            value={`${profile.about}`}
            onChange={handleChange}
            minRows={4}
            placeholder="Введите текст..."
            style={{
              width: '70%',
              marginTop: '10px',
              fontSize: '16px',
              padding: '8px 15px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              resize: 'none',
              background: '#e0e0e0'
            }}
          />


        </Box>

        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: '30px' }}>
          Сохранить
        </Button>
      </Paper>
    </>
  )
}

export default EditProfile