import React from 'react'
import {
    Paper, Box, Typography, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextareaAutosize, FormControl, Select, MenuItem, Checkbox, TextField, IconButton, OutlinedInput, ListItemText
} from "@mui/material"
import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import useProfile from '../../hooks/useProfile'
import CardBoard from '../CardBoard/CardBoard'
import CloseIcon from '@mui/icons-material/Close';
import { createBoard, getBoardsForSitter, deleteBoard } from '../../api/boards'
import useAuth from '../../hooks/useAuth'

const EditBoardings = () => {


    const navigate = useNavigate()
    const [boards, setBoards] = useState([])
    const [content, setContent] = useState();
    const [pricePerDay, setPrice] = useState();
    const [animalName, setAnimalName] = useState([]);
    const { profile, setProfile } = useProfile()
    const {auth, setAuth} = useAuth() ////

     useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await getBoardsForSitter(auth.userId)
                    setBoards(response.data)
                } catch (e) {
                    console.error("Error of receiving boards: ", e)
                }
            }
    
            fetchData()
        }, [])

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

    const [openToCreate, setOpenToCreate] = useState(false);

    const handleClickOpenToCreate = () => {
        setOpenToCreate(true);
    }
    const handleCloseToCreate = () => {
        setOpenToCreate(false);
    }

    const handleCreateBoard = async (e) => {
        e.preventDefault()

        const animals = animalName.map(name => animalTranslations[name])
        const dataToSend = { animalNames: animals, content: content, price: parseInt(pricePerDay, 10) }

        try {
            const response = await createBoard(dataToSend)
            console.log(response.data)
            setBoards((prev) => [response.data, ...prev])
        } catch (e) {
            console.error(e)
        }

        handleCloseToCreate()
        setAnimalName([])
        setContent()
        setPrice()
    }

    const handleDeleteBoard = async (id) => {
            await deleteBoard(id)
            setBoards((prevState) =>
                prevState.filter((board) => board.id !== id)
            )
        }

    return (
        <>
            <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Мои объявления</Typography>
                <Divider sx={{ marginTop: '20px' }} />

                <Box sx={{ marginTop: '20px' }}>
                    <Typography sx={{ color: '#6b7280' }}>Здесь вы можете создать объявления по передержке животных с указанием цены</Typography>
                </Box>

                <Button variant="contained" color="primary" sx={{ marginTop: '30px' }} onClick={handleClickOpenToCreate}>
                    Создать объявление
                </Button>
                <Divider sx={{ marginTop: '20px' }} />

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '20px',
                        justifyItems: 'center',
                    }}
                >
                    {boards.map((b) => (
                        <CardBoard key={b.id} board={b} onHandleDelete={handleDeleteBoard}/>
                    ))}

                </Box>
            </Paper>

            <Dialog
                onClose={handleCloseToCreate}
                aria-labelledby="customized-dialog-title"
                open={openToCreate}
                fullWidth={true}
                maxWidth="sm"
            >
                <form onSubmit={handleCreateBoard}>
                <DialogTitle sx={{ m: 0, p: 2, backgroundColor: '#b3d89c', fontWeight: 'bold' }} id="customized-dialog-title">
                    Создать объявление
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseToCreate}
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
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Текст объявления</Typography>
                    <TextField
                        id='content'
                        required
                        value={content || ""}
                        onChange={(e) => setContent(e.target.value)}
                        multiline
                        minRows={4}
                        placeholder="Введите текст объявления..."
                        size='small'
                        sx={{
                            width: '100%',
                            marginTop: '10px',
                            '& .MuiOutlinedInput-root': { background: '#e0e0e0' },
                            '& textarea': { overflow: 'hidden', resize: 'none' }
                        }}
                    />

                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>Животные</Typography>
                    <FormControl size='small' required sx={{ width: '100%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}>
                        <Select
                            id="demo-multiple-checkbox"
                            multiple
                            value={animalName}
                            onChange={handleAnimalChange}
                            input={<OutlinedInput />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {animals
                                .filter((name) => profile?.animals?.includes(animalTranslations[name]))
                                .map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={animalName.includes(name)} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>Цена за сутки</Typography>
                    <TextField
                        id="price"
                        onChange={(e) => setPrice(e.target.value)}
                        size="small"
                        type="number"
                        required
                        sx={{ width: '100%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
                    />

                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#b3d89c' }}>
                    <Button type='submit' variant="contained">
                        Создать
                    </Button>
                </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export default EditBoardings