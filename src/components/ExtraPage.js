import { useSnackbar } from '@/providers/SnackbarProvider'
import {
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
} from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import VisibilityIcon from '@mui/icons-material/Visibility'
import _ from 'lodash'
import getConfig from 'next/config'
import { copyTextToClipboard, getHeaders } from '@/helpers/utils'
import { useEffect, useState } from 'react'
import useLocalStorageState from 'use-local-storage-state'
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

const steps = [
  { label: 'yoba', description: [] },
  {
    label: <FormattedMessage id="swap.step1.label" />,
    description: [<FormattedMessage id="swap.step1.desc" />],
  },
  {
    label: [
      <FormattedMessage id="swap.step2.label1" />,
      <FormattedMessage id="swap.step2.label2" />,
    ],
    description: [<FormattedMessage id="swap.step2.desc" />],
  },
  {
    label: <FormattedMessage id="swap.step3.label" />,
    description: [<FormattedMessage id="swap.step3.desc" />],
  },
  {
    label: <FormattedMessage id="swap.step4.label" />,
    description: [<FormattedMessage id="swap.step4.desc" />],
  },
]

const ExtraPage = (props) => {
  const intl = useIntl()
  const [inputLink, setInputLink] = useState('')
  const [activeStep, setActiveStep] = useState(1)
  const [links, setLinks] = useLocalStorageState('links', { defaultValue: [] })
  const [isInProgress, setIsInProgress] = useLocalStorageState('isInProgress', {
    defaultValue: false,
  })
  const [myLinks, setMyLinks] = useState([])

  const { snackbar } = useSnackbar()

  const saveReferralLink = async (verifyOnly = false) => {
    const user_tg_id = window.localStorage.getItem('chat_id')
    const o = {
      url: inputLink,
      user_tg_id,
    }

    let url = '/api/user-referral-urls/'
    if (verifyOnly) {
      o.is_validate_only = true
      url += '?is_validate_only=true'
    }

    const resp = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(o),
    })

    return resp.json()
  }

  const handleSaveReferral = async () => {
    if (!inputLink.startsWith('https://t.me/')) {
      snackbar(
        'Invalid link, must be like https://t.me/superBot/app?start=000000',
        true,
      )
      return false
    }

    if (
      !inputLink.includes('?start=') &&
      !inputLink.includes('?startapp=') &&
      !inputLink.includes('?appstart=')
    ) {
      snackbar(
        'Invalid link, must be like https://t.me/superBot/app?start=000000',
        true,
      )
      return false
    }

    window.localStorage.setItem('my_ref', inputLink)
    const result = await saveReferralLink(true)
    if (result.error) {
      snackbar(result.error?.detail, true)
      return
    }
    getRandomLinks()

    window.localStorage.setItem('activeStep', 3)
    setActiveStep(3)
  }

  const handleConfirmSelectedOptions = async () => {
    setActiveStep(4)
    window.localStorage.setItem('activeStep', 4)
  }

  const handleBackToOptionsScreen = () => {
    setActiveStep(3)
    window.localStorage.setItem('activeStep', 3)
  }

  const handleConfirmTask = async () => {
    setIsInProgress(false)
    setActiveStep(2)
    saveReferralLink()
    window.localStorage.setItem('activeStep', 2)
    // window.toggleTab('4')
  }

  useEffect(() => {
    getUserLinks()
    const c = window.localStorage.getItem('activeStep') || false
    if (c && c == 3) {
      const lnk = window.localStorage.getItem('my_ref') || false
      setActiveStep(3)
      if (lnk) {
        setInputLink(lnk)
      }
    }
  }, [])

  const getRandomLinks = async (items) => {
    let url = `/api/random-links/?user_url=${inputLink}`
    if (items?.length) {
      url += `&exclude_ids=${items.toString()}`
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    })
    if (!response.ok) {
      return false
    }
    const data = await response.json()
    if (data.error) {
      return false
    }
    setLinks(data.map((item) => ({ ...item, checked: false })))
  }

  const getUserLinks = async (items) => {
    const c = window.localStorage.getItem('chat_id')

    const url = `/api/user-links/?id=${c}`
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    })
    if (!response.ok) {
      return false
    }
    const data = await response.json().catch((err) => {
      console.log(err)
      return false
    })
    if (data.error) {
      return false
    }

    setMyLinks(_.orderBy(data, ['referrer_count'], ['desc']))
  }

  const increaseReferCount = async (id) => {
    const url = '/api/increase-referrer-count'
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
      }),
    })
    if (!response.ok) {
      return false
    }
    const data = await response.json()
  }

  const handleToggle = (value) => () => {
    const { _id, url } = value
    window.open(url)?.focus()
    setIsInProgress(true)

    increaseReferCount(_id)
    setLinks((prev) =>
      prev.map((item) => {
        return { ...item, checked: item._id === _id ? true : item.checked }
      }),
    )
  }

  return (
    <Box sx={{ overflow: 'auto', paddingBottom: '60px' }}>
      <Paper
        square
        elevation={0}
        sx={{
          background: '#1F1F1F',
          border: '1px solid #383D4A',
          padding: '10px 20px',
          borderRadius: '16px',
        }}
      >
        {!Array.isArray(steps[activeStep].label) ? (
          <Typography
            sx={{
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: 1,
            }}
          >
            {steps[activeStep].label}
          </Typography>
        ) : (
          steps[activeStep].label.map((item, ind) => (
            <Typography
              key={item}
              sx={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom:
                  ind === steps[activeStep].label.length - 1 ? 1 : 0,
              }}
            >
              {item}
            </Typography>
          ))
        )}

        {steps[activeStep].description.map((i) => {
          return (
            <Typography
              sx={{
                fontSize: '12px',
                color: '#FDE0B4',
                lineHeight: 1.2,
              }}
              key={i}
            >
              {i}
            </Typography>
          )
        })}
      </Paper>

      {activeStep === 1 && (
        <>
          <Button
            onClick={() => {
              setActiveStep((prev) => prev + 1)
            }}
            variant="outlined"
            sx={{
              mt: '18px',
              mb: '10px',
              py: 1.8,
              fontSize: 18,
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
            <FormattedMessage id="swap.letsgo" />
          </Button>
          <Button
            variant="outlined"
            href="https://t.me/+t0WTcOe8mZ4wMzVl"
            aria-describedby="filter-popover-tags"
            sx={{
              // width: '100%',
              // width: { xs: '100%', sm: 'auto' },
              flex: { xs: 2, sm: 1 },
              py: 1.8,
              // minWidth: 140,
              fontSize: 18,
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.2,
              textAlign: 'center',
              textTransform: 'none',
              borderRadius: 2.5,
              whiteSpace: 'nowrap',
            }}
            fullWidth
          >
            <FormattedMessage id="tasks.get_more_info" />
          </Button>

          <Button
            href={intl.formatMessage({ id: 'common.big_btn_link' })}
            variant="outlined"
            sx={{
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
            fullWidth
          >
            <FormattedMessage id="common.big_fucking_btn" />
          </Button>        
        </>
      )}

      {activeStep === 2 && (
        <>
          <TextField
            size="small"
            multiline
            placeholder={intl.formatMessage({ id: 'swap.enter_link' })}
            fullWidth
            sx={{
              marginTop: '20px',
              '& .MuiInputBase-root': {
                borderRadius: '16px',
                color: '#FDE0B4',
              },
            }}
            value={inputLink}
            onChange={(e) => {
              setInputLink(e.target.value)
            }}
          />

          {inputLink.length > 0 && (
            <Button
              onClick={handleSaveReferral}
              variant="outlined"
              sx={{
                mt: '18px',
                py: 1.8,
                fontSize: 18,
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
              <FormattedMessage id="swap.next" />
            </Button>
          )}

          <Button
            onClick={() => {
              setActiveStep((prev) => prev - 1)
            }}
            variant="outlined"
            aria-describedby="filter-popover-tags"
            sx={{
              flex: { xs: 2, sm: 1 },
              py: 1.8,
              fontSize: 18,
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.2,
              textAlign: 'center',
              textTransform: 'none',
              borderRadius: 2.5,
              whiteSpace: 'nowrap',
              marginTop: inputLink.length > 0 ? '10px' : '20px',
            }}
            fullWidth
          >
            <FormattedMessage id="swap.back" />
          </Button>
        </>
      )}

      {activeStep === 1 && myLinks.length > 0 && (
        <Box sx={{ position: 'relative', marginTop: '20px' }}>
          <Typography sx={{ marginBottom: 1 }}>
            <FormattedMessage id="swap.my_refs" />
          </Typography>
          <List
            sx={{
              width: '100%',
              // maxWidth: 360,
              background: '#1F1F1F',
              borderRadius: '14px',
            }}
          >
            {myLinks.map((item, ind) => {
              const labelId = `checkbox-list-label-${item._id}`

              return (
                <>
                  <ListItem key={item._id} disablePadding>
                    <ListItemButton
                      dense
                      disableRipple
                      sx={{
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                      }}
                      onClick={() => {
                        snackbar('Link copied')
                        copyTextToClipboard(item.url)
                      }}
                    >
                      <ListItemAvatar
                        sx={{
                          borderRadius: '10px',
                          minWidth: 'initial',
                          marginRight: '10px',
                        }}
                      >
                        <img
                          width="40"
                          height="40"
                          src={getImg(item.project.image_url)}
                          style={{
                            borderRadius: '10px',
                          }}
                        />
                      </ListItemAvatar>
                      <Stack sx={{ flex: 1, overflow: 'hidden' }}>
                        <ListItemText
                          id={labelId}
                          primary={item.project.title || `Link #${ind + 1}`}
                          sx={{
                            margin: 0,
                            whiteSpace: 'nowrap',
                            color: '#fff',
                            '& .MuiTypography-body2': {
                              fontSize: '12px',
                              maxWidth: '190px',
                            },
                          }}
                        />
                        <ListItemText
                          id={labelId}
                          primary={
                            <Typography
                              sx={{
                                margin: 0,
                                whiteSpace: 'nowrap',
                                color: '#8F8F8F',
                                fontSize: '12px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                paddingRight: 1,
                              }}
                            >
                              {item?.url ?? `Link #${ind + 1}`}
                            </Typography>
                          }
                        />
                      </Stack>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <VisibilityIcon
                          sx={{ fontSize: '12px', marginRight: '6px' }}
                        />{' '}
                        {item.referrer_count}
                      </Box>
                    </ListItemButton>
                  </ListItem>
                  {ind !== myLinks.length - 1 && (
                    <Divider
                      sx={{
                        width: '95%',
                        margin: '0 auto',
                        marginBottom: '6px',
                      }}
                    />
                  )}
                </>
              )
            })}
          </List>
        </Box>
      )}

      {activeStep === 3 && links.length > 0 && (
        <Box sx={{ position: 'relative', marginTop: '20px' }}>
          <List
            sx={{
              width: '100%',
              // maxWidth: 360,
              background: '#1F1F1F',
              borderRadius: '14px',
            }}
          >
            {links.map((item, ind) => {
              const labelId = `checkbox-list-label-${item._id}`

              return (
                <>
                  <ListItem key={item._id} disablePadding>
                    <ListItemButton onClick={handleToggle(item)} dense>
                      <ListItemAvatar
                        sx={{
                          borderRadius: '10px',
                          minWidth: 'initial',
                          marginRight: '10px',
                        }}
                      >
                        <img
                          width="40"
                          height="40"
                          src={getImg(item.project.image_url)}
                          style={{
                            borderRadius: '10px',
                          }}
                        />
                      </ListItemAvatar>
                      <Stack sx={{ flex: 1, overflow: 'hidden' }}>
                        <ListItemText
                          id={labelId}
                          primary={
                            <Typography
                              sx={{
                                margin: 0,
                                color: '#8F8F8F',
                                fontSize: '12px',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                paddingRight: 1,
                              }}
                            >
                              {item.project.title ?? `Link #${ind + 1}`}
                            </Typography>
                          }
                          sx={{
                            margin: 0,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            paddingRight: 1,
                            color: '#fff',
                            '& .MuiTypography-body2': {
                              fontSize: '12px',
                            },
                          }}
                        />
                        <ListItemText
                          id={labelId}
                          primary={
                            <Typography
                              sx={{
                                margin: 0,
                                color: '#8F8F8F',
                                fontSize: '12px',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                paddingRight: 1,
                              }}
                            >
                              {item?.url ?? `Link #${ind + 1}`}
                            </Typography>
                          }
                        />
                      </Stack>
                      {item.checked ? (
                        <img width="20" height="20" src={'/images/done.png'} />
                      ) : (
                        <Button
                          variant="outlined"
                          aria-describedby="filter-popover-tags"
                          sx={{
                            pointerEvents: 'none',
                            minWidth: 'initial',
                            width: '54px',
                            height: '24px',
                            fontSize: 12,
                            fontWeight: 500,
                            color: '#fff',
                            lineHeight: 1.2,
                            textAlign: 'center',
                            textTransform: 'none',
                            borderRadius: '6px',
                            whiteSpace: 'nowrap',
                          }}
                          size="small"
                        >
                          <FormattedMessage id="swap.start" />
                        </Button>
                      )}
                    </ListItemButton>
                  </ListItem>
                  {ind !== links.length - 1 && (
                    <Divider
                      sx={{
                        width: '95%',
                        margin: '0 auto',
                        marginBottom: '6px',
                      }}
                    />
                  )}
                </>
              )
            })}
          </List>

          <Button
            disabled={links.filter((item) => item.checked).length < 2}
            onClick={handleConfirmSelectedOptions}
            variant="outlined"
            sx={{
              mt: '18px',
              py: 1.8,
              fontSize: 18,
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
              '&:disabled': {
                color: '#171717',
                opacity: 0.3,
                cursor: 'not-allowed',
              },
            }}
            fullWidth
          >
            <FormattedMessage id="swap.mark_done" />
          </Button>

          <Button
            onClick={() => {
              getRandomLinks(links.map((item) => item._id))
            }}
            variant="outlined"
            sx={{
              flex: { xs: 2, sm: 1 },
              // zIndex: 9999,
              py: 1.8,
              fontSize: 18,
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.2,
              textAlign: 'center',
              textTransform: 'none',
              borderRadius: 2.5,
              whiteSpace: 'nowrap',
              marginTop: inputLink.length > 0 ? '10px' : '20px',
            }}
            fullWidth
          >
            <FormattedMessage id="swap.get_other" />
          </Button>

          <Button
            onClick={() => {
              window.localStorage.setItem('activeStep', 2)
              setActiveStep(2)
            }}
            variant="outlined"
            sx={{
              flex: { xs: 2, sm: 1 },
              // zIndex: 9999,
              py: 1.8,
              fontSize: 18,
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.2,
              textAlign: 'center',
              textTransform: 'none',
              borderRadius: 2.5,
              whiteSpace: 'nowrap',
              marginTop: inputLink.length > 0 ? '10px' : '20px',
            }}
            fullWidth
          >
            <FormattedMessage id="swap.back" />
          </Button>
        </Box>
      )}

      {activeStep === 4 && (
        <>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 300,
              color: '#8B8B8B',
              lineHeight: 1.3,
              textAlign: 'center',
              margin: '20px 26px',
            }}
          >
            <FormattedMessage id="swap.if_done" />
          </Typography>

          <Button
            onClick={handleConfirmTask}
            variant="contained"
            sx={{
              py: 1.8,
              fontSize: 18,
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
            <FormattedMessage id="swap.confirm_task" />
          </Button>

          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 300,
              color: '#8B8B8B',
              lineHeight: 1.3,
              textAlign: 'center',
              margin: '10px 26px',
            }}
          >
            <FormattedMessage id="swap.if_not_sure" />
          </Typography>

          <Button
            onClick={handleBackToOptionsScreen}
            variant="outlined"
            sx={{
              flex: { xs: 2, sm: 1 },
              // zIndex: 9999,
              py: 1.8,
              fontSize: 18,
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.2,
              textAlign: 'center',
              textTransform: 'none',
              borderRadius: 2.5,
              whiteSpace: 'nowrap',
            }}
            fullWidth
          >
            <FormattedMessage id="swap.back" />
          </Button>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 5,
            }}
          >
            <img src="/images/referals-done.png" />
          </Box>
        </>
      )}
    </Box>
  )
}

export default ExtraPage
