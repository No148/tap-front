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

const pages = [
  {
    url: '/game/friends',
    label: 'Refs',
    icon: <LeaderboardIcon />,
  },
  {
    url: '/game/tasks',
    label: 'Task',
    icon: <AssignmentTurnedInIcon />,
  },
  {
    url: '/game',
    label: 'Tap',
    icon: <SmartToyIcon />,
  },
  {
    url: '/game/boost',
    label: 'Boost',
    icon: <Diversity3Icon />,
  },
  {
    url: '/game/stats',
    label: 'Stats',
    icon: <LeaderboardIcon />,
  },
]

const Layout = ({ children, backlink, fullwidth = false }) => {
  const router = useRouter()
  const [value, setValue] = useState(router.pathname)

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        {/* <Device hiddenMode={true} /> */}
        <Container
          sx={{
            flex: 1,
            p: 0,
            padding: '0 !important',
            color: '#FDC485',
            maxWidth: '100% !important',
            background: ' rgb(31,34,41)',
            backgroundImage:
              'linear-gradient(rgba(253, 196, 133, 0.37), rgba(253, 196, 133, 0))',
          }}
        >
          <Card sx={{
            maxHeight: '650px',
            overflow: 'auto',
            backgroundColor: 'transparent',
            color: '#FDC485',
          }}>
            {children}
          </Card>

          
          <Box
            sx={{
              position: 'absolute',
              bottom: '0px',
              width: '100%',
            }}
          >
            <BottomNavigation
              showLabels
              value={value}
              sx={{
                gap: '3px',
                height: 'auto',
                margin: '0 8px',
                background: 'transparent',
              }}
              onChange={(event, newValue) => {
                router.push(newValue)
              }}
            >
              {pages.map((item) => {
                return (
                  <BottomNavigationAction
                    key={item.label}
                    label={item.label}
                    value={item.url}
                    icon={item.icon}
                    sx={{
                      minWidth: 'auto',
                      backgroundColor: '#2B2D36',
                      color: '#BFC1CA',
                      fontSize: 14,
                      padding: '16px 0',
                      borderRadius: '15px',
                      ...(item.url === value && {
                        color: '#BFC1CA',
                        backgroundImage:
                          'linear-gradient(rgba(253, 196, 133, 0.37), rgba(253, 196, 133, 0))',
                        border: '1px solid #FDC485',
                      }),
                    }}
                    classes={{
                      selected: {
                        color: 'green',
                        fontSize: 20,
                      },
                    }}
                  />
                )
              })}
            </BottomNavigation>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default Layout
