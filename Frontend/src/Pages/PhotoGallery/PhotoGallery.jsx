import React from 'react';
import ProfileLayout from '../../Components/Layout/ProfileLayout';
import {
    Paper, Typography, Divider, Button, ImageList, ImageListItem, Box, Tooltip, Dialog,
    DialogContent, IconButton
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { uploadSitterProfilePhotos, deleteSitterProfilePhoto } from '../../api/sitters';
import { uploadOwnerProfilePhotos, deleteOwnerProfilePhoto } from '../../api/owners';
import useProfile from '../../hooks/useProfile';
import { useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';

const PhotoGallery = () => {

    const { auth, setAuth } = useAuth()
    const { profile, setProfile } = useProfile()
    const navigate = useNavigate()

    const [photos, setPhotos] = useState(profile?.profilePhotos || [])

    useEffect(() => {
        if (profile?.profilePhotos) {
            setPhotos(profile.profilePhotos)
            console.log("Set photo")
        }
    }, [profile])


    const [selectedFiles, setSelectedFiles] = useState([])
    const fileInputRef = useRef(null)

    const [open, setOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleOpenSlider = (index) => {
        setCurrentIndex(index);
        setOpen(true);
    }

    const handleCloseSlider = () => {
        setOpen(false);
    }

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1))
    }

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1))
    }

    const formatPhotoPath = (photo) => {
        if (!photo) return ''
        const fileName = photo.split('/').pop()
        return `/uploads/img/${fileName}`
    }

    // upload and delete photos

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files); // Сохраняем выбранные файлы
    }


    const handleUploadPhotos = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        try {
            if (auth?.role.includes('Sitter')) {
                const response = await uploadSitterProfilePhotos(files);
                console.log('Загрузка успешна:', response.data);
            }
            else if (auth?.role.includes('Owner')) {
                const response = await uploadOwnerProfilePhotos(files);
                console.log('Загрузка успешна:', response.data);
            }
            else {
                console.log("Another role")
            }
        } catch (error) {
            console.error('Ошибка при загрузке:', error);
        }
        navigate(0);
    }

    const handleDeletePhoto = async () => {
        const photoUrl = photos[currentIndex];
        console.log(photoUrl);
        if (!photoUrl) return;

        try {
            if (auth?.role.includes('Sitter')) {
                const response = await deleteSitterProfilePhoto(photoUrl)
            }
            else if (auth?.role.includes('Owner')) {
                const response = await deleteOwnerProfilePhoto(photoUrl)
            }
            else {
                console.log("Another role")
            }
            setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo !== photoUrl))
            setOpen(false)
        } catch (error) {
            console.error('Ошибка при удалении фото:', error);
        }
    }

    return (
        <>
            <ProfileLayout>
                <Paper
                    elevation={3}
                    sx={{
                        backgroundColor: '#D0EFB1',
                        padding: '20px',
                        width: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Мои фото</Typography>
                    <Divider sx={{ marginTop: '20px' }} />

                    <Typography sx={{ color: '#6b7280', marginTop: '20px' }}>
                        Здесь вы можете добавить свои фотографии
                    </Typography>

                    <ImageList
                        cols={3}
                        gap={8}
                        sx={{
                            marginTop: '20px',
                            maxWidth: '100%',
                            height: 'auto',
                        }}
                    >
                        {photos.map((photo, index) => (
                            photos.length > 6 && index === 5 ? (
                                <ImageListItem
                                    key={index}
                                    cols={1}
                                    rows={1}
                                    sx={{
                                        aspectRatio: '1 / 1',
                                    }}
                                    onClick={() => handleOpenSlider(5)}
                                >
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#4D7298',
                                            borderRadius: 4,
                                            '&:hover': {
                                                backgroundColor: '#3B5A75',
                                            },
                                        }}
                                    >
                                        <CameraAltIcon sx={{ fontSize: 40, color: 'white' }} />
                                        <Typography
                                            sx={{
                                                marginLeft: 1,
                                                fontWeight: 'bold',
                                                fontSize: '16px',
                                                color: 'white',
                                            }}
                                        >
                                            {photos.length} фото
                                        </Typography>
                                    </Box>
                                </ImageListItem>
                            ) : index < 6 ? (
                                <ImageListItem
                                    key={index}
                                    cols={1}
                                    rows={1}
                                    sx={{
                                        position: 'relative',
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        aspectRatio: '1 / 1', // Квадратное соотношение сторон
                                        '&:hover': {
                                            '& img': {
                                                filter: 'brightness(70%)',
                                            },
                                            '& .hover-overlay': {
                                                opacity: 0.8,
                                            },
                                            '& .visibility-icon': {
                                                opacity: 1,
                                            },
                                        },
                                    }}
                                    onClick={() => handleOpenSlider(index)}
                                >
                                    <img
                                        src={`https://localhost:5000${formatPhotoPath(photo)}`}
                                        alt={`Фото ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'filter 0.2s ease',
                                        }}
                                    />
                                    {/* Overlay for background color */}
                                    <Box
                                        className="hover-overlay"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: '#3B5A75',
                                            opacity: 0,
                                            transition: 'opacity 0.2s ease',
                                        }}
                                    />
                                    {/* Visibility Icon */}
                                    <Box
                                        className="visibility-icon"
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            opacity: 0,
                                            transition: 'opacity 0.2s ease',
                                            color: 'white',
                                        }}
                                    >
                                        <VisibilityIcon sx={{ fontSize: 40, cursor: 'pointer' }} />

                                    </Box>
                                </ImageListItem>
                            ) : null
                        ))}
                    </ImageList>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '20px',
                        }}
                    >
                        <input
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleUploadPhotos} // Вызываем загрузку файлов
                        />

                        <Button
                            variant="contained"
                            onClick={() => fileInputRef.current.click()} // Открываем диалог выбора файлов
                            color="primary"
                            sx={{ alignSelf: 'center' }}
                        >
                            Загрузить
                        </Button>
                        <Typography
                            sx={{
                                color: '#6b7280',
                                textAlign: 'center',
                                marginTop: '10px',
                                fontWeight: 'bold',
                            }}
                        >
                            Формат: jpg, jpeg, png
                            <br />
                            Можно выбрать несколько фото за раз
                            <br />
                            Максимальный размер файла: 2Mb
                        </Typography>
                    </Box>
                </Paper>


                <Dialog open={open} onClose={handleCloseSlider} maxWidth="md">
                    <DialogContent
                        sx={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#000',
                            padding: 0
                        }}
                    >
                        <Box sx={{
                            width: '100%',
                            height: '40px',
                            backgroundColor: '#4D7298',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '3px'

                        }}>

                            <Tooltip title='Удалить фото' placement="top">
                                <IconButton
                                    onClick={handleDeletePhoto}
                                    sx={{ color: 'white' }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                            <IconButton
                                onClick={handleCloseSlider}
                                sx={{ color: 'white' }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <IconButton
                            onClick={handlePrev}
                            sx={{ position: 'absolute', left: 8, color: 'white' }}
                        >
                            <ArrowBackIosIcon />
                        </IconButton>
                        <img
                            src={`https://localhost:5000${formatPhotoPath(photos[currentIndex])}`}
                            alt={`Фото ${currentIndex + 1}`}
                            style={{ maxWidth: '100%', maxHeight: 'calc(80vh - 50px)', objectFit: 'contain' }}
                        />
                        <IconButton
                            onClick={handleNext}
                            sx={{ position: 'absolute', right: 8, color: 'white' }}
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </DialogContent>
                </Dialog>
            </ProfileLayout>
        </>
    );
};

export default PhotoGallery;
