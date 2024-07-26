import { red } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

// Create a theme instance.
export const lightTheme = createTheme({
  typography: {
    fontFamily: ['Montserrat'].join(','),
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#FDE0B4',
      contrastText: '#fff',
      btn: 'rgba(23, 23, 23, 1)'
    },
    secondary: {
      main: '#8C1515',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: 'rgba(23, 23, 23, 1)',
      card: 'rgba(175, 175, 175, 0.05)',
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1801,
    },
  },
  components: {
    /*
    MuiCssBaseline: {
      styleOverrides: {
        '*::-webkit-scrollbar': {
          width: 5,
        },
        '*::-webkit-scrollbar:horizontal': {
          height: 5,
        },
        '*::-webkit-scrollbar-track:horizontal': {
          backgroundColor: 'transparent',
          borderLeft: '9.5px solid transparent',
          borderRight: '9.5px solid transparent',
        },
        '*::-webkit-scrollbar-track': {
          background: '#E8E7E7',
          borderRadius: 100,
        },
        '*::-webkit-scrollbar-thumb:horizontal': {
          backgroundColor: '#9ba4a9',
          borderRadius: 20,
          // border: '6px solid transparent',
          backgroundClip: 'content-box',
        },
        '*::-webkit-scrollbar-thumb': {
          background: '#1F4B7F',
          borderRadius: 100,
        },
        '*::-webkit-scrollbar-corner': {
          backgroundColor: 'transparent',
        },

        '.se-toolbar.sun-editor-common.se-toolbar-shadow': {
          display: 'none',
        },
        '.swiper-wrapper': {
          position: 'relative',
          width: '100%',
          height: '100%',
          zIndex: 1,
          display: 'flex',
          alignItems: 'stretch',
          transitionProperty: 'transform',
          boxSizing: 'content-box',
        },
        '.swiper > .swiper-pagination': {
          marginTop: 24,
          padding: 12,
          position: 'relative !important',

          '&:before': {
            content: "''",
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            position: 'absolute',
            backgroundColor: '#DADADA',
            height: 30,
            width: 90,
            borderRadius: 20,
            opacity: 0.3,
          },
        },
      },
    }, */
    MuiDrawer: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(2px)',
          '& .MuiModal-backdrop': {
            backgroundColor: 'initial',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          padding: 10,
          fontStyle: 'normal',
          fontWight: 400,
          fontSize: 12,
          letterSpacing: '0.02em',
          color: '#1F4B7F',
          backgroundColor: '#fff',
          // boxShadow: '0px 40px 90px -10px rgba(14, 9, 28, 0.2)',
          opacity: 0.85,
          borderRadius: 8,
        },
      },
    },
  },
})

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fff',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
      light: '#555',
    },
    background: {
      default: '#0F1421',
    },
    shadow: {
      main: '#d9d9d9',
    },
    // divider: '#5f5f5f',

    BLUE: {
      main: '#4271FF',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1801,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*::-webkit-scrollbar': {
          width: 20,
        },
        '*::-webkit-scrollbar:horizontal': {
          height: 20,
        },
        '*::-webkit-scrollbar-track:horizontal': {
          backgroundColor: 'transparent',
          borderLeft: '9.5px solid transparent',
          borderRight: '9.5px solid transparent',
        },
        '*::-webkit-scrollbar-track': {
          borderLeft: '9.5px solid #0A0A0C',
          borderRight: '9.5px solid #0A0A0C',
          background: '#282E3E',
        },
        '*::-webkit-scrollbar-thumb:horizontal': {
          backgroundColor: '#596976',
          borderRadius: 20,
          border: '6px solid transparent',
          backgroundClip: 'content-box',
        },
        '*::-webkit-scrollbar-thumb': {
          borderLeft: '7px solid #0A0A0C',
          borderRight: '7px solid #0A0A0C',
          background: 'rgb(58, 79, 203)',
          borderRadius: 5,
          backgroundClip: 'content-box',
        },
        '*::-webkit-scrollbar-corner': {
          backgroundColor: 'transparent',
        },

        body: {
          // background: 'linear-gradient(152deg, #0D0F14 70%, #0E1536 100%);',
          backgroundColor: '#0A0A0C',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          fontSize: '0.875rem',
          lineHeight: 1.43,
          letterSpacing: '0.01071em',
        },
        '.TVChartContainer > iframe': {
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        },
        '.swiper-wrapper': {
          position: 'relative',
          width: '100%',
          height: '100%',
          zIndex: 1,
          display: 'flex',
          alignItems: 'stretch',
          transitionProperty: 'transform',
          boxSizing: 'content-box',
        },
        '.presentation-gallery-img': {
          width: '100% !important',
          borderRadius: '16px',
        },

        '.swiper > .swiper-pagination': {
          marginTop: 24,
          padding: 12,
          position: 'relative !important',

          '&:before': {
            content: "''",
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            position: 'absolute',
            backgroundColor: '#fff',
            height: 30,
            width: 90,
            borderRadius: 20,
            opacity: 0.2,
          },
        },

        '.swiper > .swiper-button-next': {
          right: 0,
        },
        '.swiper > .swiper-button-prev': {
          left: 0,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(13, 15, 20)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(2px)',
          '& .MuiModal-backdrop': {
            backgroundColor: 'initial',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          padding: 10,
          fontStyle: 'normal',
          fontWight: 400,
          fontSize: 12,
          letterSpacing: '0.02em',
          color: '#FFFFFF',
          backgroundColor: '#1D2332',
          boxShadow: '0px 40px 90px -10px rgba(14, 9, 28, 0.2)',
          borderRadius: 8,
        },
      },
    },
  },
})

export const drawerWidth = 240

export const DEX_COLOR = {
  uniswap: '#8C1515',
  pancake: '#1FC7D4',
  quickswap: '#3F8BCB',
  traderjoe: '#F2716A',
  spookyswap: '#21283F',
  raydium: '#1C154F',
  trisolaris: '#70D44B',
}
