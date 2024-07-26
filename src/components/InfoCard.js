import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import CoinIcon from '@mui/icons-material/MonetizationOn'; // Using a coin icon from MUI icons
import { formatCurrencySmart } from '@/helpers/formatter';

const InfoCard = ({ sx = {}, value, label, plus = false }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        ml: '11px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        userSelect: 'none',
        ...sx
      }}
    >
     <Box p={'10px'}>
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pb: "5px"
            }}
        >
            <img width={20} height={20} src='/icons/golden-toncoin.png' />
            <Typography 
                sx={{
                    fontFamily: 'Roboto',
                    fontSize: 14,
                    fontWeight: '500',
                    textAlign: 'left',
                    pl: '8px',
                }}
            >{`${plus ? '+' : ''}`}{formatCurrencySmart(value)}</Typography>
        </Box>
        <Typography 
            sx={{
                fontFamily: 'Roboto',
                fontSize: 10,
                fontWeight: '400',
                textAlign: 'center',
                color: 'rgba(191, 193, 202, 1)'
            }}
        >{label}
        </Typography>
     </Box>
    </Box>
  );
};

export default InfoCard;
