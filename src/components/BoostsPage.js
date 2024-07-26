import Balance from '@/components/BalancesTonUsdt'
import { Block } from '@/components/Block'
import DecorationBg from '@/components/DecorationBg'
import { copyTextToClipboard, getHeaders } from '@/helpers/utils'
import { useSnackbar } from '@/providers/SnackbarProvider'
import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Button,
  Card,
  IconButton,
  SwipeableDrawer,
  Typography,
  styled,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import CoinRewardDisplay from './CoinRewardDisplay'

const StyledImg = styled('img')(({}) => ({}))

const BoostsPage = (props) => {
  const { snackbar } = useSnackbar()
  const intl = useIntl()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const tgUserId = window.localStorage.getItem('chat_id')
  const [boosts, setBoosts] = useState(props.initialBoosts || [])
  const [daily, setDaily] = useState(props.initialDaily || {})
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [open, setOpen] = useState(false)
  const [autoBotBoost, setAutoBotBoost] = useState({
    start_farming_date: null,
    finish_farming_date: null,
    max_farm_points: 0,
    farmed_point: 0,
    referral_idx: 0,
  })
  const [openInvite, setOpenInvite] = useState(false)
  const [countFarmed, setCountFarmed] = useState(autoBotBoost.farmed_point)

  const txt = '🎁 +2500 Coins as a first-time gift'
  const link = `https://t.me/SecretPadBot/app?startapp=r${tgUserId}`
  const refLink = `https://t.me/share/url?url=${encodeURI(
    link,
  )}&text=${encodeURI(txt)}`

  useEffect(() => {
    setCountFarmed(autoBotBoost.farmed_point)
  }, [autoBotBoost])

  useEffect(() => {
    const farmedCount = autoBotBoost.farmed_point
    const diff = moment()
      .utc(false)
      .diff(moment(autoBotBoost.finish_farming_date), 'seconds')

    if (farmedCount === autoBotBoost.max_farm_points || diff > 0) {
      return
    }

    let id = null
    Promise.resolve(() => {
      setCountFarmed(farmedCount)
    }).then(() => {
      id = setInterval(() => {
        setCountFarmed((oldCount) => {
          if (oldCount === autoBotBoost.max_farm_points) {
            clearInterval(id)
            id = null
            return oldCount
          }
          return oldCount + 1
        })
      }, 1000)
    })

    return () => {
      clearInterval(id)
      id = null
    }
  }, [autoBotBoost])

  useEffect(() => {
    if (selectedRecord) {
      toggleDrawer(true)()
    }
  }, [selectedRecord])

  useEffect(() => {
    setBoosts(props.initialBoosts)
    setDaily(props.initialDaily)
  }, [props.initialBoosts, props.initialDaily])

  useEffect(() => {
    window.scrollTo(0, 20)
  }, [])

  useEffect(() => {
    checkAutoBotBoost()
  }, [])

  const toggleDrawer = (newOpen) => () => {
    if (!newOpen) {
      setSelectedRecord(null)
    }
    setOpen(newOpen)
  }

  const toggleDrawerInvite = (newOpen) => {
    setOpenInvite(newOpen)
  }

  const container =
    props.window !== undefined ? () => window().document.body : undefined

  const getBoosts = async () => {
    props.updateData()
    /*
    let url = `/api/get-boosts/?id=${tgUserId}`

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

    const c = {}
    data.interval.forEach((i) => {
      c[i.key] = i
    })
    setDaily(c)
    setBoosts(data.purchasable) */
  }

  const checkAutoBotBoost = async () => {
    let url = `/api/check-autobot-boost/?id=${tgUserId}`
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
    setAutoBotBoost(data)
  }

  const activateAutoBotBoost = async () => {
    let url = `/api/activate-autobot-boost`
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ id: tgUserId }),
    })
    if (!response.ok) {
      return false
    }
    const data = await response.json()
    if (data.error) {
      return false
    }
    toggleDrawer(false)()
    checkAutoBotBoost()
  }

  const claimAutoBotBoost = async () => {
    let url = `/api/claim-autobot-boost`
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ id: tgUserId }),
    })
    if (!response.ok) {
      return false
    }
    const data = await response.json()
    if (data.error) {
      return false
    }
    // checkAutoBotBoost()
    toggleDrawer(false)()
    props?.updateBalance()
    checkAutoBotBoost()
  }

  const purchaseBoost = async (item) => {
    let url = '/api/purchase-booster'

    if (['tapping_guru', 'energy_refresh'].includes(item.key)) {
      url = '/api/activate-boost'
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: tgUserId,
        boost: item.key,
      }),
    })
    if (!response.ok) {
      return false
    }
    const data = await response.json()

    if (data.result && data.result.points) props.update(data.result.points)
    // const data = await response.json()
    toggleDrawer(false)()

    if (item.key == 'energy_refresh') {
      window.toggleTab('3')
    }

    if (item.key == 'tapping_guru') {
      window.turbo_mode = true
      setTimeout(() => {
        console.log('TAPPING GURU boost is finished')
        window.stop_turbo()
      }, (item.duration_seconds - 1) * 1000)
      window.toggleTab('3')
    }

    getBoosts()
  }

  const getTitle = (val) => {
    const l = window.localStorage.getItem('language') || 'en'
    if (!val) return 'no title'
    return val[l]
  }

  const getDescription = (val) => {
    const l = window.localStorage.getItem('language') || 'en'

    if (!val) {
      return l == 'ru' ? 'нет описания' : 'no description'
    }
    return val[l]
  }

  const isNotAvailable = (val) => {
    if (!val) return true

    // for daily boosts
    if (val.amount === 0) return true
    if (val.amount && val.amount > 0) return false

    if (val.next_price && props.balance < val.next_price) return true

    return false
  }

  const isAutobotBoostType = typeof selectedRecord?.referral_idx !== 'undefined'

  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
      <DecorationBg />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mx: 'auto',
          fontFamily: 'Roboto',
          fontSize: 35,
          fontWeight: 500,
          marginTop: '24px',
        }}
      >
        <CoinRewardDisplay
          formatLArgeNum={false}
          amount={props.balance}
          coinSx={{
            width: 35,
          }}
        />
      </Box>
      <Balance data={props.balancesTonUsdt} />

      <Button
        href={intl.formatMessage({ id: 'common.big_btn_link' })}
        variant="outlined"
        sx={{
          // mt: '18px',
          mb: '18px',
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

      <Typography
        sx={{
          mb: 1,
          fontSize: '18px',
          fontWeight: 500,
          lineHeight: '22px',
          color: '#fff',
        }}
      >
        <FormattedMessage id="boosts.daily" />
      </Typography>
      <Box display={'flex'} gap={1} mb={4} sx={{ width: '100%' }}>
        <Block
          chatId={tgUserId}
          name={daily['tapping_guru'].title}
          image={'/icons/tabs/boost.png'}
          data={daily['tapping_guru']}
          reload={getBoosts}
          handle={setSelectedRecord}
          disabled={!daily['tapping_guru'] || daily['tapping_guru'].amount < 1}
        />
        <Block
          chatId={tgUserId}
          name={daily['energy_refresh'].title}
          image={'/icons/tabs/tank.png'}
          data={daily['energy_refresh']}
          reload={getBoosts}
          handle={setSelectedRecord}
          disabled={
            !daily['energy_refresh'] || daily['energy_refresh'].amount < 1
          }
        />
      </Box>
      <Typography
        sx={{
          mb: 1,
          fontSize: '18px',
          fontWeight: 500,
          lineHeight: '22px',
          color: '#fff',
        }}
      >
        <FormattedMessage id="boosts.title" />
      </Typography>

      <Card
        elevation={0}
        sx={{
          width: '100%',
          overflow: 'auto',
          backgroundColor: 'transparent',
          paddingBottom: 2,
        }}
      >
        <Box display={'flex'} gap={1} mb={4} flexDirection="column">
          <Button
            onClick={() => {
              setSelectedRecord(autoBotBoost)
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: 1,
              width: '100%',
              p: '13px',
              borderRadius: 4,
              bgcolor: 'background.card',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textTransform: 'initial',
              '&:hover': {
                bgcolor: 'background.card',
              },
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
                width: '46px',
                height: '46px',
              }}
            >
              <img
                src={`/icons/boost/autobot.png`}
                style={{
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
                  wordBreak: 'break-word',
                  textAlign: 'left',
                }}
              >
                <FormattedMessage id="boosts.autobot" />
              </Typography>
              <Box display={'flex'} columnGap={2} mt={1}>
                {autoBotBoost.referral_idx === 0 ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <StyledImg
                      src={'/images/btc-mini.png'}
                      sx={{ width: 14, height: 14, marginRight: 1 / 2 }}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'rgba(255, 255, 255, 0.5)',
                      }}
                    >
                      <FormattedMessage id="refs.invite_friend" />
                    </Box>
                  </Box>
                ) : autoBotBoost.start_farming_date === null ? (
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 400,
                      lineHeight: '22px',
                      color: '#fff',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <FormattedMessage id="boosts.autobot.activate" />
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '22px',
                        color: '#fff',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <FormattedMessage id="common.level" />{' '}
                      {autoBotBoost.referral_idx}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '22px',
                        color: '#fff',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <FormattedMessage id="boosts.autobot.farmed" />:{' '}
                      <span
                        style={{
                          // position: 'absolute',
                          display: 'inline-flex',
                          justifyContent: 'center',
                          minWidth: '20px',
                          textAlign: 'right',
                        }}
                      >
                        {countFarmed}
                      </span>{' '}
                      / {autoBotBoost.max_farm_points}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
            <Box ml={'auto'} mr={1}>
              <svg
                width="7"
                height="13"
                viewBox="0 0 7 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L6.42929 6.42929C6.46834 6.46834 6.46834 6.53166 6.42929 6.57071L1 12"
                  stroke="white"
                  stroke-linecap="round"
                />
              </svg>
            </Box>
          </Button>

          {boosts.map((i) => (
            <Button
              onClick={() => {
                if (props.balance < i.next_price) return false

                setSelectedRecord(i)
              }}
              key={i.key}
              sx={{
                display: 'flex',
                alignItems: 'center',
                columnGap: 1,
                width: '100%',
                p: '13px',
                borderRadius: 4,
                bgcolor: 'background.card',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textTransform: 'initial',
                opacity: props.balance > i.next_price ? 1 : 0.5,
                '&:hover': {
                  bgcolor: 'background.card',
                },
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  width: '46px',
                  height: '46px',
                }}
              >
                <img
                  src={`/icons/boost/${i.key}.png`}
                  style={{
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
                    wordBreak: 'break-word',
                    textAlign: 'left',
                  }}
                >
                  {getTitle(i.title)}
                </Typography>
                <Box display={'flex'} columnGap={2} mt={1}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '22px',
                        color: '#fff',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <FormattedMessage id="common.level" /> {i.level}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#fff',
                      }}
                    >
                      <FormattedMessage id="common.next" />
                      <CoinRewardDisplay
                        amount={i.next_price}
                        coinTextSx={{
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: '22px',
                        }}
                        coinSx={{
                          width: 14,
                          marginLeft: 1,
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box ml={'auto'} mr={1}>
                <svg
                  width="7"
                  height="13"
                  viewBox="0 0 7 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L6.42929 6.42929C6.46834 6.46834 6.46834 6.53166 6.42929 6.57071L1 12"
                    stroke="white"
                    stroke-linecap="round"
                  />
                </svg>
              </Box>
            </Button>
          ))}
        </Box>
      </Card>

      {/*
      <Typography
        sx={{
          mb: 1,
          fontSize: '18px',
          fontWeight: 500,
          lineHeight: '22px',
          color: '#fff',
        }}
      >
        Magic Boxes
      </Typography>

      <Card
        elevation={0}
        sx={{
          width: '100%',
          overflow: 'auto',
          backgroundColor: 'transparent',
          paddingBottom: 3,
        }}
      >
        <Box display={'flex'} gap={1} mb={4} flexDirection="column">
          <Button
            onClick={() => {
              if (props.balance < 40000) return false

              setSelectedRecord({
                key: 'giftbox',
                next_price: 150000,
                level: 1,
                title: 'Magic box',
                description: `Get your chance to win real USDT! Buy magic box and get random gift, up to 20 USDT.
                In every 30 giftboxes there are 1-2 with USDT price.`,
              })
            }}
            key={'lootboxx'}
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: 1,
              width: '100%',
              p: '13px',
              borderRadius: 4,
              bgcolor: 'background.card',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textTransform: 'initial',
              opacity: props.balance > 20000 ? 1 : 0.5,
              '&:hover': {
                bgcolor: 'background.card',
              },
            }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  width: '46px',
                  height: '46px',
                }}
              >
                <img
                  src={`/icons/boost/giftbox.png`}
                  style={{
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
                    wordBreak: 'break-word',
                    textAlign: 'left',
                  }}
                >
                  Magic box Silver
                  <br />
                  <small>Get random gift, points or up to 15 USDT on your TON wallet</small>
                </Typography>
                <Box display={'flex'} columnGap={2} mt={1}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '22px',
                        color: 'rgba(255, 255, 255, 0.5)',
                      }}
                    >
                      Silver
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '22px',
                        color: 'rgba(255, 255, 255, 0.5)',
                      }}
                    >
                      Price 50,000
                    </Typography>
                    <Box
                      sx={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '100%',
                        backgroundColor: 'rgba(255,255,255,0.24)',
                      }}
                    >
                      <img
                        src={'/images/btc-mini.png'}
                        style={{
                          display: 'block',
                          width: 'inherit',
                          maxWidth: '100%',
                          maxHeight: '100%',
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box ml={'auto'} mr={1}>
                <svg
                  width="7"
                  height="13"
                  viewBox="0 0 7 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L6.42929 6.42929C6.46834 6.46834 6.46834 6.53166 6.42929 6.57071L1 12"
                    stroke="white"
                    stroke-linecap="round"
                  />
                </svg>
              </Box>
          </Button>
          <Button
            onClick={() => {
              if (props.balance < 40000) return false

              setSelectedRecord({
                key: 'giftbox',
                next_price: 150000,
                level: 1,
                title: 'Magic box Gold',
                description: `Get your chance to win real USDT! Buy magic box and get random gift, up to 25 USDT.
                In every 30 giftboxes there are 1-2 with USDT price.`,
              })
            }}
            key={'lootboxx2'}
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: 1,
              width: '100%',
              p: '13px',
              borderRadius: 4,
              bgcolor: 'background.card',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textTransform: 'initial',
              opacity: props.balance > 20000 ? 1 : 0.5,
              '&:hover': {
                bgcolor: 'background.card',
              },
            }}
          >
              <Box
                sx={{
                  flexShrink: 0,
                  width: '46px',
                  height: '46px',
                }}
              >
                <img
                  src={`/icons/boost/giftbox.png`}
                  style={{
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
                    wordBreak: 'break-word',
                    textAlign: 'left',
                  }}
                >
                  Magic box Gold
                  <br />
                  <small>Get random gift, points or up to 25 USDT on your TON wallet</small>
                </Typography>
                <Box display={'flex'} columnGap={2} mt={1}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '22px',
                        color: 'rgba(255, 255, 255, 0.5)',
                      }}
                    >
                      Gold
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '22px',
                        color: 'rgba(255, 255, 255, 0.5)',
                      }}
                    >
                      Price 150,000
                    </Typography>
                    <Box
                      sx={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '100%',
                        backgroundColor: 'rgba(255,255,255,0.24)',
                      }}
                    >
                      <img
                        src={'/images/btc-mini.png'}
                        style={{
                          display: 'block',
                          width: 'inherit',
                          maxWidth: '100%',
                          maxHeight: '100%',
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box ml={'auto'} mr={1}>
                <svg
                  width="7"
                  height="13"
                  viewBox="0 0 7 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L6.42929 6.42929C6.46834 6.46834 6.46834 6.53166 6.42929 6.57071L1 12"
                    stroke="white"
                    stroke-linecap="round"
                  />
                </svg>
              </Box>
          </Button>
        </Box>
      </Card> */}
      <br />

      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={0}
        disableSwipeToOpen
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            borderTopRightRadius: '10px',
            borderTopLeftRadius: '10px',
          },
        }}
      >
        <IconButton
          onClick={toggleDrawer(false)}
          sx={{
            marginLeft: 'auto',
            position: 'absolute',
            right: 10,
          }}
        >
          <CloseIcon sx={{ color: '#fff' }} />
        </IconButton>

        <Box
          sx={{
            minHeight: '250px',
            maxHeight: isSmallScreen ? 'auto' : '80vh',
            backgroundColor: '#171717',
            color: '#fff',
            p: 2,
            pt: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                zIndex: 1,
                position: 'relative',
                flexShrink: 0,
                mt: 5,
                width: '140px',
                height: '140px',
                '&::after': {
                  content: '""',
                  zIndex: -1,
                  position: 'absolute',
                  top: '50%',
                  right: '50%',
                  transform: 'translate(50%, -50%)',
                  width: '200px',
                  height: '135px',
                  backgroundImage: 'url(/images/ellipse-light.png)',
                  backgroundSize: 'cover',
                  filter: 'blur(10px)',
                  pointerEvents: 'none',
                },
              }}
            >
              <img
                src={
                  isAutobotBoostType
                    ? '/icons/boost/autobot.png'
                    : `/icons/boost/${
                        selectedRecord?.key || 'energy_boost'
                      }.png`
                }
                style={{
                  width: 'inherit',
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
              />
            </Box>
          </Box>
          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 600,
              lineHeight: 1.2,
              textAlign: 'center',
              padding: 2,
            }}
          >
            {!isAutobotBoostType ? (
              getTitle(selectedRecord?.title)
            ) : selectedRecord?.start_farming_date === null ? (
              'Invite your friends and get an autobot!'
            ) : (
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '22px',
                  color: '#fff',
                  whiteSpace: 'nowrap',
                }}
              >
                <FormattedMessage id="boosts.autobot.farmed" />:{' '}
                <span
                  style={{
                    // position: 'absolute',
                    display: 'inline-flex',
                    justifyContent: 'center',
                    minWidth: '20px',
                    textAlign: 'right',
                  }}
                >
                  {countFarmed}
                </span>{' '}
                / {selectedRecord?.max_farm_points}
              </Typography>
            )}
          </Typography>
          {isAutobotBoostType ? (
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#AEB2BA',
                  padding: '4px 12px',
                  textAlign: 'center',
                  margin: 0,
                  paddingBottom: 0,
                }}
              >
                <FormattedMessage id="boosts.autobot.description1" />
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#AEB2BA',
                  padding: '4px 16px',
                  textAlign: 'center',
                }}
              >
                <FormattedMessage id="boosts.autobot.description2" />
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#AEB2BA',
                  padding: '4px 12px',
                  textAlign: 'center',
                }}
              >
                {intl.formatMessage(
                  { id: 'boosts.autobot.description3' },
                  { level: selectedRecord?.referral_idx },
                )}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#AEB2BA',
                  padding: '4px 12px',
                  textAlign: 'center',
                }}
              >
                {intl.formatMessage(
                  { id: 'boosts.autobot.description4' },
                  { reward: selectedRecord?.max_farm_points },
                )}
              </Typography>
            </Box>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: '#AEB2BA',
                padding: '4px 12px',
                textAlign: 'center',
              }}
            >
              {getDescription(selectedRecord?.description)}
            </Typography>
          )}

          {selectedRecord && selectedRecord.next_level_available && (
            <Box display={'flex'} columnGap={3} mt={2} mb={4}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <CoinRewardDisplay
                  amount={selectedRecord?.next_price}
                  coinsTextSx={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: '#FDE0B4',
                  }}
                  coinSx={{
                    width: 18,
                    marginRight: 0.5,
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  columnGap: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <FormattedMessage id="common.level" /> {selectedRecord?.level}
                </Typography>
              </Box>
            </Box>
          )}
          <br />

          {isAutobotBoostType ? (
            <Button
              variant="contained"
              onClick={() => {
                if (
                  selectedRecord?.referral_idx > 0 &&
                  selectedRecord?.start_farming_date === null
                ) {
                  activateAutoBotBoost()
                } else if (selectedRecord?.referral_idx > 0) {
                  claimAutoBotBoost()
                } else {
                  toggleDrawer(false)()
                  toggleDrawerInvite(true)
                }
              }}
              sx={{
                mt: 'auto',
                py: 1,
                width: '100%',
                color: '#171717',
                fontSize: 18,
                fontWeight: 700,
                borderRadius: 2.5,
                backgroundImage:
                  'linear-gradient(76.82deg, #576265 11.6%, #9EA1A1 25.31%, #848B8A 48.06%, #576265 55.72%, #576265 77.23%, #757A7B 85.34%, #576265 91.31%)',
                backgroundColor: 'rgba(193, 168, 117, 1)',
                backgroundBlendMode: 'overlay',
                boxShadow: '4px 6px 4px 0px rgba(0, 0, 0, 0.34)',
                '&:hover': {
                  backgroundColor: 'rgba(193, 168, 117, 1)',
                },
              }}
            >
              {selectedRecord?.referral_idx > 0 &&
              selectedRecord?.start_farming_date === null ? (
                <FormattedMessage id="boosts.get_btn" />
              ) : selectedRecord?.referral_idx > 0 ? (
                <FormattedMessage id="tasks.claim" />
              ) : (
                <FormattedMessage id="refs.invite_friend" />
              )}
            </Button>
          ) : (
            <Button
              disabled={isNotAvailable(selectedRecord)}
              variant={
                selectedRecord?.next_level_available ? 'text' : 'contained'
              }
              onClick={() => {
                purchaseBoost(selectedRecord)
              }}
              sx={{
                mt: 'auto',
                py: 1,
                width: '100%',
                color: '#171717',
                fontSize: 18,
                fontWeight: 700,
                borderRadius: 2.5,
                backgroundImage:
                  'linear-gradient(76.82deg, #576265 11.6%, #9EA1A1 25.31%, #848B8A 48.06%, #576265 55.72%, #576265 77.23%, #757A7B 85.34%, #576265 91.31%)',
                backgroundColor: 'rgba(193, 168, 117, 1)',
                backgroundBlendMode: 'overlay',
                boxShadow: '4px 6px 4px 0px rgba(0, 0, 0, 0.34)',
                '&:hover': {
                  backgroundColor: 'rgba(193, 168, 117, 1)',
                },
              }}
            >
              <FormattedMessage id="boosts.get_btn" />
            </Button>
          )}
        </Box>
      </SwipeableDrawer>

      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={openInvite}
        onClose={() => toggleDrawerInvite(false)}
        onOpen={() => toggleDrawerInvite(true)}
        swipeAreaWidth={0}
        disableSwipeToOpen
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            borderTopRightRadius: '10px',
            borderTopLeftRadius: '10px',
          },
        }}
      >
        <IconButton
          onClick={() => toggleDrawerInvite(false)}
          size="large"
          sx={{
            zIndex: 99,
            marginLeft: 'auto',
            position: 'absolute',
            right: 10,
          }}
        >
          <CloseIcon sx={{ color: '#fff' }} />
        </IconButton>

        <Box
          sx={{
            minHeight: '280px',
            backgroundColor: '#171717',
            color: '#fff',
            p: 2,
            pt: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 0,
          }}
        >
          <Typography variant="h6">
            <FormattedMessage id="refs.invite_friend" />
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
              window.Telegram.WebApp.openTelegramLink(refLink)
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
        </Box>
      </SwipeableDrawer>
    </Box>
  )
}

export default BoostsPage
