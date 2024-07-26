import React from 'react'
import { Box, Button, Grid, Typography } from '@mui/material'
import getConfig from 'next/config'
import { FormattedMessage, useIntl } from 'react-intl'

const { publicRuntimeConfig } = getConfig()
const { domainName } = publicRuntimeConfig

const DEFAULT_IMG = 'https://telegram.org/img/t_logo.png'

const getImg = (url = '') => {
  if (!url) {
    return DEFAULT_IMG
  }
  return url.startsWith('data:') || url.startsWith('https://')
    ? url
    : `https://game-api${
        domainName.includes('-dev') ? '-dev' : ''
      }.onchainlab.ai/uploads/project_imgs/${url}`
}

const RandomBox = ({ data, title, bg }) => {
  if (!data) return <></>

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '120px',
        backgroundImage: bg,
        borderRadius: 3,
        padding: '6px',
        // backgroundColor: bg,
        backgroundImage: getImg(data.image_url),
      }}
    >
      <Typography>{title}</Typography>

      <Grid container spacing={1}>
        <Grid item xs={6}>
          <img
            src={getImg(data.image_url)}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '6px',
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Box style={{ fontSize: '10px', marginBotton: '20px' }}>
            {data.title}
          </Box>
          <Button
            href={data.url}
            variant="outlined"
            sx={{
              width: '60px',
              height: '20px',
              color: '#fff',
              fontSize: 10,
              fontWeight: 500,
              borderRadius: 4,
              // backgroundColor: 'rgba(175, 175, 175, 0.7)',
              '&:hover': {
                backgroundColor: '#31BA53',
              },
            }}
          >
            <FormattedMessage id="catalogue.play" />
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default RandomBox
