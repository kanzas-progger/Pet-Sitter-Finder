import React from 'react'
import RequestCard from '../../Components/RequestCard/RequestCard'
import { Box, Paper, Typography, FormControl, Select, MenuItem } from '@mui/material'
import { getRequests } from '../../api/requests'
import { useEffect, useState } from 'react'

const RequestList = () => {

    const [requests, setRequests] = useState([])
    const [status, setStatus] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getRequests()
                setRequests(response.data)
                console.log(response.data)
            } catch (e) {
                console.error(e)
            }
        }

        fetchData()
    }, [])

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    }

    const statusGroups = {
        "": [],
        "New": ["New"],
        "Accepted": ["Accepted", "AcceptedAndDatesIsDisabled"],
        "Processing": ["Processing"]
    }

    // Фильтрация заявок по выбранному статусу
    const filteredRequests = status
        ? requests.filter(request => statusGroups[status].includes(request.status))
        : requests

    // Маппинг для отображения названий статусов на русском
    const statusLabels = {
        "": "Любые",
        "New": "Новые",
        "Accepted": "Принятые",
        "Processing": "В ожидании"
    }

    return (
        <>
            <Box sx={{ padding: '20px 10%', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                <Box sx={{
                    display: 'flex',
                    gap: '20px',
                    width: '100%',
                    alignItems: 'stretch'
                }}>
                    <Paper elevation={3} sx={{
                        backgroundColor: '#D0EFB1',
                        padding: '20px',
                        width: '70%',
                        boxSizing: 'border-box',
                        //borderRadius: 3,
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '22px' }}>
                            Мои заявки
                        </Typography>
                    </Paper>

                    <Paper elevation={3} sx={{
                        backgroundColor: '#D0EFB1',
                        padding: '20px',
                        width: '30%',
                        boxSizing: 'border-box',
                        //borderRadius: 3,
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>
                            Фильтрация
                        </Typography>
                    </Paper>
                </Box>

                <Box sx={{
                    display: 'flex',
                    gap: '20px',
                    width: '100%'
                }}>

                    <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '70%', boxSizing: 'border-box' }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            width: '100%'
                        }}>
                            {requests.length === 0 ? (
                                <Typography sx={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center', marginTop:'20px'}}>
                                    Заявки еще не созданы
                                </Typography>
                            ) :
                                filteredRequests.length > 0 ? (
                                    filteredRequests.map((r) => (
                                        <RequestCard key={r.requestId} request={r} />
                                    ))
                                ) : (
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center', marginTop:'20px' }}>
                                        Заявок с таким статусом нет
                                    </Typography>
                                )
                            }
                        </Box>

                    </Paper>

                    <Box sx={{ display: 'flex', width: '30%', gap: '20px', flexDirection: 'column', overflow: 'hidden' }}>

                        <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>Статус</Typography>
                            <FormControl fullWidth size='small' sx={{ marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}>
                                <Select
                                    value={status}
                                    onChange={handleStatusChange}
                                    displayEmpty
                                >
                                    <MenuItem value="">Любые</MenuItem>
                                    {Object.keys(statusGroups).filter(key => key !== "").map((key) => (
                                        <MenuItem key={key} value={key}>
                                            {statusLabels[key] || key}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Paper>
                    </Box>
                </Box>
            </Box>

        </>
    )
}

export default RequestList