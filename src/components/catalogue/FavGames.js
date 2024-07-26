import React, { useEffect, useState } from 'react'
import { Box, Button, IconButton, Typography } from '@mui/material'
import Spinner from '@/components/Spinner'
import getConfig from 'next/config'
import { FormattedMessage, useIntl } from 'react-intl'
import FavoriteIcon from '@mui/icons-material/Favorite'

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

const FavGames = ({ games, removeFavorite }) => {
  const [showAll, setShowAll] = useState(true)

  if (!games)
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minHeight: '250px',
          borderRadius: 6,
          bgcolor: 'background.card',
          paddingTop: '35%',
        }}
      >
        <Spinner />
      </Box>
    )

  const list = games

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100px',
        borderRadius: 3,
        bgcolor: 'background.card',
        textTransform: 'initial',
        justifyContent: 'unset',
        alignItems: 'unset',
        px: { xs: 1, sm: 3 },
        py: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          fontSize: '20px',
          fontWeight: 600,
          color: '#fff',
          textAlign: 'left',
          '& > p': { m: 0 },
        }}
      >
        <p>
          <FormattedMessage id="catalogue.fav_title" />
        </p>
        <Box></Box>
      </Box>
      {list.length < 1 && (
        <Box sx={{
          textAlign: 'center',
          marginTop: '40px',
        }}>
          <FormattedMessage id='catalogue.fav_empty' />
        </Box>
      )}
      {list.map((i) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: 2,
              mb: 2,
              width: '100%',
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
                width: 60,
                height: 60,
                backgroundColor: 'rgba(175, 175, 175, 0.3)',
                borderRadius: 3,
              }}
            >
              <img
                src={getImg(i.image_url)}
                style={{
                  width: 'inherit',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  borderRadius: 6,
                }}
              />
            </Box>
            <Box flexBasis={'70%'}>
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '22px',
                  color: '#fff',
                  wordBreak: 'break-word',
                  textAlign: 'left',
                }}
              >
                {i.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '16px',
                  color: '#AFAFAF',
                  wordBreak: 'break-all',
                  textAlign: 'left',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  '-webkit-line-clamp': '3',
                  '-webkit-box-orient': 'vertical',
                }}
              >
                {i.description}
              </Typography>
            </Box>
            <Box display={'flex'} alignItems={'center'} columnGap={2}>
              <IconButton
                href={i.url}
                size='small'
                sx={{ p:0 }}
              >
                <img src="/icons/play-game.png" alt="icon for btn" width={15} />
              </IconButton>
              <IconButton
                onClick={() => removeFavorite(i._id)}
                sx={{ p:0 }}
              >
                <FavoriteIcon sx={{
                  fontSize: '23px',
                  color: '#fff',
                }} />
              </IconButton>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default FavGames
