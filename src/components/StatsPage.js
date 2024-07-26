import DecorationBg from '@/components/DecorationBg'
import { formatCurrencySmart, formatInt } from '@/helpers/formatter'
import { getHeaders } from '@/helpers/utils'
import { useSnackbar } from '@/providers/SnackbarProvider'
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import fetch from 'isomorphic-unfetch'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import CoinRewardDisplay from './CoinRewardDisplay'

const StyledImg = styled('img')(({}) => ({}))

const Item = ({ data, order }) => {
  const router = useRouter()
  const { id } = router.query
  const chatId = window.localStorage.getItem('chat_id') || id

  const displayName = useMemo(() => {
    const { first_name, last_name, username } = data

    if (data?.first_name) {
      if (last_name) {
        return `${first_name} ${last_name.charAt(0)}.`
      } else {
        return first_name
      }
    } else if (data?.username) {
      return username
    } else {
      return '-'
    }
  }, [data])

  return (
    <>
      <ListItem
        disablePadding
        sx={
          chatId == data.id
            ? {
                color: '#BFC1CA',
                background: '#1F1F1F',
                backgroundImage:
                  'linear-gradient(118.24deg, rgba(130, 108, 65, 0.3) 18.88%, rgba(253, 253, 186, 0.3) 40.48%, rgba(130, 108, 65, 0.3) 70.31%)',
                border: '1px solid rgba(130, 108, 65, 1)',
              }
            : null
        }
      >
        <ListItemButton
          dense
          disableRipple
          sx={{
            padding: '10px 12px',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <Box
            sx={{
              minWidth: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px',
            }}
          >
            {order > 2 ? (
              <Typography
                sx={{
                  fontSize: 12,
                  lineHeight: 1,
                  fontWeight: 500,
                  textAlign: 'center',
                }}
              >
                {order > 49 ? '...' : order + 1}
              </Typography>
            ) : (
              <img
                width={26}
                height={30}
                src={`/icons/leaderboard/${order}.png`}
              />
            )}
          </Box>

          <ListItemAvatar
            sx={{
              borderRadius: '10px',
              minWidth: 'initial',
              marginRight: '10px',
            }}
          >
            {/* <Avatar si /> */}
            {/* <img
              width="40"
              height="40"
              src="/icons/leaderboard/user-avatar.png"
              style={{
                borderRadius: '10px',
              }}
            /> */}
          </ListItemAvatar>
          <Stack sx={{ flex: 1, overflow: 'hidden' }}>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    margin: 0,
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    paddingRight: 1,

                    fontWeight: 500,
                    lineHeight: '22px',
                    color: '#fff',
                  }}
                >
                  {displayName}
                </Typography>
              }
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
              primary={
                <>
                  <Typography
                    sx={{
                      margin: 0,
                      whiteSpace: 'nowrap',
                      fontSize: '12px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      paddingRight: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '11px',
                      color: '#AFAFAF',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: '#AFAFAF',
                      }}
                    >
                      <FormattedMessage id="refs.total" />
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <img
                        width={12}
                        style={{ flexShrink: 0 }}
                        src="/icons/leaderboard/members.png"
                      />
                      {data.referrals_count ?? 0}
                    </Typography>
                  </Typography>
                </>
              }
            />
          </Stack>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <StyledImg
              src={'/images/btc-mini.png'}
              sx={{
                width: 20,
              }}
            />
            <Typography
              display="inline-flex"
              align="center"
              whiteSpace="nowrap"
              sx={{
                fontSize: 18,
                color: '#FDE0B4',
              }}
              component="span"
            >
              {formatCurrencySmart(data.points)}
            </Typography>
          </Box>
        </ListItemButton>
      </ListItem>

      {order !== data?.length - 1 && (
        <Divider
          sx={{
            width: '95%',
            margin: '0 auto',
          }}
        />
      )}
    </>
  )
}

const LeaderboardPage = (props) => {
  const intl = useIntl()
  const [list, setList] = useState([])
  const [activeTab, setActiveTab] = useState('')
  const [spent, setSpent] = useState(0)
  const [earned, setEarned] = useState(0)
  const [taps, setTaps] = useState(0)
  const [debugData, setDebugData] = useState(0)
  const { snackbar } = useSnackbar()
  const [leaderboardTab, setLeaderboardTab] = useState('point')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getLeaderboard()
    const c = window.localStorage.getItem('spent_points') || 0
    if (c > 0) setSpent(c)

    const e = window.localStorage.getItem('total_points') || 0
    if (e > 0) setEarned(e)

    const k = window.localStorage.getItem('my_taps') || 0
    if (k > 0) setTaps(k)

    if (window.Telegram && window.Telegram.WebApp) {
      const dd = window.Telegram.WebApp.initDataUnsafe || 'woops'
      setDebugData(JSON.stringify(dd))
    }
  }, [leaderboardTab])

  const getLeaderboard = async () => {
    setLoading(true)
    const chatId = window.localStorage.getItem('chat_id')

    let url = `/api/leaderboard/?user_id=${chatId}`
    url +=
      leaderboardTab === 'point' ? '&sort=-points' : '&sort=-referrals_count'
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    })

    if (!response.ok) {
      snackbar('Failed to get leaderboard', true)
      setLoading(false)
      return false
    }

    const data = await response.json()
    if (data.error) {
      snackbar('Failed to get leaderboard', true)
      setLoading(false)
      return
    }

    setList(data)
    setLoading(false)
  }

  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      flexDirection={'column'}
      sx={{
        marginBottom: 3,
        touchAction: 'pan-y',
      }}
    >
      <DecorationBg />
      <Card
        elevation={0}
        sx={{
          width: '100%',
          overflow: 'auto',
          backgroundColor: 'transparent',
          paddingBottom: 8,
        }}
      >
        {props.activeTab === 'total' ? (
          <>
            <Typography
              sx={{
                mb: 1,
                color: '#FFFFFF',
                fontFamily: 'Roboto',
                fontSize: '26px',
                fontWeight: 400,
                lineHeight: '38px',
                textAlign: 'center',
              }}
            >
              <FormattedMessage id={`leaderboard.total`} />
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

            <Box
              display={'flex'}
              alignItems={'center'}
              flexDirection={'column'}
            >
              <Box mb={4} display={'flex'} alignItems={'center'}>
                <CoinRewardDisplay
                  amount={props?.stat?.total_points}
                  coinsTextSx={{
                    ml: 0.5,
                    fontSize: 35,
                    fontWeight: 500,
                    lineHeight: '47px',
                    textAlign: 'center',
                  }}
                  coinSx={{
                    width: 35,
                  }}
                />
              </Box>

              <Box mb={2}>
                <Typography
                  sx={{
                    fontSize: '24px',
                    fontWeight: 500,
                    lineHeight: '24px',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                  >
                    <FormattedMessage id="stats.players" />
                  </span>{' '}
                  <br />
                  {formatInt(props?.stat?.total_players)}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography
                  sx={{
                    fontSize: '24px',
                    fontWeight: 500,
                    lineHeight: '24px',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                  >
                    <FormattedMessage id="stats.new_players" />
                  </span>{' '}
                  <br />+{formatInt(props?.stat?.new_players_today)}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography
                  sx={{
                    fontSize: '24px',
                    fontWeight: 500,
                    lineHeight: '24px',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                  >
                    <FormattedMessage id="stats.players_today" />
                  </span>{' '}
                  <br />
                  {formatInt(props?.stat?.count_dau_1_day)}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography
                  sx={{
                    fontSize: '24px',
                    fontWeight: 500,
                    lineHeight: '24px',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                  >
                    <FormattedMessage id="stats.players_3days" />
                  </span>{' '}
                  <br />
                  {formatInt(props?.stat?.count_dau_3_day)}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography
                  sx={{
                    fontSize: '24px',
                    fontWeight: 500,
                    lineHeight: '24px',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                  >
                    <FormattedMessage id="stats.total_points" />
                  </span>{' '}
                  <br />
                  {formatInt(earned)}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography
                  sx={{
                    fontSize: '24px',
                    fontWeight: 500,
                    lineHeight: '24px',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                  >
                    <FormattedMessage id="stats.total_spent" />
                  </span>{' '}
                  <br />
                  {formatInt(spent)}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography
                  sx={{
                    fontSize: '24px',
                    fontWeight: 500,
                    lineHeight: '24px',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                  >
                    <FormattedMessage id="stats.total_taps" />
                  </span>{' '}
                  <br />
                  {formatInt(props?.stat?.total_taps)}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography
                  sx={{
                    fontSize: '24px',
                    fontWeight: 500,
                    lineHeight: '24px',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                  >
                    <FormattedMessage id="stats.total_my_taps" />
                  </span>{' '}
                  <br />
                  {formatInt(taps)}
                </Typography>
              </Box>
              {false && debugData && <Box mb={4}>{debugData}</Box>}
            </Box>
          </>
        ) : (
          <>
            <Typography
              sx={{
                mb: 1,
                color: '#FFFFFF',
                fontFamily: 'Roboto',
                fontSize: '26px',
                fontWeight: 400,
                lineHeight: '38px',
                textAlign: 'center',
              }}
            >
              <FormattedMessage id={`leaderboard.leaderboard`} />
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 3,
                background: '#171717',
              }}
            >
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
                {['point', 'referral'].map((tab) => {
                  return (
                    <Button
                      onClick={() => {
                        setLeaderboardTab(tab)
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
                          leaderboardTab === tab ? '#1F1F1F' : 'transparent',
                        '&:hover': {
                          border: 'none',
                          background: '#1F1F1F',
                        },
                        '&:active': {
                          background: 'initial',
                          border: 'none',
                        },
                      }}
                    >
                      <FormattedMessage id={`leaderboard.tab.${tab}`} />
                    </Button>
                  )
                })}
              </ButtonGroup>
            </Box>

            {loading ? (
              <Box
                display={'flex'}
                alignItems={'center'}
                flexDirection={'column'}
                sx={{
                  color: '#FFD700',
                  marginTop: '30vh',
                }}
              >
                <CircularProgress color="inherit" />
              </Box>
            ) : (
              <List
                sx={{
                  width: '100%',
                }}
              >
                {list.map((item, ind) => {
                  return <Item key={item.id} order={ind} data={item} />
                })}
              </List>
            )}
          </>
        )}
      </Card>
    </Box>
  )
}

export default LeaderboardPage
