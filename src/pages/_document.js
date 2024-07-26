import ServerStyleSheets from '@mui/styles/ServerStyleSheets'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
const { domainName } = publicRuntimeConfig

export default class MyDocument extends Document {
  render() {
    const prefix = '/favicon'
    return (
      <Html lang='en'>
        <Head>
          <meta name='msapplication-TileColor' content='#ffffff'/>
          <meta name='theme-color' content='#ffffff'/>
          <meta name="robots" content="noindex"/>
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/icon?family=Material+Icons'
          />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
          />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;800&display=swap'
          />
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
            rel="stylesheet"
          />
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
        <body>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    )
  }
}

