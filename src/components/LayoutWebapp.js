import getConfig from 'next/config'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Container,
  Card,
} from '@mui/material'
import 'aos/dist/aos.css'

import { useRouter } from 'next/router'
import { useState } from 'react'
import { TwaAnalyticsProvider } from '@tonsolutions/telemetree-react'
const { publicRuntimeConfig } = getConfig()
const { domainName } = publicRuntimeConfig

const Layout = ({ children, backlink, fullwidth = false }) => {
  return (
    <>
      <TwaAnalyticsProvider
        projectId='a98a6058-91aa-405b-a0b8-d66188e1efeb'
        apiKey='a8fdcb92-94af-4938-98be-929a1fbca0d9'
        appName={domainName.includes('-dev') ? 'secret-pad-dev' : 'secret-pad-game'}
      >
        <Box sx={{ display: 'flex' }}>
          {/* <Device hiddenMode={true} /> */}
          <Container
            sx={{
              flex: 1,
              p: 0,
              padding: '0 !important',
              color: '#FDE0B4',
              maxWidth: '100% !important',
            }}
          >
            {children}
          </Container>
        </Box>
      </TwaAnalyticsProvider>
    </>
  )
}

export default Layout
