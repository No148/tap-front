import React from 'react'
import { useTheme } from '@mui/material/styles'
import { Checkbox, Typography } from '@mui/material'
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig()
const { mode } = publicRuntimeConfig
const useStyles = (theme) => ({
  chbroot: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  chbicon: {
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    boxShadow:
      'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: theme.palette.mode === 'dark' ? '#192131' : '#fff',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: mode === 'aptos' ? '#30e3af' : theme.palette.mode === 'dark' ? '#253CC6' : mode === 'sui' ? '#6fbcf0' : mode === 'ai' ? theme.palette.secondary.dark : '#8C1515',

    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(206,217,224,.5)' : '#fff',
    },
  },
  chbcheckedIcon: {
    borderRadius: '50%',
    backgroundColor: mode === 'aptos' ? '#30e3af' : theme.palette.mode === 'dark' ? '#253CC6' : mode === 'sui' ? '#6fbcf0' : mode === 'ai' ? theme.palette.secondary.dark : '#8C1515',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: '24px',
      height: '24px',
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg width='14' height='10' viewBox='0 0 14 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.11347 4.77507L0 5.81994L4.45449 10L14 1.04256L12.8841 0L4.45449 7.91026L1.11347 4.77507Z' fill='white'/%3E%3C/svg%3E\")",
      content: '""',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      filter: mode === 'aptos' ? 'invert(1)': 'unset',
    },
    'input:hover ~ &': {
      backgroundColor: mode === 'aptos' ? '#30e3af' : theme.palette.mode === 'dark' ? '#253CC6' : mode === 'sui' ? '#6fbcf0' : mode === 'ai' ? theme.palette.secondary.dark : '#8C1515',
    },
  },
})

export default function StyledCheckbox({ chbiconProps, ...restProp }) {
  const theme = useTheme()
  const classes = useStyles(theme)
  return (
    <Checkbox
      sx={classes.chbroot}
      disableRipple
      color='default'
      checkedIcon={
        <Typography
          component='span'
          sx={{
            // ...classes.chbicon,
            ...classes.chbcheckedIcon,
            ...chbiconProps,
          }}
        />
      }
      icon={<Typography component='span' sx={classes.chbicon}/>}
      inputProps={{ 'aria-label': 'decorative checkbox' }}
      {...restProp}
    />
  )
}
