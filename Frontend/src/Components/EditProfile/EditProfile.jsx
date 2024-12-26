import React from 'react'
import { Paper, Avatar, Box, Typography, Divider, Button, TextField, TextareaAutosize } from "@mui/material"

const EditProfile = () => {
  return (
    <>
        <Paper elevation={3} sx={{ padding: '20px', width: '100%', boxSizing: 'border-box' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Личная информация
            <Divider sx={{ marginTop: '20px' }} />
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            <Avatar
            //   src={`https://localhost:5000${ownerProfile.profileImage}`}
              src = "localhost"
              alt="Н"
              sx={{ width: 150, height: 150 }}
            />
            <Typography sx={{ color: '#6b7280', textAlign: 'center', marginTop: '16px' }}>
              <b>Ваша фотография.</b> Формат: jpg, png.
              <br />
              Максимальный размер файла: 2Mb.
              <br />
              Рекомендованный размер: 200x200 px.
            </Typography>
            <Box sx={{ display: 'flex', gap: '5px', marginTop: '16px' }}>
              <Button variant="contained" color="primary">
                Загрузить
              </Button>
              <Button variant="contained" color="error">
                Удалить
              </Button>
            </Box>
          </Box>
          <Box sx={{ marginTop: '30px' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Ссылка на профиль <span style={{ color: '#c70000' }}>*</span></Typography>
            <TextField
              id="profile-link"
              size="small"
              sx={{ width: '70%', marginTop: '10px', '& .MuiOutlinedInput-root': {background: '#e0e0e0'} }}
            />

            <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>Имя <span style={{ color: '#c70000' }}>*</span></Typography>
            <Typography sx={{ color: '#6b7280' }}>Может состоять из букв, исключая цифры и спецсимволы</Typography>
            <TextField
              id="profile-link"
              size="small"
              sx={{ width: '70%', marginTop: '10px', '& .MuiOutlinedInput-root': {background: '#e0e0e0'} }}
            />

            <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>Фамилия <span style={{ color: '#c70000' }}>*</span></Typography>
            <Typography sx={{ color: '#6b7280' }}>Может состоять из букв, исключая цифры и спецсимволы</Typography>
            <TextField
              id="profile-link"
              size="small"
              sx={{ width: '70%', marginTop: '10px', '& .MuiOutlinedInput-root': {background: '#e0e0e0'} }}
            />

            <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>Отчество</Typography>
            <Typography sx={{ color: '#6b7280' }}>Может состоять из букв, исключая цифры и спецсимволы</Typography>
            <TextField
              id="profile-link"
              size="small"
              sx={{ width: '70%', marginTop: '10px', '& .MuiOutlinedInput-root': {background: '#e0e0e0'}}}
            />

            <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>Страна</Typography>
            <Typography sx={{ color: '#6b7280' }}>Может состоять из букв, исключая цифры и спецсимволы</Typography>
            <TextField
              id="profile-link"
              size="small"
              sx={{ width: '70%', marginTop: '10px', '& .MuiOutlinedInput-root': {background: '#e0e0e0'} }}
            />

            <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>Город</Typography>
            <Typography sx={{ color: '#6b7280' }}>Может состоять из букв, исключая цифры и спецсимволы</Typography>
            <TextField
              id="profile-link"
              size="small"
              sx={{ width: '70%', marginTop: '10px', '& .MuiOutlinedInput-root': {background: '#e0e0e0'} }}
            />

            <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>Местоположение</Typography>
            <Typography sx={{ color: '#6b7280' }}>Можете указать улицу, дом или квартиру</Typography>
            <TextField
              id="profile-link"
              size="small"
              sx={{ width: '70%', marginTop: '10px', '& .MuiOutlinedInput-root': {background: '#e0e0e0'} }}
            />

            <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>О себе</Typography>
            <Typography sx={{ color: '#6b7280' }}>Расскажите о себе в подробностях. Минимальное количество символов — 50</Typography>
            <TextareaAutosize
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

          <Button variant="contained" color="primary" sx={{ marginTop: '30px' }}>
            Сохранить
          </Button>
        </Paper>
    </>
  )
}

export default EditProfile