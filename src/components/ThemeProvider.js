import {
  ThemeProvider as BaseThemeProvider,
  StyledEngineProvider,
} from '@mui/material/styles'
import getConfig from 'next/config'
import React, { useContext } from 'react'
import { darkTheme, lightTheme } from '@/components/theme'
import { ThemeContext } from '@/contexts/ThemeContext'
import { useRouter } from 'next/router'

const { publicRuntimeConfig } = getConfig()
const { project, mode } = publicRuntimeConfig

export const ThemeProvider = ({ children }) => {
  const { theme } = useContext(ThemeContext)
  const router = useRouter()

  let colorMode = lightTheme // theme === 'light' ? lightTheme : darkTheme

  return (
    <StyledEngineProvider injectFirst>
      <BaseThemeProvider theme={colorMode}>{children}</BaseThemeProvider>
    </StyledEngineProvider>
  )
}
