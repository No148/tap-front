import React from 'react'
import {Box} from '@mui/material'

const DecorationBg = () => {
  return (
    <Box
      sx={{
        zIndex: '-5',
        content: "''",
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '100%',
        maxHeight: 200,
        backgroundImage: `url(/images/bg.jpg)`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'contain',
      }}
    />
  )
}

export default DecorationBg