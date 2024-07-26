import React from 'react'
import { Box } from '@mui/material'
import DesktopAccessDisabledIcon from '@mui/icons-material/DesktopAccessDisabled'
import QRCode from 'react-qr-code'
import { useRouter } from 'next/router'

const Wrn = () => {
  const router = useRouter()

  return (
    <Box sx={{
        padding: '35px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box>
        <DesktopAccessDisabledIcon sx={{ fontSize: '44px' }}/>
      </Box>
      <span>
        Sorry, no access from desktop at this moment. Please use your mobile phone!
        You can start game by scan this QR code:
        <br/><br/>
      </span>

      <QRCode 
        size={240}
        value={`https://t.me/SecretPadBot/app?startapp=r${router.query.ref}`}
      />
    </Box>
  )
}

export default Wrn
