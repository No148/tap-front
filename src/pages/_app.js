// global styles here
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import cookies from 'next-cookies'
import getConfig from 'next/config'
import Head from 'next/head'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { TwaAnalyticsProvider } from '@tonsolutions/telemetree-react'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeContext } from '@/contexts/ThemeContext'
import { TranslationProvider } from '@/components/TranslationProvider'
import { YMInitializer } from 'react-yandex-metrika'

import { Box, Typography } from '@mui/material'
import { SnackbarProvider } from '@/providers/SnackbarProvider'

const { publicRuntimeConfig } = getConfig()
const { domainName, apiKey, apiUrl } = publicRuntimeConfig

export default function MyApp(props) {
  const router = useRouter()
  const { Component, pageProps } = props
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState(pageProps.theme || 'dark')

  const [cache] = useState(() => {
    const cache = createCache({ key: 'css' })
    cache.compat = true
    return cache
  })

  const toggleTheme = () => false

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <React.Fragment>
      <Head>
        <title>Webapp</title>
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          src="https://telegram.org/js/telegram-web-app.js"
          fetchpriority='high'
        ></script>
        <style>
        {`
          .no-scroll-body {
            overflow: hidden;
            height: 100vh;
            touch-action: none;
          }
        `}
        </style>
      </Head>
      <ThemeContext.Provider
        value={{
          theme,
          toggleTheme,
        }}
      >
        <ThemeProvider>
          <CacheProvider value={cache}>
            <TranslationProvider>
              <SnackbarProvider>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon.*/}
                <CssBaseline />
                {!domainName.includes('-dev') && (
                  <YMInitializer accounts={[97844520]}
                    options={{
                      webvisor: true,
                      clickmap:true,
                      trackLinks:true,
                      accurateTrackBounce:true,
                    }}
                  />
                )}
                <Component {...pageProps} />
              </SnackbarProvider>
            </TranslationProvider>
          </CacheProvider>
        </ThemeProvider>
      </ThemeContext.Provider>
    </React.Fragment>
  )
}

MyApp.getInitialProps = async ({ ctx }) => {
  const { query, pathname } = ctx

  const pageProps = { chat_id: query.id }

  // load app stats
  const response = await fetch(`${apiUrl}/statistics/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
    },
  })

  if (response.ok) {
    const statData = await response.json()
    pageProps.stat = statData
    pageProps.queryz = query
  }

  return {
    pageProps,
  }
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
}
