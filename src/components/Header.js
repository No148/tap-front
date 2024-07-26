import MenuIcon from '@mui/icons-material/Menu'
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'
import AppBar from '@mui/material/AppBar'
import { useTheme } from '@mui/material/styles'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
// import AddFeedbackModal from './AddFeedbackModal'
import Link from './Link'
import dynamic from 'next/dynamic'
import ThemeChanger, { DarkIcon, LightIcon } from '@/components/ThemeChanger'
import { fireMenuOpen } from '@/components/events'
import { useMaxWidth } from '@/hooks/useMedia'

const { publicRuntimeConfig } = getConfig()
const { project, mode } = publicRuntimeConfig

const useStyles = (theme) => ({
  toolbar: {
    paddingLeft: '16px',
    paddingRight: '16px',

    [theme.breakpoints.up('md')]: {
      paddingLeft: '24px',
      paddingRight: '24px',
    },
  },
  title: {
    fontSize: 18,
    color: '#fff',
    lineHeight: 1,
    whiteSpace: 'nowrap',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 900,
    color: '#ffffff',
  },
  appBar: {
    boxShadow: 'unset',
    backgroundColor: theme.palette.mode === 'dark' ? '#0A0A0C' : '#E2E2E2',
    zIndex: 7000,
    borderBottom: `1px solid ${
      theme.palette.mode === 'dark' ? '#191D28' : '#CAC9C9'
    }`,
  },
  appBarBlue: {
    backgroundColor: theme.palette.mode === 'dark' ? '#0A0A0C' : '#1FC7D4',
    borderBottom: `2px solid ${
      theme.palette.mode === 'dark' ? '#191D28' : 'transparent'
    }`,
    zIndex: 7000,
  },
  appBarNavy: {
    backgroundColor: theme.palette.mode === 'dark' ? '#0A0A0C' : '#3F8BCB', // '#212B72',
    borderBottom: `2px solid ${
      theme.palette.mode === 'dark' ? '#191D28' : 'transparent'
    }`,
    zIndex: 7000,
  },
  appBarRed: {
    backgroundColor: theme.palette.mode === 'dark' ? '#0A0A0C' : '#F2716A',
    borderBottom: `2px solid ${
      theme.palette.mode === 'dark' ? '#191D28' : 'transparent'
    }`,
    zIndex: 7000,
  },
  appBarPurple: {
    backgroundColor: theme.palette.mode === 'dark' ? '#0A0A0C' : '#21283F',
    borderBottom: `2px solid ${
      theme.palette.mode === 'dark' ? '#191D28' : 'transparent'
    }`,
    zIndex: 7000,
  },
  appBarGreen: {
    backgroundColor: theme.palette.mode === 'dark' ? '#0A0A0C' : '#70D44B',
    borderBottom: `2px solid ${
      theme.palette.mode === 'dark' ? '#191D28' : 'transparent'
    }`,
    zIndex: 7000,
  },

  logo: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 8,
  },
  logoLink: {
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
  },

  menuButton: {
    color: '#fff',
    marginRight: '16px',
    // [theme.breakpoints.up('md')]: {
    //   marginRight: '36px',
    // },
  },

  menuLink: {
    marginRight: '16px',
    padding: '11px',
    width: '150px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    lineHeight: '14px',
    color: '#fff',
    backgroundColor: theme.palette.mode === 'dark' ? '#171B25' : '#D2D2D2',
    borderRadius: '100px',
    textDecoration: 'unset',
    cursor: 'pointer',
    transition:
      'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      background: theme.palette.mode === 'dark' ? '#282E3E' : '#D2D2D2',
    },
  },

  bookDemo: {
    marginRight: '16px',
    padding: '11px',
    width: '150px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    lineHeight: '14px',
    color: '#fff',
    backgroundColor: theme.palette.mode === 'dark' ? '#171B25' : '#1f4b7f',
    borderRadius: '100px',
    textDecoration: 'unset',
    cursor: 'pointer',
    transition:
      'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      background: theme.palette.mode === 'dark' ? '#282E3E' : '#1f4b7f',
    },
  },

  menuLinkIcon: {
    marginRight: '8px',
  },
  menuLogo: {
    marginRight: 16,
    padding: 11,
    width: 150,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    lineHeight: '14px',
    color: '#fff',
    backgroundColor: theme.palette.mode === 'dark' ? '#171B25' : '#D2D2D2',
    borderRadius: 100,
    textDecoration: 'unset',
  },

  iconLink: {
    width: 26,
    height: 26,
    marginRight: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.mode === 'dark' ? '#2E3851' : '#0000000a',
    borderRadius: 100,
  },

  itemTextLink: {
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: 12,
    lineHeight: '14px',
    letterSpacing: '0.02em',
    color: '#ffffff',
    textDecoration: 'unset',
  },
  iconBtn: {
    marginRight: 18,
  },

  drawer: {
    height: '100%',
  },
  drawerBottom: {
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 28,
    paddingBottom: 24,
    fontSize: 12,
    color: '#AAC9F8',
  },

  itemText: {
    fontSize: 12,
    lineHeight: '14px',
    color: theme.palette.mode === 'dark' ? '#AAC9F8' : 'rgba(0, 0, 0, 0.8)',
    textDecoration: 'unset',
  },

  hr: {
    borderTop: '1px solid #191D28',
    width: '100%',
  },
})

const Header = (props) => {
  const { mobile } = props
  const { classProp } = props
  const theme = useTheme()
  const classes = useStyles(theme)
  const router = useRouter()
  const dex = `${router.query.dex || 'uniswap'}`
  const isTablet = useMaxWidth(1439)

  const [renderHeader, setRenderHeader] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)

  useEffect(() => {
    setRenderHeader(true)
  }, [])

  const toggleDrawer = (val) => {
    setShowDrawer(val)
    fireMenuOpen(val)
  }

  const homePage = router.pathname === '/'
  const isNftPages = router.asPath.includes('/nft')
  const isEventsStats = router.asPath.includes('/events-stats')

  const stanfordLogoIncludesPages = [
    '/events-stats',
    '/events-calendar',
    '/projects/list',
    '/projects',
    '/funds',
    '/experts-list',
    '/communities',
    '/community-votes',
    '/fundraising-data',
    '/pricing',
    '/kols',
    '/investors',
    '/news',
    '/updates',
    '/top-experts',
    '/top-funds',
  ]
  const isStanfordLogoIncludesPage =
    stanfordLogoIncludesPages.some((page) => router.asPath.includes(page)) ||
    homePage

  const exclude = excludeDEXandBaseTokenRoutes || []
  const baseTokenMenuPages = exclude?.some((i) => router.asPath.includes(i))

  let barClass = classes.appBar
  if (dex == 'pancake') barClass = classes.appBarBlue
  if (dex == 'quickswap') barClass = classes.appBarNavy
  if (dex == 'traderjoe') barClass = classes.appBarRed
  if (dex == 'spookyswap') barClass = classes.appBarPurple
  if (dex == 'trisolaris') barClass = classes.appBarGreen

  return (
    <AppBar
      elevation={theme.palette.mode === 'dark' ? 0 : 4}
      position="fixed"
      style={!classProp ? barClass : classProp}
    >
      {isTablet && (
        <Drawer
          anchor={'left'}
          open={showDrawer}
          onClose={() => toggleDrawer(false)}
          sx={{ zIndex: 6800 }}
          PaperProps={{
            sx: {
              background:
                theme.palette.mode === 'dark' ? 'rgb(13, 15, 20)' : '#DADADA',
            },
          }}
        >
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            direction="column"
            wrap="nowrap"
            style={classes.drawer}
          >
            <Grid item>
              <NavigationMenu dex={dex} />
            </Grid>

            <Box width={'100%'}>
              <Grid item mb={2} pl={2} pr={2}>
                <AddFeedbackModal />
              </Grid>
              <Box style={classes.hr}>
                <br />
                <Grid
                  container
                  item
                  direction="row"
                  alignItems="center"
                  style={classes.drawerBottom}
                >
                  <Grid item>
                    <ThemeChanger>
                      {({ theme, themeToggle }) => (
                        <IconButton
                          onClick={themeToggle}
                          sx={(theme) => ({
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginRight: '13px',
                            width: '66px',
                            height: '34px',
                            background:
                              theme.palette.mode === 'dark'
                                ? '#1D2332'
                                : '#d6dee1',
                            padding: '4px',
                            borderRadius: '20px',
                            '&:hover': {
                              background:
                                theme.palette.mode === 'dark'
                                  ? '#1D2332'
                                  : '#d6dee1',
                            },
                          })}
                          disableRipple
                          size="large"
                        >
                          <DarkIcon checked={theme === 'dark'} />
                          <LightIcon checked={theme === 'light'} />
                        </IconButton>
                      )}
                    </ThemeChanger>
                  </Grid>
                  <Grid item>
                    <span style={classes.itemText}>
                      <FormattedMessage id="common.changeTheme" />
                    </span>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Drawer>
      )}
      <Toolbar sx={classes.toolbar}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          wrap="nowrap"
        >
          <Grid container alignItems="center" item wrap="nowrap">
            {isTablet && (
              <Grid item>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => toggleDrawer(!showDrawer)}
                  sx={classes.menuButton}
                  size="large"
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
            )}
            <Grid
              item
              mr={isStanfordLogoIncludesPage ? 4 : 0}
              style={classes.flex}
            >
              <Link href="/" sx={classes.logoLink}>
                {theme.palette.mode === 'dark' ? (
                  <img src="/icons/onchainLabLogo.svg" alt="OnchainLab logo" />
                ) : (
                  <img
                    src="/icons/onchainLabLogo-red.svg"
                    alt="OnchainLab logo"
                  />
                )}
              </Link>
            </Grid>
            {isStanfordLogoIncludesPage && (
              <>
                <Grid
                  item
                  minWidth={'75px'}
                  mr={1.5}
                  display={{ xs: 'none', lg: 'flex' }}
                >
                  <Typography
                    component="span"
                    sx={(theme) => ({
                      fontSize: 12,
                      fontWeight: 400,
                      letterSpacing: '0.02em',
                      color:
                        theme.palette.mode === 'dark' ? '#D9D9D9' : '#121212',
                    })}
                  >
                    <FormattedMessage id="header.incubatedBy" />
                  </Typography>
                </Grid>
                <Grid item display={{ xs: 'none', lg: 'flex' }}>
                  <a
                    href="https://consensys.net/"
                    target={'_blank'}
                    style={{ ...classes.menuLink, ...classes.menuLinkIcon }}
                  >
                    <img src="/icons/consensys-logo.svg" alt="consensys" />
                  </a>
                </Grid>
                <Grid item mr={1} display={{ xs: 'none', lg: 'flex' }}>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 18,
                      fontWeight: 400,
                      color:
                        theme.palette.mode === 'dark' ? '#D9D9D9' : '#121212',
                    }}
                  >
                    +
                  </Typography>
                </Grid>
                <Grid item display={{ xs: 'none', lg: 'flex' }}>
                  <Box margin={'auto'} style={classes.menuLogo}>
                    {theme.palette.mode === 'dark' ? (
                      <img src="/icons/stanfordNew.svg" alt="stanford logo" />
                    ) : (
                      <img
                        src="/icons/stanfordNew-red.svg"
                        alt="stanford logo"
                      />
                    )}
                  </Box>
                </Grid>
                <Grid
                  item
                  mr={1.5}
                  minWidth={'75px'}
                  display={{ xs: 'none', lg: 'flex' }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 12,
                      fontWeight: 400,
                      letterSpacing: '0.02em',
                      color:
                        theme.palette.mode === 'dark' ? '#D9D9D9' : '#121212',
                    }}
                  >
                    <FormattedMessage id="header.developedBy" />
                  </Typography>
                </Grid>
                <Grid item display={{ xs: 'none', lg: 'flex' }}>
                  <Link
                    href="https://platinum.fund/en"
                    target={'_blank'}
                    sx={classes.menuLink}
                  >
                    <Box margin={'auto'}>
                      {theme.palette.mode === 'dark' ? (
                        <img
                          src="/icons/platinum-logo.svg"
                          alt="platinum logo"
                        />
                      ) : (
                        <img
                          src="/icons/platinum-logo-black.svg"
                          alt="platinum logo"
                        />
                      )}
                    </Box>
                  </Link>
                </Grid>
              </>
            )}
          </Grid>
          <Grid
            container
            item
            alignItems="center"
            justifyContent="flex-end"
            wrap="nowrap"
          ></Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

Header.propTypes = {
  open: PropTypes.bool,
  handleDrawerOpen: PropTypes.func,
}

export default Header
