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
import utc from 'dayjs/plugin/utc';
import CalendarPicker from '../../Components/CalendarPicker/CalendarPicker';
import { createRequest } from '../../api/requests';
import { getShortOwnerAnimalProfilesData } from '../../api/animals';

const Request = () => {

    dayjs.extend(utc);

    const location = useLocation();
    const navigate = useNavigate();

    const [selectPets, setSelectPets] = useState('fromSitterBoardAnimals')
    const { boardAnimals, boardPrice, boardId, sitterId } = location.state || {}
    const [petsCount, setPetsCount] = useState(Object.fromEntries(boardAnimals.map(a => [a, 1])))  // if owner pets set to owner pest and count
    const [ownerAnimalProfiles, setOwnerAnimalProfiles] = useState([])

    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs().add(1, 'day'));
    const [daysDifference, setDaysDifference] = useState(1);
    const [ownerMessage, setOwnerMessage] = useState('')

    const updateDaysDifference = (start, end) => {
        const diff = end.diff(start, 'day');
        setDaysDifference(diff);
    };

    useEffect(() => {
        const fetchOwnerAnimals = async() => {
            try{
                const translatedBoardAnimals = boardAnimals.map(a => animalTranslations[a])
                const response = await getShortOwnerAnimalProfilesData(translatedBoardAnimals)
                setOwnerAnimalProfiles(response.data)
                console.log("ownerAnimals is ", response.data)
                console.log("board animals is ", boardAnimals)
            }catch(e){
                console.error(e)
            }
        }

        fetchOwnerAnimals()
    }, [])

    // useEffect(() => {
    //     if (!boardAnimals || !boardPrice ) {
    //         navigate("/");
    //     }
    // }, [boardAnimals, boardPrice, navigate]);

    // Инициализация начальных дат
useEffect(() => {
    const today = dayjs();
    const availablePeriods = findNextAvailablePeriod(today);
    
    if (availablePeriods.length > 0) {
        const firstPeriod = availablePeriods[0];
        setStartDate(firstPeriod.start);
        setEndDate(firstPeriod.start.add(1, 'day'));
        updateDaysDifference(firstPeriod.start, firstPeriod.start.add(1, 'day'));
        setError('');
    }
}, []);

    const disabledPeriods = [
        { startDate: "2025-04-03T12:34:56Z", endDate: "2025-04-06T12:34:56Z" },
        { startDate: "2025-04-09T12:34:56Z", endDate: "2025-04-13T12:34:56Z" }
    ]

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

    const animalCountTranslations = {
        "Собаки": "собак",
        "Кошки": "кошек",
        "Фермерские животные": "фермерских животных",
        "Пауки": "пауков",
        "Рептилии": "рептилий",
        "Грызуны": "грызунов",
        "Птички": "птичек",
        "Рыбки": "рыбок",
    }

    // const ownerAnimals = [
    //     'Метяся (собака)',
    //     'Женька (кошка)'
    // ];
    const ownerAnimals = ownerAnimalProfiles?.map(a => a.name)

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
    const [error, setError] = useState('');

    const isDateInDisabledPeriods = (date) => {
        return disabledPeriods.some(period => {
            const periodStart = dayjs(period.startDate);
            const periodEnd = dayjs(period.endDate);
            return date.isBetween(periodStart, periodEnd, 'day', '[]');
        });
    };

    const handleChangeStartDate = (newDate) => {
        if (endDate.diff(newDate, 'day') < 1) {
            const newEndDate = newDate.add(1, 'day');
            
            if (isDateInDisabledPeriods(newEndDate) || !isValidDateRange(newDate, newEndDate)) {
                setError('Выбранный период содержит заблокированные даты');
            } else {
                setError('');
                setStartDate(newDate);
                setEndDate(newEndDate);
                updateDaysDifference(newDate, newEndDate);
            }
        } else {
            if (!isValidDateRange(newDate, endDate)) {
                setError('Выбранный период содержит заблокированные даты');
            } else {
                setError('');
                setStartDate(newDate);
                updateDaysDifference(newDate, endDate);
            }
        }
    };
    
    const handleChangeEndDate = (newDate) => {
        if (newDate.diff(startDate, 'day') >= 1) {
            if (isDateInDisabledPeriods(newDate) || !isValidDateRange(startDate, newDate)) {
                setError('Выбранный период содержит заблокированные даты');
            } else {
                setError('');
                setEndDate(newDate);
                updateDaysDifference(startDate, newDate);
            }
        }
    };

    const handleAnimalChange = (e) => {
        const {
            target: { value },
        } = e;
        setAnimalName(typeof value === 'string' ? value.split(',') : value);
    }

    const handleSelectPets = (e) => {
        setSelectPets(e.target.value)
        setAnimalName([])
    }

    const handlePetsCount = (e, animal) => {
        const count = Math.max(1, parseInt(e.target.value) || 1)

        setPetsCount(prev => ({
            ...prev,
            [animal]: count
        }))
    }

    // const getTotalSelectedPetsCount = () => {
    //     return animalName.reduce((total, animal) => total + petsCount[animal], 0)
    // }
    const getTotalSelectedPetsCount = () => {
        if (selectPets === 'fromAnimalProfiles') {
            return animalName.reduce((total, animal) => {
                const animalProfile = ownerAnimalProfiles.find(profile => profile.name === animal);
                return total + (animalProfile ? animalProfile.count : 0);
            }, 0);
        } else {
            return animalName.reduce((total, animal) => total + petsCount[animal], 0);
        }
    }

    const getValidDaysValue = () => {
        return daysDifference === 1 ? "сутки" : "суток"
    }

    const getTotalPrice = () => {
        return boardPrice * getTotalSelectedPetsCount() * daysDifference
    }

    //new date logic

    const findNextAvailablePeriod = (currentDate) => {
        let availablePeriods = [];
        let currentPeriodStart = null;
        let date = currentDate.clone();
        
        // Проверяем следующие 365 дней
        for (let i = 0; i < 365; i++) {
            if (!isDateInDisabledPeriods(date)) {
                if (!currentPeriodStart) {
                    currentPeriodStart = date.clone();
                }
            } else {
                if (currentPeriodStart) {
                    availablePeriods.push({
                        start: currentPeriodStart,
                        end: date.subtract(1, 'day')
                    });
                    currentPeriodStart = null;
                }
            }
            date = date.add(1, 'day');
        }
        
        // Добавляем последний период, если он есть
        if (currentPeriodStart) {
            availablePeriods.push({
                start: currentPeriodStart,
                end: date.subtract(1, 'day')
            });
        }
    
        // Фильтруем периоды длиной более 1 дня
        return availablePeriods.filter(period => 
            period.end.diff(period.start, 'day') >= 1
        );
    };
    
    const isValidDateRange = (start, end) => {
        // Проверяем, что между датами нет заблокированных периодов
        let currentDate = start.clone();
        while (currentDate.isBefore(end, 'day') || currentDate.isSame(end, 'day')) {
            if (isDateInDisabledPeriods(currentDate)) {
                return false;
            }
            currentDate = currentDate.add(1, 'day');
        }
        return true;
    };

    // const handleCreateRequest = async () => {

    //     const totalPrice = getTotalPrice()

    //     const animalsData = animalName.map(animal => {

    //         const animalProfileId = selectPets === 'fromAnimalProfiles' ? "4567f41e-7a7f-47db-a5dd-8635e4d14a8f" : null;
            
    //         return {
    //             name: animalTranslations[animal],
    //             count: petsCount[animal],
    //             animalProfileId: animalProfileId
    //         };
    //     });

    //     const dataToSend = {
    //         boardId: boardId,
    //         sitterId: sitterId,
    //         animals: animalsData,
    //         totalPrice: totalPrice,
    //         startDate: startDate.utc().format(),
    //         endDate: endDate.utc().format(),
    //         ownerMessage: ownerMessage.length === 0 ? null : ownerMessage
    //     }

    //     try {
    //         const response = await createRequest(dataToSend)
    //         console.log(response.data)
    //     } catch(e){
    //         console.error(e)
    //     }

    //     console.log("SendDataToRequest: ", dataToSend)
    // }

    const handleCreateRequest = async () => {
        const totalPrice = getTotalPrice()
    
        const animalsData = animalName.map(animal => {
            // Если выбираем из профилей владельца, находим соответствующий профиль животного
            let animalProfileId = null;
            let count = petsCount[animal];
            
            if (selectPets === 'fromAnimalProfiles') {
                const animalProfile = ownerAnimalProfiles.find(profile => profile.name === animal);
                if (animalProfile) {
                    animalProfileId = animalProfile.animalProfileId;
                    count = animalProfile.count; // Используем количество из профиля
                }
            }
            
            return {
                name: selectPets === 'fromAnimalProfiles' ? 
                      ownerAnimalProfiles.find(profile => profile.name === animal)?.animalName : 
                      animalTranslations[animal],
                count: count,
                animalProfileId: animalProfileId
            };
        });
    
        const dataToSend = {
            boardId: boardId,
            sitterId: sitterId,
            animals: animalsData,
            totalPrice: totalPrice,
            startDate: startDate.utc().format(),
            endDate: endDate.utc().format(),
            ownerMessage: ownerMessage.length === 0 ? null : ownerMessage
        }
    
        try {
            const response = await createRequest(dataToSend)
            console.log(response.data)
        } catch(e){
            console.error(e)
        }
    
        console.log("SendDataToRequest: ", dataToSend)
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

                        <Box sx={{ margin: '0 auto' }}>
                            <Typography sx={{ fontWeight: 'bold', color: 'black', fontSize: '18px', textAlign: 'center' }}>
                                Указать животных из списка
                            </Typography>

                            <FormControl size='small' fullWidth sx={{ marginTop: '10px', background: '#b3d89c' }}>
                                <Select
                                    value={selectPets}
                                    onChange={handleSelectPets}
                                    sx={{ width: '320px' }}
                                >
                                    <MenuItem value={'fromSitterBoardAnimals'}>Объявления ситтера</MenuItem>
                                    <MenuItem value={'fromAnimalProfiles'}>Профилей ваших питомцев</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ margin: '0 auto' }}>
                            <Box sx={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>

                                    <Typography sx={{ fontWeight: 'bold', color: 'black', fontSize: '18px', textAlign: 'center' }}>
                                        Ваши питомцы
                                    </Typography>

                                    <FormControl size='small' sx={{ width: '320px', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#b3d89c' } }}>
                                        <Select
                                            id="demo-multiple-checkbox"
                                            multiple
                                            value={animalName}
                                            onChange={handleAnimalChange}
                                            input={<OutlinedInput />}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                        >
                                            {(selectPets === 'fromSitterBoardAnimals' ? boardAnimals : ownerAnimals).map((name) => (
                                                <MenuItem key={name} value={name}>
                                                    <Checkbox checked={animalName.includes(name)} />
                                                    <ListItemText primary={name} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    {animalName.map((animal, index) => (
                                        <Box key={animal} sx={{ marginTop: index > 0 ? '10px' : '0px' }}>
                                            <Typography sx={{ fontWeight: 'bold', color: 'black', fontSize: '18px', textAlign: 'center' }}>
                                                Количество {animalCountTranslations[animal]}
                                            </Typography>

                                            <TextField
                                                type="number"
                                                size='small'
                                                onChange={(e) => handlePetsCount(e, animal)}
                                                value={selectPets === 'fromAnimalProfiles' ? 
                                                    ownerAnimalProfiles.find(profile => profile.name === animal)?.count : 
                                                    petsCount[animal]}
                                                required
                                                disabled={selectPets === 'fromAnimalProfiles'}
                                                sx={{ width: '320px', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#b3d89c' } }}
                                            />
                                        </Box>

                                    ))}
                                </Box>


                            </Box>


                            <Box sx={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography sx={{ textAlign: 'center', marginBottom: '10px', fontWeight: 'bold', color: 'black', fontSize: '18px' }}>Отдадите</Typography>
                                        <CalendarPicker
                                            disabledPeriods={disabledPeriods}
                                            value={startDate}
                                            onChange={handleChangeStartDate} />
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography sx={{ textAlign: 'center', marginBottom: '10px', fontWeight: 'bold', color: 'black', fontSize: '18px' }}>Заберете</Typography>
                                        <CalendarPicker
                                            disabledPeriods={disabledPeriods}
                                            value={endDate}
                                            onChange={handleChangeEndDate}
                                            minDate={startDate.add(1, 'day')} />
                                    </Box>
                                </LocalizationProvider>
                            </Box>

                            <Box sx={{ marginTop: '20px' }}>
                                <Typography sx={{ fontWeight: 'bold', color: 'black', fontSize: '18px', textAlign: 'center' }}>
                                    Сообщение ситтеру
                                </Typography>

                                <TextareaAutosize
                                    minRows={4}
                                    value={ownerMessage}
                                    onChange={(e) => setOwnerMessage(e.target.value)}
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

                            {(animalName.length > 0) && <>
                                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '20px', gap: '5px', background: '#b3d89c', width: '660px', padding: '20px', borderRadius: '12px' }}>
                                    <Typography sx={{ color: 'black', fontSize: '16px' }}>
                                        Формула расчета: {boardPrice} ₽ x количество животных ({getTotalSelectedPetsCount()}) x {daysDifference} {getValidDaysValue()}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 'bold', color: 'black', fontSize: '22px' }}>
                                        Примерная стоимость передержки : {getTotalPrice()} ₽
                                    </Typography>
                                    <Typography sx={{ color: 'black', fontSize: '16px' }}>
                                        Точную стоимость передержки необходимо согласовать с ситтером
                                    </Typography>
                                </Box>
                            </>}


                        </Box>

                        <Button 
                        variant='contained' 
                        sx={{ margin: '0 auto', marginTop: '40px', marginBottom: '20px' }}
                        onClick={handleCreateRequest}>Подтвердить</Button>

                    </Box>
                </Paper>
            </Box>
        </>
    )
}

export default Request