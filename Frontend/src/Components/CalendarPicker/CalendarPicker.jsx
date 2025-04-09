import React from 'react'
import { Tooltip, Box, Typography } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

const CalendarPicker = ({ 
    disabledPeriods = [],
    disableTooltip,
    sx = {},
    title,
    value,
    onChange,
    minDate }) => {


    const isDateInDisabledPeriod = (date) => {
        if (minDate && date.isBefore(minDate, 'day')) {
            return true;
        }
        return disabledPeriods.some(period => {
            const start = dayjs(period.startDate);
            const end = dayjs(period.endDate);
            return date.isBetween(start, end, 'day', '[]');
        });
    };
    
    const renderDisabledDay = (props) => {
        const { day, outsideCurrentMonth, ...other } = props;
        const isDisabled = isDateInDisabledPeriod(day);
    
        return isDisabled ? (
            <Tooltip title={disableTooltip} arrow>
                <span>
                    <PickersDay {...other} day={day} outsideCurrentMonth={outsideCurrentMonth} disabled />
                </span>
            </Tooltip>
        ) : (
            <PickersDay {...other} day={day} outsideCurrentMonth={outsideCurrentMonth} />
        );
    };

    return (
        <>
            <DateCalendar
                value={value}
                onChange={onChange}
                shouldDisableDate={isDateInDisabledPeriod}
                slots={{ day: renderDisabledDay }}
                disablePast
                sx={{
                    backgroundColor: '#b3d89c',
                    borderRadius: title ? '12px 12px 0 0' : '12px',
                    padding: 0,
                    margin: 0,
                    '& .MuiPickersCalendarHeader-root': { padding: '8px' },
                    '& .MuiDayCalendar-root': { padding: '8px' },
                    '& .MuiPaper-root': { borderRadius: "12px" },
                    '& .MuiPickersDay-today': {
                        border: 'none !important',
                    },
                    ...sx
                }} />
            {title && (
                <Box
                    sx={{
                        backgroundColor: '#b3d89c',
                        borderRadius: '0 0 12px 12px',
                        padding: '10px'
                    }}
                >
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>
                        {title}
                    </Typography>
                </Box>
            )}
        </>
    )
}

export default CalendarPicker