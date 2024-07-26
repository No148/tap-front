import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'
import dynamic from 'next/dynamic'
import React from 'react'
import { useMaxWidth } from '@/hooks/useMedia'

const useStyles = (theme) => ({
  spinnerBox: {
    flex: 1,
    width: '100%',
    height: 150,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    marginTop: 50,
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.only('xs')]: {
      paddingTop: theme.spacing(3),
    },
    [theme.breakpoints.up('xl')]: {
      paddingLeft: theme.spacing(6),
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0),
    },
  },
})

const Spinner = () => {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <div style={classes.spinnerBox}>
      <CircularProgress style={classes.spinner} />
    </div>
  )
}

const Container = dynamic(() => import('@mui/material/Container'), {
  loading: () => <Spinner />,
  ssr: false,
})

export default function CustomContainer({ children, ...restProps }) {
  const theme = useTheme()
  const mediumScreen = useMaxWidth(1800)
  const classes = useStyles(theme)

  return (
    <Container
      maxWidth={mediumScreen ? 'lg' : 'xl'}
      sx={classes.container}
      {...restProps}
    >
      {children}
    </Container>
  )
}
