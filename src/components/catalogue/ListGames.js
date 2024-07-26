import React, { useEffect, useState } from 'react'
import { Box, Button, IconButton, Typography } from '@mui/material'
import Spinner from '@/components/Spinner'
import getConfig from 'next/config'
import { FormattedMessage, useIntl } from 'react-intl'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import FavoriteIcon from '@mui/icons-material/Favorite';

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

const ListGames = ({ games, addFavorite, removeFavorite }) => {
  const [showAll, setShowAll] = useState(false)

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

  const list = showAll ? games : games.slice(0, 6)

  const toggleFav = (game) => {
    console.log('toggle fav', game)
    if (!game.favorite) return addFavorite(game._id)
    // else, remove from fav list
    removeFavorite(game._id)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '250px',
        borderRadius: 3,
        textTransform: 'initial',
        justifyContent: 'unset',
        alignItems: 'unset',
        mt: 3,
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
          ml:2,
          '& > p': { m: 0 },
        }}
      >
        <p>
          <FormattedMessage id="catalogue.subtitle" />
        </p>
        <Button
          onClick={() => setShowAll(!showAll)}
          sx={{
            color: '#AFAFAF',
            fontSize: 15,
            fontWeight: 500,
            textTransform: 'unset',
            '&:hover': {
              backgroundColor: 'unset',
            },
          }}
        >
          <FormattedMessage
            id={showAll ? 'catalogue.hide_all' : 'catalogue.show_all'}
          />
        </Button>
      </Box>
      {list.map((i) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: 2,
              //mb: 2,
              py: 1,
              width: '100%',
              borderBottom: '1px solid rgba(175, 175, 175, 0.05)',
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
                  mb: 0.5,
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1.1,
                  color: '#fff',
                  wordBreak: 'break-word',
                  textAlign: 'left',
                }}
              >
                {i.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 400,
                  lineHeight: 1.1,
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
                onClick={() => toggleFav(i)}
                sx={{ p:0 }}
              >
                <FavoriteIcon sx={{
                  fontSize: '23px',
                  color: i.favorite ? '#fff' : 'rgba(175, 175, 175, 0.5)',
                }} />
              </IconButton>
            </Box>
           </Box>
        )
      })}

      {!showAll && (
        <Button
          sx={{ marginBottom: '8px' }}
          onClick={() => setShowAll(true)}
          variant="outlined"
        >
          <FormattedMessage id="catalogue.show_all" />
        </Button>
      )}
    </Box>
  )
}

export default ListGames
