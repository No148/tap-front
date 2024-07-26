import React, { useState, useEffect } from 'react'
import { Button, Box, Typography, Stack } from '@mui/material'
import { useTheme } from '@mui/styles'
import { FormattedMessage } from 'react-intl'
import { useSnackbar } from '@/providers/SnackbarProvider'

export default function Rewards({ data }) {
	const theme = useTheme()
	const [rewardOne, setRewardOne] = useState(0)
	const [rewardTwo, setRewardTwo] = useState(0)
	const [sum, setSum] = useState(0)
  const { snackbar } = useSnackbar()

	useEffect(() => {
		let s = 0
		if (data.lvl1 && data.lvl1.available) {
			s += Math.floor(data.lvl1.available)
			setRewardOne(s*1)
		}

		if (data.lvl2 && data.lvl3) {
			const m = Math.floor(data.lvl2.available*1 + data.lvl3.available*1)
			s += m
			if (m > 0) {
				setRewardTwo(m)
			}
		}

		if (s > 0) {
			setSum(s)
		}
	}, [data])

	const onClaim = async () => {
    const c = window.localStorage.getItem('chat_id') || false
    if (!c) return false

    const url = '/api/claim-ref-reward/'

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: c }),
    })

    if (!response.ok) {
      snackbar('Failed to claim referral reward', true)
      return false
    }

    const data = await response.json()
    setSum(0)
    setRewardOne(0)
    setRewardTwo(0)
    snackbar('Reward claimed!')
	} 

	return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <Typography sx={{
        fontSize: '12px',
        textAlign: 'center',
        color: '#AFAFAF',
        width: '90%',
      }}>
        <FormattedMessage id='refs.multilevel_explain' />
      </Typography>

      <Box
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        gap={'8px'}
        sx={{ marginTop: '16px', width: '100%' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            columnGap: 1,
            width: '100%',
            p: '13px',
            borderRadius: 4,
            bgcolor: 'background.card',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textTransform: 'initial',
            justifyContent: 'center',
            '&:hover': {
              bgcolor: 'background.card',
            },
          }}
        >
          <Stack>
            <Typography sx={{
							fontSize: '14px',
							textAlign: 'center',
							color: 'white',
							fontWeight: 400,							
            }}>
            	<FormattedMessage id='refs.multilevel_one' />
            </Typography>
            <Typography sx={{
							fontSize: '14px',
							fontWeight: 400,
							color: '#FDE0B4',
							textAlign: 'center',
							marginTop: '5px',
            }}>
              {rewardOne} $COINs
            </Typography>
          </Stack>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            columnGap: 1,
            width: '100%',
            p: '13px',
            borderRadius: 4,
            bgcolor: 'background.card',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textTransform: 'initial',
            justifyContent: 'center',
            '&:hover': {
              bgcolor: 'background.card',
            },
          }}
        >
          <Stack>
            <Typography sx={{
							fontSize: '14px',
							textAlign: 'center',
							color: 'white',
							fontWeight: 400,							
            }}>
            	<FormattedMessage id='refs.multilevel_two' />              
            </Typography>
            <Typography sx={{
							fontSize: '14px',
							fontWeight: 400,
							color: '#FDE0B4',
							textAlign: 'center',
							marginTop: '5px',
            }}>
              {rewardTwo} $COINs
            </Typography>
          </Stack>
        </Box>
      </Box>

      {sum > 0 && (
        <Button
          variant="outlined"
          onClick={onClaim}
          disabled={sum < 100}
          sx={{
          	width: '80%',
            mt: '18px',
            mb: '10px',
            py: 1.8,
            fontSize: 12,
            fontWeight: 700,
            color: '#171717',
            lineHeight: 1.2,
            textAlign: 'center',
            textTransform: 'none',
            borderRadius: 2.5,
            backgroundImage:
              'linear-gradient(76.82deg, #576265 11.6%, #9EA1A1 25.31%, #848B8A 48.06%, #576265 55.72%, #576265 77.23%, #757A7B 85.34%, #576265 91.31%)',
            backgroundColor: 'rgba(193, 168, 117, 1)',
            backgroundBlendMode: 'overlay',
            boxShadow: '4px 6px 4px 0px rgba(0, 0, 0, 0.34)',
            whiteSpace: 'nowrap',
            '&:hover': {
              backgroundColor: 'rgba(193, 168, 117, 1)',
            },
          }}
        >
          <FormattedMessage id="tasks.claim" /> {sum} $COINs
        </Button>
      )}
    </Box>	
  )
}
