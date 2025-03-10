import React from 'react'
import {
    Paper, Box, Typography, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
    Select, MenuItem, Checkbox, TextField, IconButton, OutlinedInput, ListItemText,
    Radio, RadioGroup, FormControlLabel, Avatar
} from "@mui/material"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/ru';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import AnimalCard from '../AnimalCard/AnimalCard'
import { useState, useEffect, useRef } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { ruRU } from '@mui/x-date-pickers/locales';
import PetsIcon from '@mui/icons-material/Pets';
import { createAnimalProfile, getAllOwnerAnimalProfiles, updateAnimalProfile, deleteAnimalProfile } from '../../api/animals';
import useAuth from '../../hooks/useAuth';
import useProfile from '../../hooks/useProfile';
import { useNavigate } from 'react-router';


const EditAnimalProfiles = () => {

    dayjs.extend(utc);

    const [animalProfiles, setAnimalProfiles] = useState([])
    const { auth, setAuth } = useAuth()
    const { profile, setProfile } = useProfile()
    const navigate = useNavigate()

    const [createFormData, setCreateFormData] = useState({
        name: '',
        animalName: '',
        birthday: null,
        type: '',
        count: 1,
        description: '',
        profileImage: null
    })

    const [gender, setGender] = useState('Мужской')
    const [image, setImage] = useState(null)
    const imageRef = useRef(null)

    const handleUploadImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('Размер файла превышает 2MB');
                return;
            }

            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            setCreateFormData((prev) => ({
                ...prev,
                profileImage: file
            }))
        }
    }

    const handleUploadImageClick = () => {
        imageRef.current.click()
    }


    const handleDeleteImage = () => {

        setImage(null);
        if (imageRef.current) {
            imageRef.current.value = ''
        }

        setCreateFormData((prev) => ({
            ...prev,
            profileImage: null
        }))
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setCreateFormData((prevData) => ({ ...prevData, [id]: value }));
    }

    const handleDateInputChange = (dateValue) => {
        setCreateFormData((prevData) => ({ ...prevData, birthday: dateValue }))
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllOwnerAnimalProfiles(auth.userId)
                setAnimalProfiles(response.data)
                console.log("Данные животных: ", response.data)
            } catch (e) {
                console.error("Error of receiving sitters: ", e)
            }
        }

        fetchData()
    }, [])


    const [open, setOpen] = useState(false)
    const [isEmptyGender, setIsEmptyGender] = useState(true)

    const russianLocale = ruRU.components.MuiLocalizationProvider.defaultProps.localeText;
    const russianLocaleInLower = {
        ...russianLocale,
        fieldYearPlaceholder: (params) => 'г'.repeat(params.digitAmount),
        fieldMonthPlaceholder: () => 'мм',
        fieldDayPlaceholder: () => 'дд',
    };

    const handleOpenDialog = () => {
        setOpen(true)
    }

    const handleCloseDialog = () => {
        setOpen(false)
    }

    const handleDeleteAnimalProfile = async (animalProfileId) => {
        await deleteAnimalProfile(animalProfileId)
        setAnimalProfiles((prevState) =>
            prevState.filter((animalProfile) => animalProfile.animalProfileId !== animalProfileId)
        )
    }

    const handleCreateAnimalProfile = async(e) => {
        e.preventDefault()

        //const translatedAnimal = createFormData.animalName.map(name => animalTranslations[name])

        const translatedAnimal = animalTranslations[createFormData.animalName]

        const utcDate = createFormData.birthday.utc().format()
        const dataToSend = {
            ...createFormData,
            gender: gender,
            animalName: translatedAnimal,
            count: parseInt(createFormData.count, 10),
            birthday: utcDate
        }

        try{
            const response = await createAnimalProfile(dataToSend)
            console.log(response.data)
            setAnimalProfiles((prev) => [response.data, ...prev])
            //navigate(0)
        }catch (e){
            console.error(e)
        }
        handleCloseDialog()

        setCreateFormData({
            name: '',
            animalName: '',
            birthday: null,
            type: '',
            count: 1,
            description: '',
            profileImage: null
        })

        setGender('Мужской')
        setImage(null)

    }

    const handleUpdateAnimalProfile = async (putData) => {

        try{
            const response = await updateAnimalProfile(putData)
            // setAnimalProfiles((prev) =>
            //     prev.map(profile => 
            //         profile.animalProfileId === response?.data?.animalProfileId 
            //             ? response.data 
            //             : profile
            //     )
            // );
            // console.log(response.data)
            navigate(0)
        }catch (e){
            console.error(e)
        }    
    }

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    }

    const animals = [
        'Собаки',
        'Кошки',
        'Фермерские животные',
        'Пауки',
        'Рептилии',
        'Грызуны',
        'Птички',
        'Рыбки'
    ]

    const animalTranslations = {
        "Собаки": "Dog",
        "Кошки": "Cat",
        "Фермерские животные": "FarmPet",
        "Пауки": "Spider",
        "Рептилии": "Reptile",
        "Грызуны": "SmallPet",
        "Птички": "Bird",
        "Рыбки": "Fish",
    };

    const reversedTranslations = Object.fromEntries(
        Object.entries(animalTranslations).map(([ru, en]) => [en, ru])
    );
    
    const handleAnimalChange = (e) => {

        const selectedAnimal = e.target.value
        setCreateFormData((prevData) => ({ ...prevData, animalName: selectedAnimal }))

        if (selectedAnimal === 'Рыбки') {
            setIsEmptyGender(false)
        }
        else {
            setIsEmptyGender(true)
            if (gender === 'Не указано'){
                setGender('Мужской')
            }
        }
    }

    return (
        <>

            <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Профили ваших животных</Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                    <Divider />

                    <Typography sx={{ color: '#6b7280' }}>Здесь вы можете создать профили своих питомцев </Typography>

                    <Button variant="contained" color="primary" onClick={handleOpenDialog} sx={{ maxWidth: 'fit-content' }}>
                        Создать профиль питомца
                    </Button>
                    <Divider sx={{ marginTop: '5px' }} />
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '20px',
                        justifyItems: 'center',
                        marginTop: '5px'
                    }}
                >

                    {animalProfiles.map((profile) => (
                        <AnimalCard key={profile.animalProfileId}
                            animalProfile={profile}
                            onHandleDelete={handleDeleteAnimalProfile}
                            onHandleUpdate={handleUpdateAnimalProfile} />
                    ))}

                </Box>

            </Paper>

            <Dialog
                onClose={handleCloseDialog}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth="md"
            >
                <form onSubmit={handleCreateAnimalProfile}>
                    <DialogTitle sx={{ m: 0, p: 2, backgroundColor: '#b3d89c', fontWeight: 'bold' }} id="customized-dialog-title">
                        Создать профиль питомца
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={(theme) => ({
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: theme.palette.grey[500],
                        })}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent dividers sx={{ backgroundColor: '#b3d89c' }}>

                        {/* <Box sx={{ display: 'flex', width: '100%', gap: '20px', flexDirection: 'column' }}> */}
                        <Box sx={{ display: 'flex', gap: '20px' }}>


                            <Box sx={{ width: '100%' }}>

                                <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Животное <span style={{ color: '#c70000' }}>*</span></Typography>
                                <FormControl size='small' sx={{ width: '100%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}>
                                    <Select
                                        id="demo-multiple-checkbox"
                                        value={createFormData.animalName}
                                        onChange={handleAnimalChange}
                                        input={<OutlinedInput />}
                                        renderValue={(selected) => selected}
                                        MenuProps={MenuProps}
                                        required
                                    >
                                        {profile?.animals?.map((name) => {
                                            const translatedName = reversedTranslations[name] || name;
                                            return (
                                                <MenuItem key={name} value={translatedName}>
                                                    <Checkbox checked={createFormData.animalName === translatedName} />
                                                    <ListItemText primary={translatedName} />
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>

                                <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                                    Кличка <span style={{ color: '#c70000' }}>*</span>
                                </Typography>
                                <TextField
                                    id="name"
                                    value={createFormData.name}
                                    onChange={handleInputChange}
                                    size="small"
                                    required
                                    sx={{ width: '100%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
                                />

                                <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                                    Дата рождения <span style={{ color: '#c70000' }}>*</span>
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru" localeText={russianLocaleInLower}>
                                    <DateField
                                        value={createFormData.birthday}
                                        onChange={handleDateInputChange}
                                        size='small'
                                        required
                                        sx={{ background: '#e0e0e0', width: '100%', marginTop: '10px' }}
                                    />
                                </LocalizationProvider>
                            </Box>

                            <Box sx={{ width: '100%' }}>
                                <Avatar
                                    src={image}
                                    sx={{
                                        bgcolor: '#BDBDBD',
                                        width: 'auto',
                                        height: '209px',
                                        marginTop: '34px',
                                        boxShadow: 2,
                                        border: '2px solid #D0EFB1'
                                    }}
                                    variant="rounded" > <PetsIcon sx={{ fill: '#e0e0e0', fontSize: '200px' }} /> </Avatar>

                                <input
                                    ref={imageRef}
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    style={{ display: 'none' }}
                                    onChange={handleUploadImageChange}
                                />
                            </Box>

                        </Box>

                        <Box sx={{ display: 'flex', gap: '20px' }}>
                            <Box sx={{ width: '100%' }}>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                                    Пол <span style={{ color: '#c70000' }}>*</span>
                                </Typography>

                                <FormControl required>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <FormControlLabel value="Мужской" control={<Radio />} label="Мужской" />
                                        <FormControlLabel value="Женский" control={<Radio />} label="Женский" />
                                        <FormControlLabel
                                            value="Не указано"
                                            disabled={isEmptyGender}
                                            control={<Radio />}
                                            label="Не указывать"
                                        />
                                    </RadioGroup>
                                </FormControl>

                                <Box sx={{ display: 'flex', gap: '20px' }}>
                                    <Box sx={{ marginTop: '10px', width: '100%' }}>
                                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Вид или порода</Typography>
                                        <TextField
                                            id='type'
                                            value={createFormData.type}
                                            size="small"
                                            sx={{ width: '100%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <Box sx={{ marginTop: '10px', width: '30%' }}>
                                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Количество</Typography>
                                        <TextField
                                            id='count'
                                            size="small"
                                            type='number'
                                            value={createFormData.count}
                                            onChange={handleInputChange}
                                            sx={{ width: '100%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
                                        />
                                    </Box>
                                </Box>



                            </Box>

                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '10px', textAlign: 'center' }}>
                                    <Typography sx={{
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                    }}>Фотография питомца.</Typography>

                                    <Typography sx={{ color: '#6b7280' }}>
                                        Формат: jpg, png.
                                    </Typography>

                                    <Typography sx={{ color: '#6b7280' }}>
                                        Максимальный размер файла: 2Mb.
                                    </Typography>

                                    <Typography sx={{ color: '#6b7280' }}>
                                        Рекомендованный размер: 200x200 px.
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '13px' }}>
                                    <Button variant="contained" color="primary" onClick={handleUploadImageClick}>
                                        Загрузить
                                    </Button>
                                    {(image) && (<>
                                        <Button variant="contained" color="error" onClick={handleDeleteImage}>
                                            Удалить
                                        </Button>
                                    </>)}

                                </Box>
                            </Box>
                        </Box>

                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>Дополнительная информация</Typography>

                        <TextField
                            id='description'
                            value={createFormData.description}
                            onChange={handleInputChange}
                            size="small"
                            sx={{
                                width: '100%',
                                marginTop: '10px',
                                '& .MuiOutlinedInput-root': { background: '#e0e0e0' },
                                '& textarea': { overflow: 'hidden', resize: 'none' }
                            }}
                            multiline
                            minRows={2}
                        />

                    </DialogContent>
                    <DialogActions sx={{ backgroundColor: '#b3d89c' }} >
                        <Button type='submit' variant="contained">
                            Создать
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export default EditAnimalProfiles