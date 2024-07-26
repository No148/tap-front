import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import getConfig from 'next/config'
import { Box, darken } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { getFirstLetters } from '@/helpers/utils'

const { publicRuntimeConfig } = getConfig()
const { mode } = publicRuntimeConfig

export default function Avatar({
  logoExtension,
  logoUrl,
  label,
  square = false,
  big = false,
  superBig = false,
  medium = false,
  clickHandler = false,
  lift = false,
}) {
  const theme = useTheme()
  let size = big ? 100 : 24
  if (superBig) size = 150
  if (medium) size = 60

  if (logoExtension && logoExtension.length > 0) {
    return (
      <img
        width={`${size}px`}
        src={logoUrl}
        onClick={clickHandler ? clickHandler : () => false}
        onError={(event) => {
          event.target.src =
            theme.palette.mode === 'dark'
              ? '/images/default_logo.svg'
              : '/icons/default_logo-light.svg'
          event.onerror = null
        }}
        style={{
          marginTop: lift ? `-${lift}px` : 0,
          marginRight: '0px',
          borderRadius: square ? '6px' : '50%',
          flexShrink: 0,
        }}
        alt={label}
      />
    )
  }

  function getBgColor() {
    if (theme.palette.mode === 'dark') return '#1D2332'
    if (mode === 'sui') return '#6fbcf0'
    if (mode === 'ai') return theme.palette.secondary.dark

    return 'rgb(204, 204, 204)'
  }

  function getTextColor() {
    if (theme.palette.mode === 'dark') return '#ffffff'
    if (mode === 'sui') return '#ffffff'
    if (mode === 'ai') return '#2B2F38'

    return '#8C1515'
  }

  return (
    <Box
      onClick={clickHandler ? clickHandler : () => false}
      sx={{
        marginTop: lift ? `-${lift}px` : 0,
        marginRight: '0px',
        borderRadius: square ? '6px' : '50%',
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: getBgColor(),
        color: getTextColor(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: big || superBig ? '40px' : '12px',
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {getFirstLetters(label)}
    </Box>
  )
}
