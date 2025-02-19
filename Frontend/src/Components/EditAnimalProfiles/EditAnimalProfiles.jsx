import React from 'react'
import {
    Paper, Box, Typography, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextareaAutosize, FormControl, Select, MenuItem, Checkbox, TextField, IconButton, OutlinedInput, ListItemText,
    Radio, RadioGroup, FormControlLabel, Avatar
} from "@mui/material"
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import CardBoard from '../CardBoard/CardBoard'
import AnimalCard from '../AnimalCard/AnimalCard'
import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { ruRU } from '@mui/x-date-pickers/locales';
import PetsIcon from '@mui/icons-material/Pets';


const EditAnimalProfiles = () => {

    const [open, setOpen] = useState(false)
    const [animalName, setAnimalName] = useState([]);
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

    const handleAnimalChange = (e) => {
        const {
            target: { value },
        } = e;
        setAnimalName(typeof value === 'string' ? value.split(',') : value);
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
                    <CardBoard />

                    <AnimalCard />
                    <AnimalCard />
                    <AnimalCard />
                    <AnimalCard />
                    <AnimalCard />

                </Box>

            </Paper>

            <Dialog
                onClose={handleCloseDialog}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth="md"
            >
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
                                    multiple
                                    value={animalName}
                                    onChange={handleAnimalChange}
                                    input={<OutlinedInput />}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}
                                >
                                    {animals.map((name) => (
                                        <MenuItem key={name} value={name}>
                                            <Checkbox checked={animalName.includes(name)} />
                                            <ListItemText primary={name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                                Кличка <span style={{ color: '#c70000' }}>*</span>
                            </Typography>
                            <TextField
                                id="type"
                                size="small"
                                sx={{ width: '100%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
                            />

                            <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                                Дата рождения <span style={{ color: '#c70000' }}>*</span>
                            </Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru" localeText={russianLocaleInLower}>
                                <DateField
                                    size='small'
                                    sx={{ background: '#e0e0e0', width: '100%', marginTop: '10px' }}
                                />
                            </LocalizationProvider>
                        </Box>

                        <Box sx={{ width: '100%' }}>
                            <Avatar sx={{
                                bgcolor: '#BDBDBD',
                                width: 'auto',
                                height: '209px',
                                marginTop: '34px',
                                boxShadow: 2,
                                border: '2px solid #D0EFB1'
                            }}
                                variant="rounded"> <PetsIcon sx={{ fill: '#e0e0e0', fontSize: '200px' }} /> </Avatar>
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
                                    defaultValue="male"
                                >
                                    <FormControlLabel value="male" control={<Radio />} label="Мужской" />
                                    <FormControlLabel value="female" control={<Radio />} label="Женский" />
                                    <FormControlLabel
                                        value="nothing"
                                        disabled
                                        control={<Radio />}
                                        label="Не указывать"
                                    />
                                </RadioGroup>
                            </FormControl>

                            <Box sx={{ display: 'flex', gap: '20px' }}>
                                <Box sx={{ marginTop: '10px', width: '100%' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Вид или порода</Typography>
                                    <TextField
                                        size="small"
                                        sx={{ width: '100%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
                                    />
                                </Box>
                                <Box sx={{ marginTop: '10px', width: '30%' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Количество</Typography>
                                    <TextField
                                        size="small"
                                        type='number'
                                        defaultValue={1}
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
                                <Button variant="contained" color="primary">
                                    Загрузить
                                </Button>
                                {/* <Button variant="contained" color="error">
                                    Удалить
                                </Button> */}
                            </Box>
                        </Box>
                    </Box>

                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>Дополнительная информация</Typography>

                    <TextField
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
                    <Button type='submit' onClick={handleCloseDialog} variant="contained">
                        Создать
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default EditAnimalProfiles