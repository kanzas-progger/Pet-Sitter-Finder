import React from "react";
import { useState } from "react";
import './Registration.css'
import MainHeader from '../../Components/MainHeader/MainHeader'
import { Typography, Link, Button, Checkbox, ListItemText,
     FormLabel, Select, MenuItem, InputLabel,OutlinedInput, FormControl, FormControlLabel, 
     RadioGroup,Radio, Box,TextField, Paper, Container} from "@mui/material";
import axios from 'axios'

const Registration = () => {

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
        "Фермерские животные": "FarmPets",
        "Пауки": "Spider",
        "Рептилии": "Reptile",
        "Грызуны": "SmallPet",
        "Птички": "Bird",
        "Рыбки": "Fish",
    };

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

    const [animalName, setAnimalName] = React.useState([]);
    const [animalIsValid, setAnimalIsValid] = useState(false);
    const [role, setRole] = useState("owner")
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        age: '',
        login: '',
        password: '',
        confirmPassword: '',

    })


    const handleSubmit = async (e) => {
        e.preventDefault();

        const translatedAnimals = animalName.map(name => animalTranslations[name]);

        const dataToSend = {
            ...formData,
            age: parseInt(formData.age, 10),
            animals: translatedAnimals,
            role: role,
        };

        console.log("Отправляемые данные:", dataToSend);

        try {
            const response = await axios.post('https://localhost:5000/authentication/register', dataToSend, 
                {withCredentials:true}
            )
            console.log("Успешная регистрация!")
            //navigate("/sitters")
        }
        catch(error)
        {
            console.log("Произошла ошибка регистрации")
        }
    }

    const handleAnimalChange = (e) => {
        const {
            target: { value },
        } = e;
        setAnimalName(typeof value === 'string' ? value.split(',') : value);
        //setAnimalIsValid(false)
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [id]: value }));
    }



    return (
        <>
            <MainHeader />
            <Container maxWidth="lg" sx ={{width:'100%',margin:'0,auto',
                '&>*':{transform:'scale(var(--scale,1))', 
                transformOrigin:'center', 
                transition: 'transform 0.2s ease-in-out',}}}>
            <div className="registration-container">
                <Paper elevation={3} sx={{ padding: '30px'}}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <h2>Регистрация</h2>
                    </Box>
                    <Box component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '30px' }}>
                        <TextField id="firstname"
                            label="Ваше имя"
                            variant="outlined"
                            required
                            value={formData.firstname}
                            onChange={handleInputChange} />
                        <TextField id="lastname"
                            label="Ваша фамилия"
                            variant="outlined"
                            required
                            value={formData.lastname}
                            onChange={handleInputChange} />
                        <TextField
                            id="age"
                            label="Ваш возраст"
                            type="number"
                            required
                            value={formData.age}
                            onChange={handleInputChange} />
                        <TextField id="login"
                            label="Логин"
                            variant="outlined"
                            required
                            value={formData.login}
                            onChange={handleInputChange} />
                        <TextField id="password"
                            label="Пароль"
                            variant="outlined"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleInputChange} />
                        <TextField id="confirmPassword"
                            label="Повтор пароля"
                            variant="outlined"
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={handleInputChange} />

                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="demo-multiple-checkbox-label">Животные *</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={animalName}
                                onChange={handleAnimalChange}
                                input={<OutlinedInput label="Animals" />}
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

                        <FormControl sx={{ alignItems: 'left', textAlign: 'left', marginLeft: '13px' }}>
                            <FormLabel id="role" sx={{ marginBottom: '15px' }}>Ваша роль</FormLabel>
                            <RadioGroup value={role} onChange={(e) => setRole(e.target.value)}>
                                <FormControlLabel value="owner" control={<Radio />} label="Владелец животного" />
                                <FormControlLabel value="sitter" control={<Radio />} label="Ситтер" />
                            </RadioGroup>
                        </FormControl>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Button type="submit" variant="contained" sx={{ fontSize: '16px' }}>Создать аккаунт</Button>
                        </Box>
                    </Box>

                </Paper>

                <Paper elevation={3} sx={{ padding: '15px', marginTop: '30px', marginBottom: '30px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="body2" fontSize="16px">
                            Уже зарегистрированы?
                        </Typography>
                        <Link
                            href="/authentication/login"
                            underline="none"
                            sx={{
                                extDecoration: 'none',
                                marginLeft: '5px',
                                '&:hover': { textDecoration: 'underline' }
                            }}>
                            Войдите
                        </Link>
                    </Box>
                </Paper>
            </div>
            </Container>
        </>
    )

}

export default Registration;