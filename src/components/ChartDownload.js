import React from 'react'
import { Box, Button, lighten } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const useStyles = (theme) => ({
  settingsIconBtnTags: {
    padding: '14px 30px 14px 13px',
    width: '106px',
    height: '48px',
    background: theme.palette.mode === 'dark' ? '#1D2332' : '#fff',
    borderRadius: '100px',
    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#1D2332',

    '&:hover': {
      background:
        theme.palette.mode === 'dark' ? lighten('#1D2332', 0.09) : 'hsla(0,0%,100%,.6)',
    },
    [theme.breakpoints.down('md')]: {
      padding: '6px 8px',
      width: '48px',
      height: '48px',
      minWidth: 'unset',
    },
  },
})

const DownloadIcon = ({ color }) => (
  <svg
    width='18'
    height='18'
    viewBox='0 0 18 18'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M15.2126 8.93066H12.0617C11.8745 8.93058 11.6921 8.9899 11.5407 9.10007C11.3894 9.21023 11.2769 9.36558 11.2194 9.54374C11.069 10.0139 10.7728 10.4239 10.3739 10.7146C9.97493 11.0053 9.49384 11.1615 9.00022 11.1607C8.50659 11.1616 8.02547 11.0054 7.62651 10.7147C7.22754 10.424 6.93142 10.0139 6.781 9.54374C6.72349 9.36555 6.61093 9.21019 6.45952 9.10003C6.30811 8.98986 6.12566 8.93056 5.93842 8.93066H2.78752C2.67124 8.93064 2.55609 8.95353 2.44866 8.99801C2.34122 9.0425 2.2436 9.10772 2.16138 9.18994C2.07916 9.27217 2.01394 9.36979 1.96945 9.47722C1.92496 9.58465 1.90208 9.6998 1.9021 9.81608V14.8658C1.90224 15.1006 1.99559 15.3256 2.16161 15.4916C2.32764 15.6576 2.55277 15.7508 2.78752 15.7509H15.2126C15.3288 15.7509 15.4439 15.728 15.5513 15.6835C15.6587 15.6391 15.7564 15.5739 15.8386 15.4917C15.9208 15.4095 15.986 15.3119 16.0305 15.2046C16.075 15.0972 16.098 14.9821 16.098 14.8658V9.81608C16.098 9.32666 15.702 8.93066 15.2126 8.93066Z'
      fill={color}
    />
    <path
      d='M8.81426 9.40258C8.85872 9.46486 8.93144 9.50212 9.00794 9.50212H9.00848C9.08552 9.50212 9.15716 9.46486 9.20216 9.40168L11.6509 5.95774C11.6761 5.92202 11.691 5.88009 11.694 5.83649C11.6971 5.7929 11.6881 5.7493 11.6682 5.71042C11.6482 5.6715 11.6178 5.63887 11.5804 5.61613C11.543 5.59338 11.5001 5.58141 11.4563 5.58154H10.3045V2.4877C10.3045 2.3554 10.1977 2.24902 10.0663 2.24902H7.93406C7.8023 2.24902 7.69592 2.3554 7.69592 2.4877V5.58154H6.5432C6.49952 5.58161 6.45669 5.59369 6.41941 5.61647C6.38213 5.63924 6.35183 5.67184 6.33183 5.71068C6.31184 5.74952 6.30291 5.79312 6.30603 5.83669C6.30915 5.88027 6.3242 5.92215 6.34952 5.95774L8.81426 9.40258Z'
      fill={color}
    />
  </svg>
)

const ChartDownload = ({ chart, classProp, mobile, params = '' }) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  const onDownload = () => {
    const token = localStorage.getItem('token') || 'nope'

    const link = document.createElement('a')
    link.download = `${chart}.csv`
    link.href = `/api/export-csv?report=${chart}&token=${token}&${params}`
    link.click()
  }
  return (
    <Button
      onClick={onDownload}
      variant='contained'
      sx={{
        ...classes.settingsIconBtnTags,
        ...classProp,
      }}
    >
      <DownloadIcon
        color={theme.palette.mode === 'dark' ? '#FFFFFF' : 'black'}
      />
      {mobile ? null : (
        <Box ml={2} display={{ xs: 'none', md: 'block' }}>
          csv{' '}
        </Box>
      )}
    </Button>
  )
}

export default ChartDownload
