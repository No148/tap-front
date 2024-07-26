import React, { useState, useEffect } from 'react'
import { Box, Button, Typography, Stack, LinearProgress } from '@mui/material'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { useRouter } from 'next/router'
import { useSnackbar } from '@/providers/SnackbarProvider'
import { FormattedMessage, useIntl } from 'react-intl'
import { formatInt } from '@/helpers/formatter'

const Wrn = () => {
  const [checkAge, setCheckAge] = useState(false)
  const [checkActivity, setCheckActivity] = useState(false)
  const [checkPremium, setCheckPremium] = useState(false)
  const [checkOg, setCheckOg] = useState(false)
  const [age, setAge] = useState(0)
  const [claimed, setClaimed] = useState(false)
  const { snackbar } = useSnackbar()

  const router = useRouter()

  useEffect(() => {
    setTimeout(() => setCheckAge(true), 1100)
    setTimeout(() => setCheckActivity(true), 1700)
    setTimeout(() => setCheckPremium(true), 2300)
    setTimeout(() => setCheckOg(true), 2800)
  }, [])

  const claimNow = async () => {
    const c = window.localStorage.getItem('chat_id') || false
    if (!c) return false
    const l = window.localStorage.getItem('language') || 'en'

    const response = await fetch('/api/claim-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: c,
        task_id: router.query.task_id,
        lang: l,
      }),
    })

    if (!response.ok) return false
    const answ = await response.json()
    console.log(answ)
    setClaimed(true)
  }

  const yearsWord = (a) => {
    const l = window.localStorage.getItem('language') || 'en'

    if (l == 'ru') {
      if (a == 1) return 'год'
      if (a < 5) return 'года'
      return 'лет'
    }

    // default is english
    return a > 1 ? 'years' : 'year'
  }

  if (claimed) {
    const tgUserId = window.localStorage.getItem('chat_id') || false
    if (!tgUserId) return <></>

    return (
      <Box sx={{
          padding: '35px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '12vh',
        }}
      >
        <Typography variant='h4'>
          <FormattedMessage id='tasks.you_amazing' />
        </Typography>
        <br/><br/>
        <Typography variant='h6' sx={{ textAlign: 'center' }}>
          <FormattedMessage id='tasks.invite_more' />
        </Typography>

        <Button
          variant="outlined"
          aria-describedby="filter-popover-tags"
          disableRipple
          fullWidth
          onClick={() => {
            snackbar('Link copied')
            copyTextToClipboard(
              `https://t.me/SecretPadBot/app?startapp=r${tgUserId}`,
            )
          }}
          sx={{
            width: '100%',
            flex: 1,
            mt: 1,
            mb: 1,
            py: 1.8,
            minWidth: 140, // 260,
            fontSize: 12,
            fontWeight: 700,
            color: 'rgba(193, 168, 117, 1)',
            lineHeight: 1.2,
            textAlign: 'center',
            textTransform: 'none',
            borderRadius: 2.5,
            boxShadow: '4px 6px 4px 0px rgba(0, 0, 0, 0.34)',
            whiteSpace: 'break-word',
            '&:hover': {
              // backgroundColor: 'rgba(193, 168, 117, 1)',
            },
          }}
          size="large"
        >
          <FormattedMessage id="refs.copy_link" />:
          https://t.me/SecretPadBot/app?startapp=r{tgUserId}
        </Button>
        <br />
        <Button
          variant="outlined"
          aria-describedby="filter-popover-tags"
          disableRipple
          // target='_blank'
          fullWidth
          onClick={() => {
            window.Telegram.WebApp.openTelegramLink(refUrl)
          }}
          sx={{
            width: '100%',
            flex: 1,
            mt: 1,
            py: 1,
            px: 1,
            minWidth: 140, // 260,
            height: 45,
            fontSize: 12,
            fontWeight: 700,
            color: 'rgba(29, 29, 29, 1)',
            lineHeight: 1.2,
            textAlign: 'center',
            textTransform: 'none',
            borderRadius: 2.5,
            backgroundImage:
              'linear-gradient(76.82deg, #576265 11.6%, #9EA1A1 25.31%, #848B8A 48.06%, #576265 55.72%, #576265 77.23%, #757A7B 85.34%, #576265 91.31%)',
            backgroundColor: 'rgba(193, 168, 117, 1)',
            backgroundBlendMode: 'overlay',
            boxShadow: '4px 6px 4px 0px rgba(0, 0, 0, 0.34)',
            //whiteSpace: 'nowrap',
            '&:hover': {
              backgroundColor: 'rgba(193, 168, 117, 1)',
            },
          }}
          size="large"
        >
          <FormattedMessage id="refs.send_invite" />
        </Button>
        <Button
          variant="outlined"
          aria-describedby="filter-popover-tags"
          disableRipple
          href='/game/'
          // target='_blank'
          fullWidth
          sx={{
            width: '100%',
            flex: 1,
            mt: 1,
            py: 1,
            px: 1,
            minWidth: 140, // 260,
            height: 45,
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 1.2,
            textAlign: 'center',
            textTransform: 'none',
            borderRadius: 2.5,
            boxShadow: '4px 6px 4px 0px rgba(0, 0, 0, 0.34)',
          }}
          size="large"
        >
          <FormattedMessage id='tasks.back_to_game' />
        </Button>
      </Box>
    )    
  }

  if (age > 0) {
    return (
      <Box sx={{
          padding: '35px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '12vh',
        }}
      >
        <Typography variant='h5'>
          <FormattedMessage id='common.congrats' />
        </Typography>
        <FormattedMessage id='tasks.age_is' />
        <Typography sx={{
          fontSize: '36px',
          color: '#FDE0B4',
        }}>
          <span style={{ fontSize: '48px' }}>{age}</span> {yearsWord(age)}!
        </Typography>

        <br/>
        <br/>
        <Button variant='outlined' onClick={claimNow}>
          <FormattedMessage id='tasks.get_age_reward' /> {formatInt(router.query.reward)} $COINs
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{
        padding: '35px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '60px',
      }}
    >
      <Typography variant='h6'>
        <FormattedMessage id='tasks.check_account' />
      </Typography>
      <br/>
      <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', height: '26px' }}>
          <Typography sx={{ fontSize: '14px' }}>
            <FormattedMessage id='tasks.account_age' />
          </Typography>
          <Box>{checkAge && (<TaskAltIcon sx={{ color: 'green' }} />)}</Box>
        </Box>
        {checkAge ? (
          <LinearProgress
            color='secondary'
            variant='determinate'
            value={100}
          />
        ) : (
          <LinearProgress color="secondary" />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', height: '26px' }}>
          <Typography sx={{ fontSize: '14px' }}>
            <FormattedMessage id='tasks.activity_level' />
          </Typography>
          <Box>{checkActivity && (<TaskAltIcon sx={{ color: 'green' }} />)}</Box>
        </Box>
        {checkActivity ? (
          <LinearProgress
            color='success'
            variant='determinate'
            value={100}
          />
        ) : (
          <LinearProgress color='success' />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', height: '26px' }}>
          <Typography sx={{ fontSize: '14px' }}>
            <FormattedMessage id='tasks.check_premium' />
          </Typography>
          <Box>{checkPremium && (<TaskAltIcon sx={{ color: 'green' }} />)}</Box>
        </Box>

        {checkPremium ? (
          <LinearProgress
            color='inherit'
            variant='determinate'
            value={100}
          />
        ) : (
          <LinearProgress color='inherit' />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', height: '26px' }}>
          <Typography  sx={{ fontSize: '14px' }}>
            <FormattedMessage id='tasks.confirm_og' />
          </Typography>
          <Box>{checkOg && (<TaskAltIcon sx={{ color: 'green' }} />)}</Box>
        </Box>

        {checkOg ? (
          <LinearProgress
            color='warning'
            variant='determinate'
            value={100}
          />
        ) : (
          <LinearProgress color='warning' />
        )}
      </Stack>
      <br/>
      {checkOg && (
        <Button variant='outlined' onClick={() => setAge(router.query.age)}>
          <FormattedMessage id='common.next' />
        </Button>
      )}
    </Box>
  )
}

export default Wrn
