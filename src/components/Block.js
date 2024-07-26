import { Box, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { timePassedSec } from '@/helpers/utils'

var myTicks = 1

export function Block({
  chatId,
  name = '',
  data = {},
  disabled = false,
  handle,
  reload,
}) {
  const [recovery, setRecovery] = useState(false)
  const [tick, setTick] = useState(1)

  const hitBoost = async () => {
    handle(data)
  }

  useEffect(() => {
    if (!recovery) return false // no need timer

    const m = moment.utc(data.recovery_date).diff(new Date(), 'seconds')
    if (m < 1) {
      setRecovery(false)
      reload()
      return false
    }

    if (m) setRecovery(timePassedSec(m))
  }, [tick])

  useEffect(() => {
    const tickInterval = setInterval(() => {
      setTick(myTicks++)
    }, 1000)

    return () => {
      clearInterval(tickInterval)
    }
  }, [])

  useEffect(() => {
    if (data.recovery_date && data.amount < 1) {
      const m = moment.utc(data.recovery_date).diff(new Date(), 'seconds')
      setRecovery(timePassedSec(m))
    }
  }, [data])

  const getTitle = (val) => {
    const l = window.localStorage.getItem('language') || 'en'
    return val[l]
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        columnGap: 1,
        cursor: 'pointer',
        width: '100%',
        p: '7px 13px',
        borderRadius: 4,
        bgcolor: 'background.card',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        opacity: disabled ? 0.5 : 1,
      }}
      onClick={hitBoost}
    >
      <Box
        sx={{
          width: '32px',
          height: '32px',
        }}
      >
        <img
          src={`/icons/boost/${data.key}.png`}
          style={{
            display: 'block',
            width: 'inherit',
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        />
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '22px',
            color: '#fff',
          }}
        >
          {getTitle(name)}
        </Typography>
        {data.amount < 1 && recovery && (
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '22px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            {recovery}
          </Typography>
        )}

        {data.amount > 0 && (
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '22px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            {data.amount || '0'}/{data.max_amount || '0'}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export function BigBlock({ name = '', image, data }) {
  const disabled = !data.next_level_available

  const hitBoost = async () => {
    if (!data.next_price || disabled) return false
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        columnGap: 1,
        mb: 1,
        width: '100%',
        p: '13px',
        borderRadius: 4,
        bgcolor: 'background.card',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        opacity: disabled ? 0.5 : 1,
      }}
      onClick={hitBoost}
    ></Box>
  )
}
