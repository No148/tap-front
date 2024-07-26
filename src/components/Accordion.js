import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import MuiAccordionSummary from '@mui/material/AccordionSummary';

const Arrow = () => (
  <svg width="8" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.00028 8C7.00073 8.23365 6.91936 8.46009 6.77028 8.64L1.77028 14.64C1.60054 14.8442 1.35663 14.9726 1.0922 14.997C0.827773 15.0214 0.564492 14.9397 0.360275 14.77C0.156059 14.6003 0.0276347 14.3563 0.00325492 14.0919C-0.0211248 13.8275 0.0605366 13.5642 0.230275 13.36L4.71028 8L0.390275 2.64C0.307209 2.53771 0.245178 2.42001 0.207746 2.29368C0.170314 2.16734 0.15822 2.03485 0.17216 1.90382C0.186099 1.77279 0.225796 1.64581 0.288969 1.53017C0.352143 1.41453 0.437548 1.31252 0.540275 1.23C0.643096 1.13842 0.763723 1.06906 0.894597 1.02627C1.02547 0.983475 1.16377 0.968172 1.30083 0.981315C1.4379 0.994457 1.57077 1.03576 1.69113 1.10265C1.81148 1.16953 1.91673 1.26055 2.00028 1.37L6.83028 7.37C6.95579 7.55508 7.01565 7.7769 7.00028 8Z"
      fill="#1F4B7F"/>
  </svg>
)

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary expandIcon={<Arrow/>}{...props}/>
))(({ theme }) => ({
  minHeight: 0,
  backgroundColor: 'transparent',
  fontWeight: 700,
  fontSize: 16,
  color: theme.palette.mode === 'dark' ? '#6267D5' : '#1F4B7F',
  borderRadius: 4,
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    margin: 0
  },
  '&.Mui-expanded': {
    minHeight: 0,
    margin: 0
  }

}));

function Accordions({ title, children }) {
  return (
    <Box>
      <Accordion
        sx={{ boxShadow: 'none', backgroundColor: 'unset', backgroundImage: 'unset', borderRadius: 16}}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
            <Typography
              sx={(theme) => ({
                marginLeft: 2.5,
                fontWeight: 500,
                fontSize: 16,
                color: theme.palette.mode === 'dark' ? '#5dbfd3' : '#1F4B7F',
              })}>{title}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            sx={(theme) => ({
              color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : '#000000',
              fontWeight: 400,
              fontSize: 18,
            })}>
            {children}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default Accordions
