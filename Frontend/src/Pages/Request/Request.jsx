import React from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import {
    Box, Paper, Avatar, Typography, Link, FormControl, Select, MenuItem, Checkbox,
    OutlinedInput, ListItemText, TextField, TextareaAutosize, Button
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CalendarPicker from '../../Components/CalendarPicker/CalendarPicker';


const Request = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const [selectPets, setSelectPets] = useState('fromSitterAnimals')
    const [petCount, setPetCount] = useState(1)
    //const { animals, pricePerDay } = location.state || {}

    // useEffect(() => {
    //     if (!animals || !pricePerDay) {
    //         navigate("/"); 
    //     }
    // }, [animals, pricePerDay, navigate]);

    // if (!animals || !pricePerDay) return null;

    const disabledDates = [
        dayjs("2025-02-15"),
        dayjs("2025-02-20"),
        dayjs("2025-02-25"),
    ];

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

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

    const ownerAnimals = [
        'Метяся (собака)', 'Женька (кошка)'
    ];

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

    const [animalName, setAnimalName] = useState([]);



    const handleAnimalChange = (e) => {
        const {
            target: { value },
        } = e;
        setAnimalName(typeof value === 'string' ? value.split(',') : value);
    }

    const handleSelectPets = (e) => {
        setSelectPets(e.target.value)
    }

    const handlePetCount = (e) => {
        setPetCount(e.target.value)
    }

    return (
        <>
            <Box sx={{
                padding: '20px 10%',
                display: 'flex',
                gap: '20px',
                width: '100%',
                flexDirection: 'column'
            }}>
                <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', width: '100%', boxSizing: 'border-box', padding: '20px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <Avatar sx={{ width: 64, height: 64 }}>

                            </Avatar>
                            <Link href="#" underline="none" sx={{
                                fontWeight: 'bold', fontSize: '18px', color: 'black', '&:hover': {
                                    textDecoration: 'underline',
                                    textDecorationColor: 'inherit',
                                },
                            }}>Ситтер Ситтеров</Link>
                        </Box>

                    </Box>
                </Paper>

                <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', width: '100%', boxSizing: 'border-box', padding: '20px' }}>
                    <Typography sx={{ textAlign: 'center', fontWeight: 'bold', color: 'black', fontSize: '36px', padding: '0 20px' }}>
                        Оставить заявку
                    </Typography>
                    <Box sx={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        
                        <Box sx={{margin:'0 auto'}}>
                            <Typography sx={{ fontWeight: 'bold', color: 'black', fontSize: '22px', textAlign: 'center' }}>
                                Указать животных из списка
                            </Typography>

                            <FormControl fullWidth sx={{ marginTop: '10px', background: '#b3d89c' }}>
                                <Select
                                    value={selectPets}
                                    onChange={handleSelectPets}
                                    sx={{ width: '320px' }}
                                >
                                    <MenuItem value={'fromSitterAnimals'}>Ситтера</MenuItem>
                                    <MenuItem value={'fromAnimalProfiles'}>Профилей ваших питомцев</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{margin:'0 auto'}}>
                        <Box sx={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>

                                <Typography sx={{ fontWeight: 'bold', color: 'black', fontSize: '22px', textAlign: 'center' }}>
                                    Ваши питомцы
                                </Typography>

                                <FormControl sx={{ width: '320px', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#b3d89c' } }}>
                                    <Select
                                        id="demo-multiple-checkbox"
                                        multiple
                                        value={animalName}
                                        onChange={handleAnimalChange}
                                        input={<OutlinedInput />}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                    >
                                        {(selectPets === 'fromSitterAnimals' ? animals : ownerAnimals).map((name) => (
                                            <MenuItem key={name} value={name}>
                                                <Checkbox checked={animalName.includes(name)} />
                                                <ListItemText primary={name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>

                                <Typography sx={{ fontWeight: 'bold', color: 'black', fontSize: '22px', textAlign: 'center' }}>
                                    Количество
                                </Typography>

                                <TextField
                                    type="number"
                                    onChange={handlePetCount}
                                    value={petCount}
                                    required
                                    disabled={selectPets === 'fromAnimalProfiles'}
                                    sx={{ width: '320px', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#b3d89c' } }}
                                />
                                
                            </Box>
                        </Box>



                        <Box sx={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography sx={{ textAlign: 'center', marginBottom: '10px', fontWeight: 'bold', color: 'black', fontSize: '22px' }}>Отдадите</Typography>
                                    <CalendarPicker disabledDates={disabledDates} disableTooltip={'На передержке будут другие животные'} />
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography sx={{ textAlign: 'center', marginBottom: '10px', fontWeight: 'bold', color: 'black', fontSize: '22px' }}>Заберете</Typography>
                                    <CalendarPicker disabledDates={disabledDates} disableTooltip={'На передержке будут другие животные'} />
                                </Box>
                            </LocalizationProvider>
                        </Box>

                        <Box sx={{ marginTop: '20px' }}>
                            <Typography sx={{ fontWeight: 'bold', color: 'black', fontSize: '22px', textAlign: 'center' }}>
                                Сообщение ситтеру
                            </Typography>

                            <TextareaAutosize
                                minRows={4}
                                placeholder="Оставить сообщение..."
                                style={{
                                    width: '660px',
                                    marginTop: '10px',
                                    fontSize: '16px',
                                    padding: '8px 15px',
                                    border: '1px solid #ccc',
                                    borderRadius: '12px',
                                    resize: 'none',
                                    background: '#b3d89c'
                                }}
                            />
                        </Box>
                        

                        <Box sx={{ display: 'flex', flexDirection: 'column', marginTop:'20px', gap:'5px', background:'#b3d89c', width:'660px', padding:'20px', borderRadius:'12px' }}>
                            <Typography sx={{ color: 'black', fontSize: '16px'}}>
                                Формула расчета: 700 ₽ x 2 собаки x 1 сутки
                            </Typography>
                            <Typography sx={{ fontWeight: 'bold', color: 'black', fontSize: '22px' }}>
                                Примерная стоимость передержки : 1400 ₽
                            </Typography>
                            <Typography sx={{ color: 'black', fontSize: '16px' }}>
                                Точную стоимость передержки необходимо согласовать с ситтером
                            </Typography>
                        </Box>
                        </Box>

                        <Button variant='contained' sx={{margin:'0 auto', marginTop:'40px', marginBottom:'20px'}}>Подтвердить</Button>

                    </Box>
                </Paper>
            </Box>
        </>
    )
}

export default Request