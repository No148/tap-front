import React, { createContext, useContext, useState, useCallback } from 'react'
import { Alert, Snackbar } from '@mui/material/'
import CheckIcon from '@mui/icons-material/Check'
import ErrorIcon from '@mui/icons-material/Error';

const SnackbarContext = createContext()

export const SnackbarProvider = ({ children }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [barType, setBarType] = useState('info')

  const snackbar = useCallback((message, isError = false) => {
    if (isError) setBarType('error')
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }, [])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return true
    setSnackbarOpen(false)
    setBarType('info')
  }

  const closeSnackbar = () => {
    setSnackbarOpen(false)
    setBarType('info')
  }

  return (
    <SnackbarContext.Provider value={{ snackbar, closeSnackbar }}>
      {children}
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          zIndex: '10000',

        }}
        open={snackbarOpen}
        onClose={handleClose}
      >
        <Alert severity={barType == 'error' ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  return useContext(SnackbarContext)
};
