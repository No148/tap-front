import { Box, Grid, Link } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import AppShortcutIcon from '@mui/icons-material/AppShortcut'
import { useMediaMobile } from '@/hooks/useMedia'

const MainPage = (props) => {
  const isMobile = useMediaMobile()
  const [loginFailed, setFailed] = useState(false)

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        sx={{
          padding: 2,
          marginTop: '18px',
          textAlign: 'center',
          backgroundColor: '#F3AAA7',
          borderRadius: '12px',
          fontSize: '16px',
        }}
      >
        Access denied. Please contact our manager to get permission via
        Telegram 
      </Box>
    </Grid>
  )
}

export default MainPage
