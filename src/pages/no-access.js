import Link from '@/components/Link'
import { Box, Button, Grid, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

const NoAccess = () => {
  const [step, setStep] = useState(1)
  const intl = useIntl()

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {

      const c = window.Telegram.WebApp.initDataUnsafe.user?.language_code
      console.log(window.toggleLanguage, 'IS HERE')
      setTimeout(() => {
        window.toggleLanguage(c)        
      }, 800)
    }

  }, [])

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      {step == 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            width: '100%',
            padding: '10px',
            marginTop: '140px',
          }}
        >
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: 24,
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            <FormattedMessage id="noaccess.oops" />
          </Typography>
          <Typography
            sx={{ textAlign: 'center', fontSize: 16, color: '#FDE0B4' }}
          >
            <FormattedMessage id="noaccess.step1" />
          </Typography>

          <Button
            onClick={() => setStep(2)}
            variant="outlined"
            sx={{
              mt: '18px',
              mb: '10px',
              py: 1.8,
              fontSize: 16,
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
            fullWidth
          >
            <FormattedMessage id="noaccess.join" />
          </Button>
        </div>
      )}

      {step == 2 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            width: '100%',
            padding: '10px',
            marginTop: '140px',
          }}
        >
          <Typography
            sx={{ textAlign: 'center', fontSize: 16, color: '#FDE0B4' }}
          >
            {intl.formatMessage(
              { id: 'noaccess.step2' },
              { order: Math.floor(Math.random() * 6999) + 1700 },
            )}
          </Typography>

          <Button
            onClick={() => setStep(3)}
            variant="outlined"
            sx={{
              mt: '18px',
              mb: '10px',
              py: 1,
              px: 0.5,
              fontSize: 16,
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
              height: 45,
              '&:hover': {
                backgroundColor: 'rgba(193, 168, 117, 1)',
              },
            }}
            fullWidth
          >
            <FormattedMessage id="noaccess.step2-btn" />
          </Button>
        </div>
      )}

      {step == 3 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              width: '80%',
              marginTop: '100px',
              // background: '#E48480',
              padding: '16px',
              borderRadius: '10px',
              marginBottom: '30px',
            }}
          >
            1) <FormattedMessage id="noaccess.step3-a" />
            <br />
            <br />
            2) <FormattedMessage id="noaccess.step3-b" /> {' '}
            <Link href={intl.formatMessage({ id: 'common.project_channel'})}>
              <FormattedMessage id='common.project_channel' /></Link>.{' '}
            <FormattedMessage id="noaccess.step3-c" />
            <br />
            <br />
            3) <FormattedMessage id="noaccess.step3-d" /> {' '}
            <Link href="https://t.me/+t0WTcOe8mZ4wMzVl">
              https://t.me/+t0WTcOe8mZ4wMzVl
            </Link>
          </Box>
        </div>
      )}
    </Grid>
  )
}

export default NoAccess
