import Balance from '@/components/BalancesTonUsdt'
import { formatInt } from '@/helpers/formatter'
import { getHeaders, useDebounce } from '@/helpers/utils'
import { useSnackbar } from '@/providers/SnackbarProvider'
import CloseIcon from '@mui/icons-material/Close'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import {
  default as KeyboardArrowRight,
  default as KeyboardArrowRightIcon,
} from '@mui/icons-material/KeyboardArrowRight'
import { Box, IconButton, SwipeableDrawer, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress'
import MobileStepper from '@mui/material/MobileStepper'
import { styled, useTheme } from '@mui/material/styles'
import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import SwipeableViews from 'react-swipeable-views'
import CoinRewardDisplay from './CoinRewardDisplay'
import TapCoin from './TapCoin'
import InfoCard from './InfoCard'

const { publicRuntimeConfig } = getConfig()
const { apiUrl, mode, imageStorage } = publicRuntimeConfig

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  width: '90%',
  height: 20,
  margin: 3,
  borderRadius: 10,
  border: '1px solid rgba(217, 217, 217, 0.3)',
  overflow: 'hidden',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: 'transparent',
  },
  [`& .${linearProgressClasses.bar}`]: {
    margin: '2px',
    borderRadius: 10,
    width: '99%',
    background:
      'linear-gradient(90deg, #000000 0%, #CD4339 43.05%, #EF984D 76.98%, #F8DE53 93.06%)',
    '&:after': {
      zIndex: 1,
      content: "''",
      position: 'absolute',
      top: '-3px',
      right: 3,
      width: 10,
      height: 21,
      background: '#FFFFFF',
      borderRadius: 15,
      filter: 'blur(5px)',
      //boxShadow: '0 0 5px #fff',
    },
  },
}))

function SwipeableTextMobileStepper({ levels, taps, currentLevel }) {
  const theme = useTheme()
  const intl = useIntl()
  const [activeStep, setActiveStep] = useState(() => {
    const currLevelIndex = levels?.findIndex(
      (item) => item.title.en === currentLevel.title.en,
    )

    return currLevelIndex && currLevelIndex !== levels.length - 1
      ? currLevelIndex + 1
      : currLevelIndex
  })
  const [value, setValue] = useState(0)
  const maxSteps = levels?.length
  const currLng = localStorage.getItem('language') ?? 'ru'

  useEffect(() => {
    const delta = taps / Math.max(levels[activeStep]?.taps, 1)
    const percent = Math.round(Math.min(delta, 1) * 100)
    setValue(percent)
  }, [activeStep])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStepChange = (step) => {
    setActiveStep(step)
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: '464px',
        padding: '30px 20px',
        paddingBottom: '40px',
        backgroundColor: '#171717',
        backgroundImage: 'url(/images/decor-light.png)',
        backgroundPositionY: '150px',
        backgroundPositionX: 'right',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Typography
        sx={{
          fontSize: 26,
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: 2,
          textTransform: 'capitalize',
        }}
      >
        {`${levels[activeStep]?.title?.[currLng]} ${intl.formatMessage({
          id: 'game.level.league',
        })}`}
      </Typography>

      <Typography
        sx={{
          fontSize: 14,
          lineHeight: '16.41px',
          textAlign: 'center',
          maxWidth: '225px',
          margin: '0 auto',
          color: '#AFAFAF',
        }}
      >
        <FormattedMessage id="game.level.description" />
      </Typography>

      <Typography
        sx={{
          fontSize: 14,
          lineHeight: '16.41px',
          textAlign: 'center',
          maxWidth: '225px',
          margin: '0 auto',
          marginTop: 1,
          color: '#AFAFAF',
        }}
      >
        <FormattedMessage id="game.level.description2" />:{' '}
        <span style={{ color: '#fff' }}>{formatInt(taps)}</span>
      </Typography>

      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {levels.map((step, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '40px',
            }}
          >
            {Math.abs(activeStep - index) <= 2 ? (
              <Box
                component="img"
                sx={{
                  height: 160,
                  display: 'block',
                  maxWidth: 160,
                  overflow: 'hidden',
                  width: '100%',
                }}
                src={`/images/levels/${step.title?.en}.png`}
                alt={step.title}
              />
            ) : null}
          </div>
        ))}
      </SwipeableViews>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '40px',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {taps && taps >= levels[activeStep]?.taps ? (
          <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
            <FormattedMessage id="tasks.done" />
          </Typography>
        ) : (
          <>
            <Typography
              sx={{ fontSize: 14, display: 'flex', alignItems: 'center' }}
            >
              <span
                style={{ fontSize: 18, fontWeight: 900, marginRight: '2px' }}
              >
                {formatInt(taps)}
              </span>{' '}
              /{formatInt(levels[activeStep]?.taps)}
            </Typography>
            <BorderLinearProgress
              sx={{
                width: '100%',
              }}
              onClick={() => toggleDrawer(true)}
              value={value}
              variant="determinate"
            />
          </>
        )}
      </Box>

      <MobileStepper
        steps={0}
        position="static"
        activeStep={activeStep}
        sx={{
          transform: 'translateY(-210px)',
          background: 'transparent',
        }}
        nextButton={
          <Button
            disableRipple
            disableFocusRipple
            disableTouchRipple
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button
            disableRipple
            disableFocusRipple
            disableTouchRipple
            size="small"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
          </Button>
        }
      />
    </Box>
  )
}

var myEnergy = 0
var myTicks = 1
var tickInterval = null
var myBalance = 0

const levelTitles = [
  'Wooden',
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Diamond',
  'Master',
  'Grandmaster',
  'Elite',
  'Legendary',
  'Mythic',
]

const GamePage = ({ saveProgress, ...props }) => {
  const theme = useTheme()
  const router = useRouter()
  const childRef = useRef(null)
  const { snackbar } = useSnackbar()
  const [turbo, setTurbo] = useState(false)
  const [longScreen, setLongScreen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [ticker, setTicker] = useState(0)
  const [level, setLevel] = useState(1)
  const [balance, setBalance] = useState(props.cachedBalance || 0)
  const [energy, setEnergy] = useState(100)
  const [maxEnergy, setMaxEnergy] = useState(100)
  const [power, setPower] = useState(1)
  const [recharging, setRecharging] = useState(1)
  const [tgUserId, setUserId] = useState(null)
  const [timer, setTimer] = useState(null)
  const [debug, setDebug] = useState('')
  const [showSplash, setShowSplash] = useState(false)
  const [balances, setBalances] = useState(false)
  const [open, setOpen] = useState(false)
  const [levelsInfo, setLevelsInfo] = useState([])
  const [currentLevel, setCurrentLevel] = useState(null)
  const [tapsCount, setTapsCount] = useState(0)

  const tapsRef = useRef(0)
  const tappingStartedDateRef = useRef('')
  const currLng = localStorage.getItem('language') ?? 'ru'

  const handleSubmit = () => {
    let currentNumber = number
    for (let i = 0; i < currentNumber.length; i++) {
      setTimeout(() => {
        setNumber(currentNumber.slice(0, i))
      }, 100 * i)
    }
  }

  const debouncedSaveProgress = useDebounce(() => {
    const taps = localStorage.getItem('taps')
    if (taps > 0) {
      saveProgress(tgUserId, tapsRef.current, tappingStartedDateRef.current)

      localStorage.setItem('taps', (tapsRef.current = 0))
      localStorage.setItem(
        'tappingStartedDate',
        (tappingStartedDateRef.current = ''),
      )
    }
  }, 1500)

  const onTap = useCallback(
    (touchesCount) => {
      if (!tappingStartedDateRef.current) {
        tappingStartedDateRef.current = new Date().toISOString()
      }
      if (Math.floor(energy / power) >= touchesCount) {
        tapsRef.current += touchesCount
        setBalance((prevBalance) => prevBalance + touchesCount * power)
      }

      localStorage.setItem('taps', tapsRef.current)
      localStorage.setItem('tappingStartedDate', tappingStartedDateRef.current)

      debouncedSaveProgress()

      if (!window.turbo_mode) {
        setEnergy((energy) => {
          if (energy - touchesCount * power >= 0) {
            return energy - touchesCount * power
          }
          return 0
        })
      }
      if (props.update) props.update(balance + touchesCount * power)
    },
    [balance, energy, power],
  )

  const checkSavedData = async () => {
    const chatId = window.localStorage.getItem('chat_id')

    if (!chatId) return false // failed
    setUserId(chatId)

    const response = await fetch(`/api/get-points/?id=${chatId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) {
      return false
    }

    const answer = await response.json()
    if (answer && answer.level_info) {
      setBalance(answer.points)
      myBalance = answer.points
      setMaxEnergy(answer.energy_limit)
      setEnergy(answer.energy)
      setPower(answer.tap_power)
      setLevel(answer.level_info.level)
      setRecharging(answer.recharging_speed)
      setBalances(answer.balances)
      if (props.update) {
        props.update(answer.points)
      }
      setLoaded(true)
      window.localStorage.setItem('spent_points', answer.spent_points || 0)
      window.localStorage.setItem('total_points', answer.total_points || 0)
      window.localStorage.setItem('my_taps', answer.taps)
      myEnergy = answer.energy
    }

    if (answer) {
      setTapsCount(answer.taps)
      setCurrentLevel(answer.level_info)
    }
    console.log(
      'new balance, power: ',
      answer.points,
      answer.tap_power,
      new Date(),
    )
  }

  const getGameLevels = async () => {
    let url = `/api/get-levels-info/`
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    })

    if (!response.ok) {
      return false
    }

    const data = await response.json()
    if (data.error) {
      console.error('Something went wrong')
      return
    }
    setLevelsInfo(data.tap_levels)
  }

  const loadUserData = async () => {
    const usr = window.Telegram.WebApp.initDataUnsafe.user || {}
    if (Object.keys(usr).length < 1) {
      // try to use saved in local storage data
      checkSavedData()
      return false // no user data
    }

    const chatId = usr.id
    const username = usr.username

    if (username && username.length > 1) {
      window.localStorage.setItem('tg_username', username)
    }

    if (chatId) {
      setUserId(chatId)
      window.localStorage.setItem('chat_id', chatId)
    }

    // trigger reload data
    checkSavedData()
  }

  useEffect(() => {
    if (window.turbo_mode) setTurbo(true)

    getGameLevels()

    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.expand()
      loadUserData()
      // setDebug(JSON.stringify(window.Telegram.WebApp.initDataUnsafe.user))

      if (window.Telegram.WebApp?.viewportStableHeight > 680) {
        setLongScreen(true)
      }
    }

    window.Telegram.WebApp.isClosingConfirmationEnabled = true
    document.body.classList.add('no-scroll-body')
    window.scrollTo(0, 20)

    tickInterval = setInterval(() => setTicker(myTicks++), 1000)
    window.stop_turbo = () => {
      window.turbo_mode = false
      console.log('FINISH tapping guru, trigger saving data', new Date())
      saveProgress(tgUserId, tapsRef.current, tappingStartedDateRef.current)
      setShowSplash(true)
      setTurbo(false)
      setTimeout(() => checkSavedData(), 3700) // hit reload metrics, tap power, etc
    }

    window.kick_ass = () => setShowSplash(true)

    return () => {
      document.body.classList.remove('no-scroll-body')
      window.stop_turbo = () => false
      clearInterval(tickInterval)
    }
  }, [])

  useEffect(() => {
    if (!loaded) return false

    document.body.classList.add('no-scroll-body')

    if (childRef && childRef.current) {
      const h = function (e) {
        e.preventDefault()
      }
      childRef.current.addEventListener('touchmove', h)
      childRef.current.addEventListener('touchcancel', h)
    }
  }, [loaded])

  useEffect(() => {
    if (energy >= maxEnergy) return false // do nothing
    const c = energy + recharging
    setEnergy(c > maxEnergy ? maxEnergy : c)
  }, [ticker])

  useEffect(
    () => () => {
      if (tapsRef.current > 0) {
        saveProgress(tgUserId, tapsRef.current, tappingStartedDateRef.current)
        localStorage.setItem('taps', 0)
        localStorage.setItem('tappingStartedDate', '')
      }
    },
    [tgUserId],
  )

  useEffect(() => {
    if (showSplash) setTimeout(() => setShowSplash(false), 4000)
  }, [showSplash])

  const toggleDrawer = (newOpen) => {
    setOpen(newOpen)
  }

  const levelUpRemains = useMemo(() => {
    if (currentLevel && tapsCount > -1 && levelsInfo.length) {
      const level = levelsInfo.find((v, i) => i === currentLevel?.level + 1)
      return level.taps - tapsCount
    }
    return 0
  }, [currentLevel, tapsCount, levelsInfo])

  const container =
    props.window !== undefined ? () => window().document.body : undefined

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
    <Box
      display={'flex'}
      alignItems={'center'}
      flexDirection={'column'}
      sx={{
        position: 'relative',
        height: '100vh',
        // touchAction: 'none', // 'pan-x',
        overflow: 'hidden',
        // filter: showSplash ? 'blur(3px)': 'none',
        background: "no-repeat url('/images/cosmic-plateau.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      ref={childRef}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Roboto',
          fontSize: 35,
          fontWeight: 500,
          textAlign: 'left',
          marginTop: '15px',
        }}
      >
        <CoinRewardDisplay
          formatLArgeNum={false}
          amount={balance}
          coinSx={{
            width: 35,
          }}
        />
      </Box>
      <Balance data={balances} />
      <Box
        sx={{
          outline: 'unset',
          width: '40vw',
          height: '100vh',
          position: 'absolute',
          zIndex: 0,
          top: 0,
        }}>
        <TapCoin
          power={power}
          turbo={turbo}
          onTap={onTap}
          energy={energy}
          longScreen={longScreen}
        />
      </Box>

      <Box
        display="flex"
        alignSelf="flex-start"
        rowGap="8px"
        flexDirection="column"
      >
        <InfoCard value={power} label={<FormattedMessage id="game.earnPerTap" />} plus />
        <InfoCard value={levelUpRemains} label={<FormattedMessage id="game.tapsLvl" />} />
        <InfoCard sx={{opacity: 0.5}} value={0} label={<FormattedMessage id="game.ProfitPerHour" />} />
      </Box>
      {showSplash && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            zIndex: 9999,
            borderRadius: 4,
            // bgcolor: 'background.card',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '90%',
              height: '440px',
              marginTop: '20vh',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              backgroundColor: '#171717',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              userSelect: 'none',
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
                    left: '-23px',
                    position: 'absolute',
                    width: '12rem',
                    height: '9rem',
                    borderRadius: '100%',
                    background: 'rgba(233, 176, 93, 0.5)',
                    filter: 'blur(30px)',
                  },
                }}
              >
                <img
                  src={`/icons/boost/tapping_guru.png`}
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
                fontSize: 16,
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              <FormattedMessage id="game.guru_title" />
            </Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: '16rem',
                color: '#AEB2BA',
                padding: '4px 12px',
                textAlign: 'center',
              }}
            >
              <FormattedMessage id="game.saving" />
            </Typography>
            <br />
            <CircularProgress color="inherit" />
          </Box>
        </Box>
      )}
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        position="fixed"
        bottom={95}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="90%"
        >
          <Box display={'flex'} alignItems={'center'} sx={{ userSelect: 'none' }}>
            <img
              src={'/icons/boost/energy_boost.png'}
              style={{
                width: '28px',
                height: '28px',
              }}
            />
            <small
              style={{ color: '#AFAFAF', fontWeight: 500, pointerEvents: 'none' }}
            >
              <span style={{ fontSize: '18px', color: '#F7F8FC' }}>{energy}</span>/
              {maxEnergy}
            </small>
          </Box>
          <Button
            sx={{
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 'bold',
              background: 'rgba(175, 175, 175, 0)',
            }}
            endIcon={<KeyboardArrowRightIcon />}
            onClick={() => toggleDrawer(true)}
          >
            <img
              height={30}
              src={`/images/levels/${levelTitles[level].toLowerCase()}.png`}
            />
            {currentLevel && currentLevel.title?.[currLng]}
          </Button>
        </Box>
        <BorderLinearProgress
          variant="determinate"
          value={Math.round((energy / maxEnergy) * 100)}
        />
      </Box>
      <br />

      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
        swipeAreaWidth={0}
        disableSwipeToOpen
        ModalProps={{
          keepMounted: false,
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
            marginLeft: 'auto',
            position: 'absolute',
            right: 10,
          }}
        >
          <CloseIcon sx={{ color: '#fff' }} />
        </IconButton>

        <SwipeableTextMobileStepper
          levels={levelsInfo}
          taps={tapsCount}
          currentLevel={currentLevel}
        />
      </SwipeableDrawer>
    </Box>
  )
}

export default GamePage
