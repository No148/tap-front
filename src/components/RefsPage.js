import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Grid,
  IconButton,
  Paper,
  Stack,
  SwipeableDrawer,
  Typography,
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { useEffect, useState, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import DecorationBg from '@/components/DecorationBg'
import { copyTextToClipboard } from '@/helpers/utils'
import { useSnackbar } from '@/providers/SnackbarProvider'
import CloseIcon from '@mui/icons-material/Close'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress'
import CoinRewardDisplay from './CoinRewardDisplay'
import LanguageSelector from './LanguageSelector'
import ReferralReward from './ReferralReward'

const autoOpenFoundProfile = true

const { publicRuntimeConfig } = getConfig()
const { domainName } = publicRuntimeConfig

const useStyles = (theme) => ({
  breadcrumbs: {
    marginBottom: theme.spacing(4),
    [theme.breakpoints.only('xs')]: {
      marginBottom: theme.spacing(3),
    },
  },
  container: {
    position: 'relative',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
  },
  profile: {
    position: 'relative',
    background: theme.palette.mode == 'dark' ? '#121219' : '#fff',
    // boxShadow: '0px 40px 90px rgba(14, 9, 28, 0.2)',
    borderRadius: 26,
    padding: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    minWidth: '300px',
    width: '100%',
    // maxWidth: '998px',
    // opacity: 1,
    [theme.breakpoints.only('xs')]: {
      maxWidth: '320px',
      padding: 10,
    },
  },
})

const Item = styled(Paper)(({ theme }) => ({
  background: 'rgba(247, 228, 184, 1)',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  maxWidth: '80%',
}))

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  marginTop: 10,
  width: '100%',
  height: 20,
  borderRadius: 10,
  border: '1px solid rgba(217, 217, 217, 0.3)',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: 'transparent',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 10,
    background:
      'linear-gradient(90deg, #000000 0%, #CD4339 43.05%, #EF984D 76.98%, #F8DE53 93.06%);\n',
  },
}))

const RefPage = () => {
  const theme = useTheme()
  const classes = useStyles(theme)
  const intl = useIntl()
  const router = useRouter()
  const [refs, setRefs] = useState(0)
  const [balance, setBalance] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [activeTab, setActvieTab] = useState('list')
  const [open, setOpen] = useState(false)
  const [openReward, setOpenReward] = useState(false)
  const [openInvite, setOpenInvite] = useState(false)
  const [tgUserId, setUserId] = useState(null)
  const [refList, setRefList] = useState([])
  const [refUrl, setRefUrl] = useState(false)
  const [hasLootbox, setHasLootbox] = useState(0)
  const [gotReward, setGotReward] = useState(false)
  const [translated, setTranslated] = useState(false)
  const [lootboxId, setLootboxId] = useState(false)
  const [platform, setPlatform] = useState(false)
  const [rewards, setRewards] = useState(false)
  const [shareLootboxUrl, setShareLootboxUrl] = useState(false)
  const { snackbar } = useSnackbar()

  const [refListPage, setRefListPage] = useState(1)
  const [refListTotalSize, setRefListTotalSize] = useState(0)
  const refListRowsPerPage = 100

  const tabs = useMemo(
    () => [
      { name: 'list', label: 'title' },
      { name: 'claim', label: 'claim_reward' },
    ],
    [],
  )

  const loadLootboxes = async (id) => {
    const response = await fetch(`/api/my-lootboxes/?id=${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      return false
    }

    const d = await response.json()

    if (d.available) {
      const txt = `🎁 Lootbox with crazy bonuses. Follow the link and get it!
        Possible rewards:

        💵 USDT
        💎 TON
        💰 $COINs
      `
      const lnk = `https://t.me/${
        domainName.includes('-dev') ? 'tapp_app_dev_bot' : 'SecretPadBot'
      }/app?startapp=r${id}_lootbox${d.id}` // /app?startapp=lootbox${d.id}
      const link = `https://t.me/share/url?url=${encodeURI(
        lnk,
      )}&text=${encodeURI(txt)}`

      setLootboxId(d.id)
      setShareLootboxUrl(link)
      setHasLootbox(d.count)
    }
  }

  const toggleDrawer = (newOpen) => {
    if (!newOpen && gotReward) {
      setGotReward(false) // after closing swiper, clear information about reward
    }
    setOpen(newOpen)
  }

  const toggleDrawerReward = (newOpen) => {
    setOpenReward(newOpen)
  }

  const toggleDrawerInvite = (newOpen) => {
    setOpenInvite(newOpen)
  }

  useEffect(() => {
    const c = window.localStorage.getItem('chat_id') || false
    if (c) setUserId(c)

    const l = window.localStorage.getItem('language') || 'en'
    if (l && l != 'en') setTranslated(true)

    // window.Telegram.WebApp.initDataUnsafe.start_param
    if (window.Telegram) {
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.isClosingConfirmationEnabled = true
    }

    const txt = '🎁 +2500 Coins as a first-time gift'
    const lnk = `https://t.me/SecretPadBot/app?startapp=r${c}`
    const link = `https://t.me/share/url?url=${encodeURI(lnk)}&text=${encodeURI(
      txt,
    )}`
    setRefUrl(link)
    loadLootboxes(c)

    const pl = window.Telegram.WebApp.platform
    setPlatform(pl || 'lol')

    const box = window.localStorage.getItem('lootbox_reward') || false
    if (box) {
      setGotReward(JSON.parse(box))
      toggleDrawerReward(true)
      // remove information, so next time modal will not appear
      window.localStorage.removeItem('lootbox_reward')
    }

    console.log('set ref link', link)
  }, [])

  const loadRefRewards = async () => {
    let url = `/api/my-refs-rewards/?id=${tgUserId}`
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      return false
    }

    const answer = await response.json()
    if (answer && answer.accumulated) {
      setRewards(answer.accumulated)
    }
  }

  const loadRefInfo = async () => {
    let url = `/api/my-refs/?id=${tgUserId}&page=${refListPage}&limit=${refListRowsPerPage}`
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      return false
    }

    const answer = await response.json()
    if (answer) {
      setBalance(answer.earned || 0)
      setRefs(answer.referrals || 0)
      setRefList((prev) => [...prev, ...answer.list])
      setRefListTotalSize(answer.referrals || 0)
    }

    setLoaded(true)
  }

  useEffect(() => {
    if (tgUserId) {
      loadRefInfo()
      loadRefRewards()
    }
  }, [tgUserId, refListPage])

  function onTap() {
    setBalance(balance + 1)
  }

  const invite = async () => {
    window.location = link
    // window.Telegram.WebApp.close()
  }

  const getLevel = (level) => {
    if (translated) return level.ru
    return level.en
  }

  if (!loaded)
    return (
      <Box
        display={'flex'}
        alignItems={'center'}
        flexDirection={'column'}
        sx={{
          // touchAction: 'pan-x',
          color: '#FFD700',
          marginTop: '30vh',
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    )

  return (
    <Box>
      <DecorationBg />
      <Box
        sx={{
          position: 'absolute',
          top: '6px',
          right: '10px',
        }}
      >
        <LanguageSelector
          notDefault={translated}
          onChange={(e) => {
            const val = e.target.value
            console.log(e.target.value)
            window.localStorage.setItem('language', val)
            window.toggleLanguage(val)
            setTranslated(val != 'en')
          }}
        />
      </Box>
      <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
        <Typography
          sx={{
            ml: 1,
            color: '#FFFFFF',
            fontFamily: 'Roboto',
            fontSize: '26px',
            fontWeight: 400,
            lineHeight: '38px',
            textAlign: 'center',
          }}
        >
          <br />
          <FormattedMessage id="refs.title" />: {refs} <br />
          <Box
            display="flex"
            alignItems="center"
            component="span"
            sx={{
              color: '#FDE0B4',
              fontSize: '18px',
              fontWeight: 400,
            }}
          >
            <FormattedMessage id="refs.total_profit" />:
            <CoinRewardDisplay
              plus
              plusSx={{ paddingLeft: 1 }}
              amount={balance}
              coinSx={{
                display: 'block',
                width: '20px',
              }}
            />
          </Box>
        </Typography>

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

        {tgUserId && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                aria-describedby="filter-popover-tags"
                disableRipple
                // target='_blank'
                onClick={() => {
                  toggleDrawerInvite(true)
                  // window.Telegram.WebApp.openTelegramLink(refUrl)
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
                <FormattedMessage id="refs.invite_friend" />
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                aria-describedby="filter-popover-tags"
                disableRipple
                onClick={() => toggleDrawer(true)}
                sx={{
                  width: '100%',
                  // width: { xs: '100%', sm: 'auto' },
                  flex: { xs: 2, sm: 1 },
                  mt: 1,
                  py: 1.8,
                  minWidth: 140,
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
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    backgroundColor: 'rgba(193, 168, 117, 1)',
                  },
                }}
                size="large"
              >
                <FormattedMessage id="refs.lootboxes" />
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
      <Card
        elevation={0}
        sx={{
          width: '100%',
          overflow: 'auto',
          backgroundColor: 'transparent',
          paddingBottom: 8,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
          <ButtonGroup
            color="primary"
            value={activeTab}
            exclusive
            aria-label="Platform"
            sx={{
              width: '100%',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {tabs.map((tab) => {
              return (
                <Button
                  onClick={() => {
                    setActvieTab(tab.name)
                  }}
                  sx={{
                    flex: 1,
                    textTransform: 'initial',
                    padding: '6px 30px',
                    border: 'none',
                    borderRadius: '12px',
                    transform: 'scale(0.9)',
                    whiteSpace: 'nowrap',
                    position: 'relative',
                    background:
                      activeTab === tab.name ? '#1F1F1F' : 'transparent',
                    '&:hover': {
                      border: 'none',
                      background: '#1F1F1F',
                    },
                  }}
                >
                  <FormattedMessage id={`refs.${tab.label}`} />
                </Button>
              )
            })}
          </ButtonGroup>
        </Box>

        <Box
          display={'flex'}
          gap={1}
          flexDirection="column"
          sx={{
            marginBlock: 2,
            alignItems: 'center',
          }}
        >
          {activeTab == 'claim' && <ReferralReward data={rewards} />}

          {activeTab == 'list' &&
            refList.map((item) => {
              return (
                <Box
                  key={item.name}
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    columnGap: 1,
                    width: '100%',
                    p: '13px',
                    borderRadius: 4,
                    bgcolor: 'background.card',
                    textTransform: 'initial',
                    '&:hover': {
                      bgcolor: 'background.card',
                    },
                  }}
                >
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                    position="relative"
                  >
                    <Grid item xs={5} sm={7}>
                      <Typography
                        sx={{
                          mb: 0.5,
                          fontSize: '14px',
                          fontWeight: 500,
                          lineHeight: '22px',
                          color: '#fff',
                          wordBreak: 'break-all',
                          textAlign: 'left',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          '-webkit-line-clamp': '1',
                          '-webkit-box-orient': 'vertical',
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sm={5}
                      sx={{
                        position: 'absolute',
                        right: 10,
                        fontSize: 18,
                        fontWeight: 400,
                        lineHeight: '22px',
                        color: '#FDE0B4',
                        display: 'inline-flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <CoinRewardDisplay
                        plus
                        amount={item.reward}
                        coinSx={{
                          display: 'block',
                          width: 16,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        columnGap: 1,
                        mr: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 400,
                          lineHeight: '16px',
                          color: '#AFAFAF',
                          textTransform: 'capitalize',
                        }}
                      >
                        <img
                          src={`/icons/levels/${item.level.en}.png`}
                          style={{
                            display: 'inline-block',
                            verticalAlign: 'middle',
                            width: '20px',
                            height: '20px',
                          }}
                        />
                        &nbsp; {getLevel(item.level)}
                        <CoinRewardDisplay
                          amount={item.points}
                          coinSx={{
                            marginLeft: '20px',
                            marginBottom: '-2px',
                            display: 'inline-block',
                            width: 12,
                            height: 12,
                          }}
                        />
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        columnGap: 1,
                      }}
                    ></Box>
                  </Box>
                  <BorderLinearProgress
                    variant="determinate"
                    value={item.progress}
                  />
                </Box>
              )
            })}

          {activeTab == 'list' && refListTotalSize > refList.length && (
            <Button
              variant="outlined"
              aria-describedby="filter-popover-tags"
              disableRipple
              onClick={() => {
                setRefListPage((prev) => prev + 1)
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
              }}
              size="large"
            >
              <FormattedMessage id="common.loadMore" />
            </Button>
          )}
        </Box>
      </Card>

      <SwipeableDrawer
        // container={container}
        anchor="bottom"
        open={openReward}
        onClose={() => toggleDrawerReward(false)}
        onOpen={() => toggleDrawerReward(true)}
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
          onClick={() => toggleDrawerReward(false)}
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
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
              textAlign: 'center',
              marginBottom: '16px',
            }}
          >
            Congratulations!! You just won:
            <br />
            <span style={{ fontSize: '14px' }}>
              {gotReward.ton} TON, {gotReward.usdt} USDT, {gotReward.points}{' '}
              points
            </span>
          </Typography>
          <img
            src={'/images/reward.jpg'}
            style={{
              width: '100%',
              borderRadius: '10px',
            }}
          />
        </Box>
      </SwipeableDrawer>

      <SwipeableDrawer
        // container={container}
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
        </Box>
      </SwipeableDrawer>

      <SwipeableDrawer
        // container={container}
        anchor="bottom"
        open={open}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
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
          onClick={() => toggleDrawer(false)}
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

        {hasLootbox < 1 && (
          <Box
            sx={{
              minHeight: '250px',
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
            <Typography
              sx={{ fontSize: 20, fontWeight: 600, textAlign: 'center' }}
            >
              You don't have any lootbox yet.
            </Typography>
          </Box>
        )}

        {hasLootbox > 0 && (
          <Box
            sx={{
              backgroundColor: '#171717',
              color: '#fff',
              p: 2,
              pt: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 0,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'stretch', mt: 2 }}>
              <Box
                sx={{
                  zIndex: 1,
                  position: 'relative',
                }}
              >
                <img
                  width={236}
                  style={{ height: '100%' }}
                  src={'/images/lootbox.png'}
                />
              </Box>
            </Box>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 600,
                textAlign: 'center',
                marginBottom: 1,
                marginTop: 3,
              }}
            >
              <FormattedMessage id="refs.lootbox_title" /> {hasLootbox}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 / 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#AEB2BA',
                  textAlign: 'center',
                  padding: '0 20px',
                }}
              >
                <FormattedMessage id="refs.lootbox_info" />
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: '#AEB2BA',
                  textAlign: 'center',
                  padding: '0 5px',
                }}
              >
                <FormattedMessage id="refs.lootbox_info1" />
              </Typography>
            </Box>

            <br />
            <Button
              variant="outlined"
              aria-describedby="filter-popover-tags"
              disableRipple
              disabled={!hasLootbox}
              target="_blank"
              onClick={() => {
                toggleDrawer(false)
                window.Telegram.WebApp.openTelegramLink(shareLootboxUrl)
                // shareLootboxUrl
              }}
              sx={{
                mt: 'auto',
                py: 1,
                width: '100%',
                color: '#171717',
                textTransform: 'initial',
                fontSize: '18px',
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
              <FormattedMessage id="refs.send_lootbox" />
            </Button>
          </Box>
        )}
      </SwipeableDrawer>
    </Box>
  )
}

export default RefPage
