import { ContentCopy } from '@mui/icons-material'
import { Box, Button, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { checkWhitelist } from '@/helpers/auth'
import { getHeaders, filterSymbols, parseWebappData } from '@/helpers/utils'

const useStyles = (theme) => ({
  container: {
    position: 'relative',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    // padding: '10px',
    // background: 'white',
    // borderRadius: 10,
  },
  card: {
    background: 'white',
    borderRadius: 10,
  },
})

const Device = ({ hiddenMode = false }) => {
  const theme = useTheme()
  const classes = useStyles(theme)
  const router = useRouter()

  const [known, setKnown] = useState(false)
  const [username, setUsername] = useState(false)
  const [desktop, setDesktop] = useState(false)

  useEffect(() => {
    loadInfo()
  }, [])

  const loadInfo = async () => {
    if (
      window.location.pathname.includes('no-access') ||
      window.location.pathname == '/'
    ) {
      return false
    }

    let user = localStorage.getItem('tg_username') || null
    const newUser = parseWebappData()

    if (newUser && newUser != user) {
      localStorage.setItem('tg_username', newUser)
      setTimeout(() => window.location.reload(), 600)
      // user = newUser
      return true
    }

    // if no user in localStorage and no user detected from tgWebAppData - go on login screen
    if (!user && !newUser) {
      window.location = '/no-access'
    }
  }

  const addToClipboard = () => {
    navigator.clipboard.writeText(agent)
  }

  if (hiddenMode || desktop) return <></>

  return (
    <Box>
      {known && (
        <Box
          sx={{
            marginTop: '10px',
            background: '#A8EC8E',
            color: 'black',
            padding: '12px',
          }}
        >
          Know user = {known}!
        </Box>
      )}
      Your agent is '{agent}'
    </Box>
  )
}

export default Device
