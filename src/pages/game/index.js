import Boosts from '@/components/BoostsPage'
import Catalogue from '@/components/CataloguePage'
import Extra from '@/components/ExtraPage'
import Game from '@/components/GamePage'
import Refs from '@/components/RefsPage'
import RoadMap from '@/components/RoadmapPage'
import Spinner from '@/components/Spinner'
import Stats from '@/components/StatsPage'
import Tasks from '@/components/TaskPage'
import { getHeaders } from '@/helpers/utils'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, ClickAwayListener, Grid, IconButton } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Tab from '@mui/material/Tab'
import { useTheme } from '@mui/material/styles'
import getConfig from 'next/config'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

const NAVIGATION_ITEMS = [
  { ref: 1 },
  { task: 2 },
  { tap: 3 },
  { boost: 5 },
  { game: 4 },
  { swap: 7 },
  { stats: 6 },
  { leaderboard: 8 },
  { roadmap: 9 },
]

const Layout = dynamic(() => import('@/components/LayoutWebapp'), {
  loading: () => <Spinner />,
  ssr: false,
})

const { publicRuntimeConfig } = getConfig()
const { apiUrl, isLocal } = publicRuntimeConfig

const Navigation = ({ activeTab, handleChange }) => {
  const [showMore, setShowMore] = useState(false)
  const intl = useIntl()

  useEffect(() => {
    setShowMore(false)
  }, [activeTab])

  const getStyle = (val, ind) => {
    return {
      width: '100%',
      minWidth: '66px',
      minHeight: '77px',
      background: '#1F1F1F',
      color: '#BFC1CA',
      opacity: 1,
      fontSize: 12,
      fontWeight: 400,
      textTransform: 'none',
      padding: '5px 0',
      borderRadius: '10px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      ...(activeTab === val && {
        color: '#BFC1CA',
        background: '#1F1F1F',
        backgroundImage:
          'linear-gradient(118.24deg, rgba(130, 108, 65, 0.3) 18.88%, rgba(253, 253, 186, 0.3) 40.48%, rgba(130, 108, 65, 0.3) 70.31%)',
        border: '1px solid rgba(130, 108, 65, 1)',
      }),
    }
  }

  const getStyleMoreBtn = (open) => {
    return {
      width: '100%',
      minWidth: '66px',
      minHeight: '77px',
      background: '#1F1F1F',
      color: '#BFC1CA',
      opacity: 1,
      fontSize: 12,
      fontWeight: 400,
      textTransform: 'none',
      padding: '5px 0',
      borderRadius: '10px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      ...(open && {
        color: '#BFC1CA',
        background: '#1F1F1F',
        backgroundImage:
          'linear-gradient(118.24deg, rgba(130, 108, 65, 0.3) 18.88%, rgba(253, 253, 186, 0.3) 40.48%, rgba(130, 108, 65, 0.3) 70.31%)',
        border: '1px solid rgba(130, 108, 65, 1)',
      }),
    }
  }

  return (
    <TabList
      onChange={(event, newValue) => {
        handleChange(event, newValue)
      }}
      aria-label="tabs"
      sx={{
        paddingInline: '10px',
        '& .MuiTabs-indicator': {
          display: 'none',
        },
      }}
    >
      <ClickAwayListener onClickAway={() => setShowMore(false)}>
        <Grid
          container
          spacing={1 / 2}
          wrap="wrap-reverse"
          justifyContent="flex-end"
          sx={{ width: '100%' }}
        >
          {NAVIGATION_ITEMS.map((item, ind, arr) => {
            const [[key, value]] = Object.entries(item)
            return (
              <Grid
                item
                xs={12 / 5}
                sm={12 / arr.length}
                key={key}
                order={ind + 1}
                sx={{
                  display: {
                    xs: ind > 3 && !showMore ? 'none' : 'block',
                    sm: 'block',
                  },
                }}
              >
                <Tab
                  onClick={(e) => {
                    handleChange(e, value.toString())
                  }}
                  label={intl.formatMessage({ id: `nav.${key}` })}
                  icon={
                    <img
                      src={`/icons/tabs/${key}.png`}
                      width={'30px'}
                      height={'30px'}
                      alt={key}
                    />
                  }
                  value={value.toString()}
                  sx={getStyle(value.toString(), ind)}
                />
              </Grid>
            )
          })}

          <Grid
            item
            xs={12 / 5}
            sx={{ display: { xs: 'block', sm: 'none' } }}
            order={4}
          >
            <IconButton
              id="fade-button"
              aria-controls={showMore ? 'fade-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={showMore ? 'true' : undefined}
              onClick={() => {
                setShowMore((prev) => !prev)
              }}
              sx={getStyleMoreBtn(showMore)}
            >
              {showMore ? (
                <img
                  src="/icons/tabs/close.png"
                  width={16}
                  height={16}
                  alt="Boost"
                />
              ) : (
                <img
                  src="/icons/tabs/open.png"
                  width={16}
                  height={16}
                  alt="Boost"
                />
              )}
            </IconButton>
          </Grid>
        </Grid>
      </ClickAwayListener>
    </TabList>
  )
}

const GamePage = (props) => {
  const theme = useTheme()
  const [activeTab, setActiveTab] = useState('1')
  const [cBalance, setCBalance] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [boosts, setBoosts] = useState([])
  const [daily, setDaily] = useState({})
  const [list, setList] = useState(false)
  const [special, setSpecial] = useState(false)
  const [allTasks, setAllTasks] = useState([])
  const [balances, setBalances] = useState(false)

  const handleChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const preloadTasks = async () => {
    const u = window.localStorage.getItem('chat_id') || false
    if (!u) return false

    let url = `/api/get-tasks/?id=${u}`
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

    data.forEach((task) => {
      if (task.type === 'daily_reward') {
        task.order = 1
      } else if (task.status === 'done') {
        task.order = 9
      } else {
        task.order = 2
      }
      if (!task.active) task.status = 'soon'
    })
    const withoutAgeOfAccount = data.filter(
      (item) => item.type !== 'age_of_account',
    )
    const m = _.orderBy(withoutAgeOfAccount, ['order'], ['asc'])
    setAllTasks(m)
  }

  const preloadGames = async () => {
    const response = await fetch(`/api/catalogue-games/`, {
      method: 'GET',
      headers: getHeaders(),
    })

    if (!response.ok) {
      return false
    }
    const data = await response.json()
    if (data.error) {
      return
    }
    const m = data.filter((item) => item.special === true)
    setList(data)
    setSpecial(m)
  }

  const reloadBoosts = async () => {
    const u = window.localStorage.getItem('chat_id') || false
    if (!u) return false

    let url = `/api/get-boosts/?id=${u}`

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
    setBoosts(data.purchasable)
    setCBalance(data.available_points)
  }

  const preloadBalance = async () => {
    const u = window.localStorage.getItem('chat_id') || false
    if (!u) return false

    const response = await fetch(`/api/get-points/?id=${u}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) {
      return false
    }

    const answer = await response.json()
    if (answer && answer.points) {
      setCBalance(answer.points)
      setBalances(answer.balances)
      window.localStorage.setItem('spent_points', answer.spent_points || 0)
      window.localStorage.setItem('total_points', answer.total_points || 0)
      window.localStorage.setItem('my_taps', answer.taps)
    }
  }

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.expand()
      window.Telegram.WebApp.disableVerticalSwipes()
      window.Telegram.WebApp.ready()
    }

    const a = localStorage.getItem('activeStep') || false
    if (a && a == '3') setActiveTab('7') // restore links swap page since last visit

    checkUserData()

    window.toggleTab = (val) => {
      setActiveTab(val)
    }
  }, [])

  const claimLootbox = async (lootboxId) => {
    console.log('called claim lootbox', lootboxId)
    const u = window.localStorage.getItem('chat_id') || false
    if (!u) return false

    const response = await fetch(
      `/api/open-lootbox/?id=${u}&box_id=${lootboxId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
    )

    if (!response.ok) {
      return false
    }

    const answer = await response.json()
    if (answer && !answer.error && answer.result) {
      console.log('GOT', answer)
      window.localStorage.setItem(
        'lootbox_reward',
        JSON.stringify(answer.result.reward),
      )
    }
  }

  const checkUserData = async () => {
    const usr = window.Telegram.WebApp.initDataUnsafe.user || {}
    const refParam = window.Telegram.WebApp.initDataUnsafe.start_param || false
    const preselectedLanguage = usr.language_code || 'en'

    let lootbox = false

    // if no userdata from webApp
    if (!isLocal) {
      if (!usr.id) {
        localStorage.setItem('language', preselectedLanguage)
        setTimeout(() => {
          window.location = '/no-access'
        }, 700)
        return false
      } else {
        window.localStorage.setItem('chat_id', usr.id)
      }
    }

    if (refParam && refParam.length > 1) {
      const a = refParam.split('_')
      usr.referrer = a[0].slice(1)
      if (a[1] && a[1].length > 1) {
        if (a[1].includes('lootbox')) {
          lootbox = a[1].replace('lootbox', '')
        } else {
          usr.utm_source = a[1].slice(1)
        }
      }
    }

    const response = await fetch(`/api/check-user/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usr),
    })

    // failed to get user info
    if (!response.ok && !isLocal) {
      localStorage.setItem('language', preselectedLanguage)
      setTimeout(() => {
        window.location = '/no-access'
      }, 700)
      return false
    }

    const answer = await response.json()

    // if user has no referral and no ref param is provided
    if (!answer.referrer && !isLocal) {
      localStorage.setItem('language', preselectedLanguage)
      setTimeout(() => {
        window.location = '/no-access'
      }, 700)
      return false
    }

    const platform = window.Telegram.WebApp.platform || 'unknown'
    if (!isLocal && platform != 'ios' && platform != 'android') {
      // window.location = `/no-desktop?ref=${answer.referrer}`
      // return false
    }

    if (answer.language_code) {
      const defaultLang = window.localStorage.getItem('language') || false
      // if no language selected (new user) - get language from telegram and activate it
      if (!defaultLang) {
        window.toggleLanguage(answer.language_code)
      }
    }

    // check account age task...
    if (answer && answer.tasks) {
      answer.tasks.forEach((i) => {
        if (i.account_age > 0 && !i.claimed) {        
          window.location = `/tg-age/?reward=${i.reward}&age=${i.account_age}&task_id=${i._id}`
          return true
        }
      })      
    }

    if (lootbox) {
      claimLootbox(lootbox)
    }

    reloadBoosts()
    preloadBalance()
    preloadGames()
    preloadTasks()

    setTimeout(() => setLoaded(true), 4000)
  }

  const updates = (newDaily, newBoosts) => {
    setDaily(daily)
    setBoosts(newBoosts)
  }

  const saveProgress = async (tgUserId, taps, tappingStartedDate) => {
    if (!tgUserId || !taps) return false

    const response = await fetch(`/api/save-points/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: tgUserId, taps, tappingStartedDate }),
    })

    if (!response.ok) {
      console.log('FAILED TO SAVE points', { taps })
      return false
    }

    const answer = await response.json()
    console.log('saved', answer, new Date())
    return answer
  }

  useEffect(() => {
    const chatId = localStorage.getItem('chat_id')
    const tappingStartedDate = localStorage.getItem('tappingStartedDate')
    const taps = localStorage.getItem('taps')
    if (taps > 0) {
      saveProgress(chatId, taps, tappingStartedDate)
      localStorage.setItem('taps', 0)
      localStorage.setItem('tappingStartedDate', '')
    }
  }, [])

  return (
    <Layout>
      <TabContext value={activeTab}>
        {loaded && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& > div': { width: '100%' },
            }}
          >
            <TabPanel value="1" sx={{ padding: '15px 10px' }}>
              <Refs updateBalance={preloadBalance} />
            </TabPanel>
            <TabPanel value="2" sx={{ padding: '15px 10px' }}>
              <Tasks
                balance={cBalance}
                updateBalance={preloadBalance}
                updateTasks={preloadTasks}
                list={allTasks}
                balancesTonUsdt={balances}
              />
            </TabPanel>
            <TabPanel value="3" sx={{ px: 0 }}>
              <Game
                saveProgress={saveProgress}
                cachedBalance={cBalance}
                update={setCBalance}
              />
            </TabPanel>
            <TabPanel value="4" sx={{ padding: '15px 10px' }}>
              <Catalogue balance={cBalance} list={list} special={special} />
            </TabPanel>
            <TabPanel value="5" sx={{ padding: '15px 10px' }}>
              <Boosts
                balance={cBalance}
                update={setCBalance}
                initialBoosts={boosts}
                initialDaily={daily}
                updateData={reloadBoosts}
                balancesTonUsdt={balances}
                updateBalance={preloadBalance}
              />
            </TabPanel>
            <TabPanel value="6" sx={{ padding: '15px 10px' }}>
              <Stats stat={props.stat} activeTab={'total'} />
            </TabPanel>
            <TabPanel value="7" sx={{ padding: '15px 10px' }}>
              <Extra />
            </TabPanel>
            <TabPanel value="8" sx={{ padding: '15px 10px' }}>
              <Stats stat={props.stat} activeTab={'leaderboard'} />
            </TabPanel>
            <TabPanel value="9" sx={{ padding: '15px 10px' }}>
              <RoadMap />
            </TabPanel>
          </Box>
        )}

        {!loaded && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '20px',
            }}
          >
            <Box>
              <CircularProgress size="0.7rem" />
              <span style={{ marginLeft: '15px' }}>Loading...</span>
            </Box>

            <RoadMap />
          </Box>
        )}

        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            pb: 1,
            paddingTop: '15px',
            width: '100%',
            background:
              'linear-gradient(180deg, rgba(23, 23, 23, 0) 0%, rgba(23, 23, 23, 1) 18%)',
          }}
        >
          {loaded && (
            <Navigation activeTab={activeTab} handleChange={handleChange} />
          )}
        </Box>
      </TabContext>
    </Layout>
  )
}

export default GamePage
