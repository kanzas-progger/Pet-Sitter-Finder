import React from 'react'
import {
    Card, CardMedia, CardContent, Box, Typography, CardActions, Tooltip, IconButton, Dialog, DialogTitle, DialogActions,
    DialogContent, TextField, Avatar, FormControl, RadioGroup, FormControlLabel, Radio, Button, Select, ListItemText, Checkbox,
    OutlinedInput, MenuItem
} from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import PetsIcon from '@mui/icons-material/Pets';
import { ruRU } from '@mui/x-date-pickers/locales';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/ru';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { useState, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import useProfile from '../../hooks/useProfile';

const AnimalCard = ({ animalProfile, onHandleDelete, onHandleUpdate }) => {

    dayjs.extend(utc);

    const { profile, setProfile } = useProfile()
    const getStaticImagePath = (fullImagePath) => {
        if(!fullImagePath){
            return null
        } 
        const fileName = fullImagePath.split('/').pop();
        const newPath = `https://localhost:5000/animals/uploads/img/${fileName}`;

        return newPath;
    }

    const {
        animalProfileId,
        animalName,
        name,
        birthday,
        gender,
        type,
        count,
        description,
        profileImage
    } = animalProfile

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

    const [putData, setPutData] = useState({
        name: name,
        animalName: reversedTranslations[animalName],
        birthday: dayjs.utc(birthday),
        type: type,
        count: count,
        description: description,
        gender: gender,
        profileImage: profileImage,
        isProfileImageExist: true,
        existingProfileImage: profileImage
    })

    //const [gender, setGender] = useState('Мужской')
    const [isEmptyGenderDisabled, setIsEmptyGenderDisabled] = useState(putData.animalName !== 'Рыбки')
    const [image, setImage] = useState(getStaticImagePath(profileImage))
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
            setPutData((prev) => ({
                ...prev,
                profileImage: file,
                isProfileImageExist: false
            }))
        }
    }

    const handleUploadImageClick = () => {
        imageRef.current.click()
    }


    const handleDeleteImage = () => {

        if (image && image !== getStaticImagePath(profileImage)) {
            setImage(getStaticImagePath(profileImage))
            setPutData((prev) => ({
                ...prev,
                profileImage: prev.existingProfileImage,
                isProfileImageExist: !!prev.existingProfileImage, 
            }));

            if (imageRef.current) {
                imageRef.current.value = '';
            }
        }
        else {
            setImage(null)
            setPutData((prev) => ({
                ...prev,
                profileImage: null,
                isProfileImageExist: false
            }))
        }
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setPutData((prevData) => ({ ...prevData, [id]: value }));
    }

    const handleDateInputChange = (dateValue) => {
        setPutData((prevData) => ({ ...prevData, birthday: dateValue }))
    }

    const handleAnimalChange = (e) => {

        const selectedAnimal = e.target.value
        setPutData((prevData) => ({ ...prevData, animalName: selectedAnimal }))

        if (selectedAnimal === 'Рыбки') {
            setIsEmptyGenderDisabled(false)
        }
        else {
            setIsEmptyGenderDisabled(true)
            if (putData.gender === 'Не указано') {
                setPutData((prevData) => ({ ...prevData, gender: 'Мужской' }))
            }

        }
    }

    const getAgeString = (birthdayUtc) => {
        const birthday = new Date(birthdayUtc);
        const now = new Date();

        let years = now.getFullYear() - birthday.getFullYear();
        let months = now.getMonth() - birthday.getMonth();

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        const getYearLabel = (num) => {
            if (num % 10 === 1 && num % 100 !== 11) return "год";
            if ([2, 3, 4].includes(num % 10) && ![12, 13, 14].includes(num % 100)) return "года";
            return "лет";
        };

        const getMonthLabel = (num) => {
            if (num === 1) return "месяц";
            if ([2, 3, 4].includes(num)) return "месяца";
            return "месяцев";
        };

        if (years > 0 && months > 0) {
            return `${years} ${getYearLabel(years)} и ${months} ${getMonthLabel(months)}`;
        } else if (years > 0) {
            return `${years} ${getYearLabel(years)}`;
        } else {
            return `${months} ${getMonthLabel(months)}`;
        }
    }

    const russianLocale = ruRU.components.MuiLocalizationProvider.defaultProps.localeText;
    const russianLocaleInLower = {
        ...russianLocale,
        fieldYearPlaceholder: (params) => 'г'.repeat(params.digitAmount),
        fieldMonthPlaceholder: () => 'мм',
        fieldDayPlaceholder: () => 'дд',
    };

    const [openDetails, setOpenDetails] = useState(false)
    const [openUpdate, setOpenUpdate] = useState(false)

    const handleCloseDetailsDialog = () => {
        setOpenDetails(false)
    }

    const handleOpenDetailsDialog = () => {
        setOpenDetails(true)
    }

    const handleOpenUpdateDialog = () => {
        setOpenUpdate(true)
        if (openDetails === true) {
            handleCloseDetailsDialog()
        }
    }

    const handleCloseUpdateDialog = () => {
        setOpenUpdate(false)
    }

    const onHandleUpdateAnimalProfile = (e) => {
        e.preventDefault()
        const translatedAnimal = animalTranslations[putData.animalName]
        const utcDate = putData.birthday.utc().format()
        const parsedCount = parseInt(putData.count, 10)

        const dataToSend = {
            ...putData,
            animalName: translatedAnimal,
            birthday: utcDate,
            count: parsedCount,
            animalProfileId: animalProfileId
        }

        onHandleUpdate(dataToSend)
        handleCloseUpdateDialog()

        setPutData({
            name: name,
            animalName: reversedTranslations[animalName],
            birthday: dayjs.utc(birthday),
            type: type,
            count: count,
            description: description,
            gender: gender,
            profileImage: profileImage,
            isProfileImageExist: true,
            existingProfileImage: profileImage
        })
        setImage(getStaticImagePath(profileImage))
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

    return (
        <>
            <Card sx={{
                display: 'flex', flexDirection: 'column', width: "100%", maxWidth: '350px', boxShadow: 3,
                borderRadius: 3, backgroundColor: '#b3d89c', marginTop: '20px',
            }}>

                <CardContent>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>
                        {name}
                    </Typography>
                    {profileImage ? (
                        <>
                            <CardMedia
                                sx={{ height: 160, borderRadius: 4, marginTop: '15px', border: '#D0EFB1 solid 3px', boxShadow: 3 }}
                                image={getStaticImagePath(profileImage)}
                            />
                        </>) : (
                        <>
                            <Box
                                sx={{
                                    marginTop: '15px',
                                    height: 160,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#b3d89c",
                                    border: '#D0EFB1 solid 3px',
                                    borderRadius: 4,
                                    boxShadow: 3
                                }}
                            >
                                <PetsIcon sx={{ fill: "#e0e0e0", fontSize: "140px" }} />
                            </Box>
                        </>)}

                    <Box sx={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                            Возраст:
                        </Typography>
                        <Typography sx={{ color: '#6b7280', fontSize: '16px' }}>
                            {getAgeString(birthday)}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                            Пол:
                        </Typography>
                        <Typography sx={{ color: '#6b7280', fontSize: '16px' }}>
                            {gender}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                            Порода:
                        </Typography>
                        <Typography sx={{ color: '#6b7280', fontSize: '16px' }}>
                            {type}
                        </Typography>
                    </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', marginTop: '-10px' }}>

                    <Tooltip title="Подробнее" placement="top" onClick={handleOpenDetailsDialog}>
                        <IconButton size="small">
                            <HelpOutlineIcon />
                        </IconButton>
                    </Tooltip>


                    <Tooltip title="Изменить" placement="top" onClick={handleOpenUpdateDialog}>
                        <IconButton size="small">
                            <EditNoteOutlinedIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Удалить" placement="top">
                        <IconButton size="small" onClick={() => onHandleDelete(animalProfileId)}>
                            <DeleteOutlineIcon />
                        </IconButton>
                    </Tooltip>

                </CardActions>
            </Card>

            <Dialog
                onClose={handleCloseDetailsDialog}
                aria-labelledby="customized-dialog-title"
                open={openDetails}
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle sx={{ m: 0, p: 2, backgroundColor: '#b3d89c', fontWeight: 'bold' }} id="customized-dialog-title">
                    Подробнее о питомце
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseDetailsDialog}
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

                            <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Животное</Typography>
                            <TextField
                                id="animalName"
                                value={reversedTranslations[animalName]}
                                size="small"
                                disabled
                                sx={{ width: '100%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
                            />

                            <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                                Кличка
                            </Typography>
                            <TextField
                                id="name"
                                value={name}
                                disabled
                                size="small"
                                sx={{ width: '100%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
                            />

                            <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                                Дата рождения
                            </Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru" localeText={russianLocaleInLower}>
                                <DateField
                                    value={dayjs.utc(birthday)}
                                    size='small'
                                    disabled
                                    sx={{ background: '#e0e0e0', width: '100%', marginTop: '10px' }}
                                />
                            </LocalizationProvider>
                        </Box>

                        <Box sx={{ width: '100%' }}>
                            <Avatar
                                src={getStaticImagePath(profileImage)}
                                sx={{
                                    bgcolor: '#BDBDBD',
                                    width: 'auto',
                                    height: '209px',
                                    marginTop: '34px',
                                    boxShadow: 2,
                                    border: '2px solid #D0EFB1'
                                }}

                                variant="rounded" > <PetsIcon sx={{ fill: '#e0e0e0', fontSize: '200px' }} /> </Avatar>
                        </Box>

                    </Box>

                    <Box sx={{ display: 'flex', gap: '20px' }}>
                        <Box sx={{ width: '100%' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                                Пол
                            </Typography>

                            <FormControl >
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={gender}
                                >
                                    <FormControlLabel value="Мужской" control={<Radio />} label="Мужской" disabled />
                                    <FormControlLabel value="Женский" control={<Radio />} label="Женский" disabled />
                                    <FormControlLabel
                                        value="Не указано"
                                        control={<Radio />}
                                        label="Не указано"
                                        disabled
                                    />
                                </RadioGroup>
                            </FormControl>

                            <Box sx={{ display: 'flex', gap: '20px', width: '50%' }}>
                                <Box sx={{ marginTop: '10px', width: '100%' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Вид или порода</Typography>
                                    <TextField
                                        id='type'
                                        value={type}
                                        size="small"
                                        disabled
                                        sx={{ width: '100%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}

                                    />
                                </Box>
                                <Box sx={{ marginTop: '10px', width: '30%' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Количество</Typography>
                                    <TextField
                                        id='count'
                                        size="small"
                                        type='number'
                                        value={count}
                                        disabled
                                        sx={{ width: '85%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
                                    />
                                </Box>
                            </Box>
                        </Box>

                    </Box>

                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>Дополнительная информация</Typography>

                    <TextField
                        id='description'
                        value={description}
                        disabled
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
                    <Button variant="contained" onClick={handleOpenUpdateDialog}>
                        Изменить
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog
                onClose={handleCloseUpdateDialog}
                aria-labelledby="customized-dialog-title"
                open={openUpdate}
                fullWidth={true}
                maxWidth="md"
            >
                <form onSubmit={onHandleUpdateAnimalProfile}>
                    <DialogTitle sx={{ m: 0, p: 2, backgroundColor: '#b3d89c', fontWeight: 'bold' }} id="customized-dialog-title">
                        Изменить профиль питомца
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseUpdateDialog}
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
                        <Box sx={{ display: 'flex', gap: '20px' }}>
                            <Box sx={{ width: '100%' }}>

                                <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Животное <span style={{ color: '#c70000' }}>*</span></Typography>
                                <FormControl size='small' sx={{ width: '100%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}>
                                    <Select
                                        id="demo-multiple-checkbox"
                                        value={putData.animalName}
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
                                                    <Checkbox checked={putData.animalName === translatedName} />
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
                                    value={putData.name}
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
                                        value={putData.birthday}
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
                                        value={putData.gender}
                                        onChange={(e) => setPutData((prev) => ({ ...prev, gender: e.target.value }))}
                                    >
                                        <FormControlLabel value="Мужской" control={<Radio />} label="Мужской" />
                                        <FormControlLabel value="Женский" control={<Radio />} label="Женский" />
                                        <FormControlLabel
                                            value="Не указано"
                                            disabled={isEmptyGenderDisabled}
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
                                            value={putData.type}
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
                                            value={putData.count}
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
                                        Рекомендованный размер: 300x200 px.
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
                            value={putData.description}
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
                            Применить изменения
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export default AnimalCard