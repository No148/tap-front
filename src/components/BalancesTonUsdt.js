import React from 'react'
import {Box, Stack, Typography} from '@mui/material'
import { formatInt } from '@/helpers/formatter'

const BalancesTonUsdt = ({data}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        fontFamily: 'Roboto',
        fontSize: 10,
        fontWeight: 400,
        mb: 4,
        color: '#ffffff',
        background: 'rgba(175, 175, 175, 0.1)',
        borderRadius: '6px',
        columnGap: 2,
        px: 3,
        py: 1 / 2,
      }}
    >
      <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 1 / 2 }}>
        <Typography
          variant="body2"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <img width={16} src="/images/usdt.png" />
        </Typography>

        <Typography
          variant="body2"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {formatInt(data.usdt)}
        </Typography>
        <Typography
          variant="body2"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          USDT
        </Typography>
      </Stack>
      <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 1 / 2 }}>
        <Typography
          variant="body2"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <img width={16} src="/images/ton.png" />
        </Typography>

        <Typography
          variant="body2"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {formatInt(data.ton)}
        </Typography>
        <Typography
          variant="body2"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          TON
        </Typography>
      </Stack>
    </Box>
  )
}

export default BalancesTonUsdt