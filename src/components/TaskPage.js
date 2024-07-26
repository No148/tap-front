import AddProjectContent from '@/components/AddProjectContent'
import Balance from '@/components/BalancesTonUsdt'
import DecorationBg from '@/components/DecorationBg'
import { formatCurrencySmart } from '@/helpers/formatter'
import { getHeaders } from '@/helpers/utils'
import useIsTouchDevice from '@/hooks/useIsTouchDevice'
import { useSnackbar } from '@/providers/SnackbarProvider'
import CloseIcon from '@mui/icons-material/Close'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  SwipeableDrawer,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress'
import { styled, useTheme } from '@mui/material/styles'
import fetch from 'isomorphic-unfetch'
import _ from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import CoinRewardDisplay from './CoinRewardDisplay'
import DailyRewardsDrawer from './modals/DailyRewardsDrawer'

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  width: '90%',
  height: 20,
  marginTop: '5px',
  borderRadius: 10,
  border: '1px solid rgba(217, 217, 217, 0.3)',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: 'black',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 10,
    background:
      'linear-gradient(90deg, #000000 0%, #CD4339 43.05%, #EF984D 76.98%, #F8DE53 93.06%);\n',
  },
}))

const drawerBleeding = 0

const TaskAction = ({ handler, data }) => {
  if (!data || !data.status) return <></> // just skip

  if (data.status === 'done') {
    return (
      <Box display="flex" alignItems="center" gap="10px">
        <DoneAllIcon color="success" /> <FormattedMessage id="tasks.finished" />
      </Box>
    )
  }

  return (
    <Button
      disabled={data.status === 'processing'}
      onClick={handler}
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
        textTransform: 'unset',
        border: '1px solid #fff',
        '&:hover': {
          backgroundColor: 'rgba(193, 168, 117, 1)',
        },
      }}
    >
      {data.status === 'claimable' ? (
        <FormattedMessage id="tasks.claim" />
      ) : data.status === 'processing' ? (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <CircularProgress size={25} />{' '}
          <FormattedMessage id="tasks.checking" />
        </Box>
      ) : (
        <FormattedMessage id="tasks.start" />
      )}
    </Button>
  )
}

const TaskItem = ({ data, handleSelect, handleClaim }) => {
  const getTitle = (val) => {
    const l = window.localStorage.getItem('language') || 'en'
    if (!val) return 'no title'
    return val[l]
  }

  const task = useMemo(() => {
    if (data.type === 'daily_reward') {
      const dailyRewards = Object.values(data?.daily_rewards ?? {})
      const maxDays = dailyRewards.length

      let reward = 0
      let totalReward = 0
      dailyRewards.forEach((r, i) => {
        if (data.progress > i) {
          reward = r
        }
        totalReward += r
      })

      return {
        ...data,
        progress: (data.progress / maxDays) * 100,
        reward: reward,
        totalReward,
        status: data.status === 'claimable' ? 'processing' : 'todo',
      }
    }

    return data
  }, [data])

  const taskShowStatus = (t) => {
    if (t === 'ref' || t === 'league') return false
    if (t == 'daily_reward') return false

    return true
  }

  return (
    <Button
      onClick={() => {
        handleSelect?.(task)
      }}
      disabled={!data.active}
      key={task._id}
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
        justifyContent: 'flex-start',
        opacity: data.status === 'done' ? 0.5 : data.active ? 1 : 0.5,
        '&:hover': {
          bgcolor: 'background.card',
        },
      }}
      disableRipple
    >
      <Stack
        sx={{
          flexDirection: 'row',
          width: '100%',
          flex: 1,
          gap: 1,
          alignItems: 'center',
        }}
      >
        <img
          width={40}
          src={
            task.type === 'league'
              ? `/images/levels/${task?.title?.en?.toLowerCase()}.png`
              : '/images/task-item.png'
          }
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '22px',
              color: '#fff',
              textAlign: 'left',
            }}
          >
            {getTitle(task.title)}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'nowrap',
                alignSelf: 'start',
                fontSize: 14,
                fontWeight: 400,
                lineHeight: 1,
                color: '#fff',
                width: '90px',
              }}
            >
              {task.type === 'league' ? (
                <Typography
                  display="inline-flex"
                  gap={1 / 2}
                  align="center"
                  fontSize="inherit"
                  fontWeight="inherit"
                  fontFamily="inherit"
                  whiteSpace="nowrap"
                  component="span"
                >
                  {formatCurrencySmart(task.reward)}
                  <span>
                    <FormattedMessage id="common.taps" />
                  </span>
                </Typography>
              ) : (
                <CoinRewardDisplay
                  amount={task.reward}
                  plus={task.type === 'daily_reward'}
                  totalAmount={
                    task.type === 'daily_reward' ? task.totalReward : ''
                  }
                  coinSx={{
                    width: 14,
                    height: 14,
                  }}
                />
              )}
            </Typography>
            {taskShowStatus(task.type) && (
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '22px',
                  color: '#fff',
                }}
              >
                <FormattedMessage id="tasks.status" />:{' '}
                <span
                  style={{
                    color: 'rgba(212, 188, 61, 1)',
                    textTransform: 'lowercase',
                    fontWeight: 500,
                  }}
                >
                  <FormattedMessage id={`tasks.${task.status}`} />
                </span>
              </Typography>
            )}
          </Box>
        </Box>

        {!task.active ? (
          <Box ml={'auto'} mr={2}>
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
        ) : task.claimed ? (
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1 / 2,
              padding: '6px 8px',
              position: 'relative',
              background: 'none',
              fontSize: 12,
              fontWeight: 400,
              color: '#FFFFFF',
              textTransform: 'unset',
              border: 0,
              marginLeft: 'auto',
            }}
          >
            <DoneAllIcon sx={{ fontSize: 18 }} />
            <FormattedMessage id="tasks.done" />
          </Typography>
        ) : (
          <Button
            disabled={task.status === 'todo'}
            onClick={handleClaim}
            sx={{
              position: 'relative',
              background: 'none',
              fontSize: 12,
              fontWeight: 400,
              color: '#FFFFFF',
              textTransform: 'unset',
              border: 0,
              marginLeft: 'auto',
              '&::before': {
                content: '""',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                position: 'absolute',
                borderRadius: 2.5,
                border: '1px solid transparent',
                background:
                  'linear-gradient(45deg, rgba(193, 168, 117, 1), rgba(255, 255, 255, 1), rgba(87, 98, 101, 1)) border-box',
                '-webkit-mask':
                  ' linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                '-webkit-mask-composite': 'destination-out',
                maskComposite: 'exclude',
              },
              '&:hover': {
                backgroundColor: 'unset',
              },
              '&.Mui-disabled': {
                opacity: 0.3,
              },
            }}
          >
            <FormattedMessage id="tasks.claim" />
          </Button>
        )}
      </Stack>

      {['league', 'ref', 'daily_reward'].includes(task.type) && (
        <Stack sx={{ width: '100%', marginTop: 1 }}>
          <BorderLinearProgress
            sx={{
              width: '100%',
            }}
            value={task.progress}
            variant="determinate"
          />
        </Stack>
      )}
    </Button>
  )
}

const TasksPage = (props) => {
  const theme = useTheme()
  const intl = useIntl()
  const isTouchDevice = useIsTouchDevice()
  const [tgUserId, setUserId] = useState(null)
  const [tasks, setTasks] = useState(props.list ?? [])
  const [selectedTask, setSelectedTask] = useState(null)
  const [open, setOpen] = useState(false)
  const [openInfo, setOpenInfo] = useState(false)
  const [activeTab, setActvieTab] = useState('social')
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const { snackbar } = useSnackbar()
  const [openAddProject, setOpenAddProject] = useState(false)
  const [addProjectTaskId, setAddProjectTaskId] = useState(null)
  const [toggleDrawerDailyReward, setToggleDrawerDailyReward] = useState(false)
  const [doneTasksDelimeter, setDoneTaskDelimeter] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [createError, setCreateError] = useState(false)
  const [input, setInput] = useState('')

  const handleToggleDrawerDailyReward = (toggleDrawerDailyReward) => {
    setToggleDrawerDailyReward(toggleDrawerDailyReward)
  }

  const toggleDrawer = (newOpen) => {
    if (!newOpen) {
      setSelectedTask(null)
      setInput('')
      setCreateError(false)
    }
    setOpen(newOpen)
  }

  const toggleDrawerInfo = (newOpen) => {
    setOpenInfo(newOpen)
  }

  const container =
    props.window !== undefined ? () => window().document.body : undefined

  useEffect(() => {
    const c = window.localStorage.getItem('chat_id') || false
    if (c) {
      setUserId(c)
    }
  }, [])

  useEffect(() => {
    if (tgUserId) props?.updateTasks()
  }, [tgUserId])

  useEffect(() => {
    setTasks(props.list ? props.list : [])
  }, [props.list])

  useEffect(() => {
    setDoneTaskDelimeter(false)
  }, [activeTab])

  useEffect(() => {
    if (selectedTask && tasks.length > 0) {
      setSelectedTask((prev) => tasks.find((i) => i._id === prev._id))
    }
  }, [tasks, selectedTask])

  useEffect(() => {
    if (selectedTask) {
      toggleDrawer(true)
    }
  }, [selectedTask])

  const getTasks = async () => {
    let url = `/api/get-tasks/?id=${tgUserId}`
    const response = await fetch(url, {
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

    data?.forEach((task) => {
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
    setTasks(m)
  }

  const takeTask = async (item, claim) => {
    const l = window.localStorage.getItem('language') || 'en'

    if (item.status === 'todo' && item.action) {
      window.open(item.action, '_blank')
    }

    const url = item.status === 'todo' ? '/api/take-task/' : '/api/claim-task/'

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: tgUserId,
        task_id: item._id,
        lang: l,
      }),
    })

    if (!response.ok) {
      snackbar(
        claim ? 'Failed to claim task' : 'Failed to update task status',
        true,
      )
      return false
    }

    const data = await response.json()
    if (data.error) {
      snackbar(
        claim ? 'Failed to claim task' : 'Failed to update task status',
        true,
      )
      return false
    }

    await props?.updateBalance()
    getTasks()
  }

  const addProjectTask = async (task_id, project_url) => {
    const response = await fetch('/api/take-task/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: tgUserId,
        task_id,
        project_url,
      }),
    })

    if (!response.ok) {
      snackbar('Failed to add project', true)
      setCreateError('Failed to add project')
      return false
    }

    const data = await response.json()
    if (data.error) {
      snackbar(data.error, true)
      setCreateError(data.error)
      return
    }

    snackbar('Project successfully added', false)
    setCreateError(false)
    toggleDrawer(false)
    await props?.updateBalance()
    getTasks()
  }

  const claimDailyRewardTask = async () => {
    const url = '/api/claim-daily-reward-task/'

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: tgUserId }),
    })

    if (!response.ok) {
      snackbar('Failed to claim daily reward task', true)
      return false
    }

    const data = await response.json()
    if (data.error) {
      snackbar('Failed to claim daily reward task', true)
      return false
    }

    props?.updateBalance()
    props?.updateTasks()
  }

  const handleClaim = (e, task) => {
    e.stopPropagation()
    if (task.type === 'daily_reward') {
      claimDailyRewardTask()
    } else {
      takeTask(task, true)
    }
  }

  const isNewSpecials = tasks
    .filter((i) => i.type === 'social')
    .some((el) => el.status === 'todo')

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

  const getTaskData = (data) => {
    const l = window.localStorage.getItem('language') || 'en'
    if (!data) return ''

    if (!data.action && data.action_data && data.action_data[l]) {
      if (data.lang) return data.action_data[data.lang].link

      return data.action_data[l].link
    }

    if (data.action) {
      return data.action
    }

    // if task has no action description
    return 'no details'
  }

  const currentTabTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (['league', 'ref'].includes(activeTab)) {
        if (task.type === activeTab) {
          acc.push(task)
        }
      } else if (!['league', 'ref'].includes(task.type)) {
        acc.push(task)
      }
      return acc
    }, [])
  }, [tasks, activeTab])

  const dailyReward = useMemo(
    () => currentTabTasks.find((v) => v.type === 'daily_reward') ?? null,
    [currentTabTasks],
  )

  const handleSelectTask = (task) => {
    if (task.type === 'social') {
      setSelectedTask(task)
    }

    if (task.type === 'daily_reward') {
      handleToggleDrawerDailyReward(true)
    }
  }

  const tabs = useMemo(
    () => [
      { name: 'social', label: 'tasks' },
      { name: 'league', label: 'league' },
      { name: 'ref', label: 'ref' },
    ],
    [],
  )

  if (openAddProject) {
    return (
      <AddProjectContent
        taskId={addProjectTaskId}
        onClose={() => {
          setOpenAddProject(false)
          setAddProjectTaskId(null)
        }}
        reloadTasks={getTasks}
      />
    )
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Roboto',
          fontSize: 35,
          fontWeight: 500,
          lineHeight: '47px',
          textAlign: 'left',
          mt: '24px',
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
        onClick={() => toggleDrawerInfo(true)}
        sx={{
          width: '100%',
          py: 1,
          px: 1,
          minWidth: 140, // 260,
          height: 48,
          fontSize: 14,
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
      >
        <FormattedMessage id="tasks.become_partner" />
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
                    ...(tab.name === 'social' &&
                      isNewSpecials && {
                        '&:before': {
                          content: '""',
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          display: 'block',
                          width: '8px',
                          height: '8px',
                          background: 'rgba(220, 42, 53, 1)',
                          borderRadius: '50%',
                        },
                      }),

                    '&:hover': {
                      border: 'none',
                      background: '#1F1F1F',
                    },
                  }}
                >
                  <FormattedMessage id={`tasks.${tab.label}`} />
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
          }}
        >
          {currentTabTasks.map((task, i) => {
            if (
              task.type !== 'daily_reward' &&
              task.status === 'done' &&
              !doneTasksDelimeter &&
              currentTabTasks[i - 1] &&
              currentTabTasks[i - 1].status !== 'done'
            ) {
              setDoneTaskDelimeter(task._id)
            }

            if (task.type === 'add_project') {
              return (
                <>
                  {task._id === doneTasksDelimeter && (
                    <Divider
                      sx={{
                        margin: '18px 6px',
                        fontSize: 12,
                        color: '#fff',
                      }}
                    >
                      <FormattedMessage id="common.doned" />
                    </Divider>
                  )}
                  <Button
                    onClick={() => {
                      if (
                        task.status === 'done' ||
                        (task.project &&
                          (task.project.is_valid ||
                            task.project.is_valid === null))
                      ) {
                        return
                      }
                      setSelectedTask(task)
                    }}
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
                      justifyContent: 'flex-start',
                      opacity:
                        task.status === 'done' ||
                        (task.project &&
                          (task.project.is_valid ||
                            task.project.is_valid === null))
                          ? 0.5
                          : 1,

                      '&:hover': {
                        bgcolor: 'background.card',
                      },
                    }}
                    disableRipple
                  >
                    <Stack
                      sx={{
                        flexDirection: 'row',
                        width: '100%',
                        flex: 1,
                        gap: 1,
                        alignItems: 'center',
                      }}
                    >
                      <img width={40} src="/images/task-item.png" />
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 500,
                            lineHeight: '22px',
                            color: '#fff',
                            textAlign: 'left',
                          }}
                        >
                          <FormattedMessage id="tasks.addProject" />
                        </Typography>

                        <Typography
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'nowrap',
                            alignSelf: 'start',
                            fontSize: 14,
                            fontWeight: 400,
                            lineHeight: 1,
                            color: '#fff',
                            width: '90px',
                          }}
                        >
                          <CoinRewardDisplay
                            amount={task.reward}
                            coinSx={{
                              width: 14,
                              height: 14,
                            }}
                          />
                        </Typography>

                        {task.project &&
                        task.project.is_valid !== null &&
                        !task.project.is_valid ? (
                          <>
                            <Typography
                              sx={{
                                fontSize: '14px',
                                fontWeight: 400,
                                lineHeight: '22px',
                                color: '#fff',
                              }}
                            >
                              <FormattedMessage id="tasks.status" />:{' '}
                              <span
                                style={{
                                  color: 'rgba(212, 188, 61, 1)',
                                  textTransform: 'lowercase',
                                  fontWeight: 500,
                                }}
                              >
                                <FormattedMessage id="common.rejectedUrl" />
                              </span>
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: 12,
                                textAlign: 'left',
                                lineHeight: 1.2,
                                color: 'rgba(212, 188, 61, 1)',
                              }}
                            >
                              <FormattedMessage id="common.anotherProject" />
                            </Typography>
                          </>
                        ) : (
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 400,
                              lineHeight: '22px',
                              color: '#fff',
                            }}
                          >
                            <FormattedMessage id="tasks.status" />:{' '}
                            <span
                              style={{
                                color: 'rgba(212, 188, 61, 1)',
                                textTransform: 'lowercase',
                                fontWeight: 500,
                              }}
                            >
                              <FormattedMessage id={`tasks.${task.status}`} />
                            </span>
                          </Typography>
                        )}
                      </Box>

                      {task.status === 'todo' ||
                      task.status === 'processing' ? (
                        <Box ml={'auto'} mr={2}>
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
                      ) : task.claimed ? (
                        <Typography
                          sx={{
                            padding: '6px 8px',
                            position: 'relative',
                            background: 'none',
                            fontSize: 12,
                            fontWeight: 400,
                            color: '#FFFFFF',
                            textTransform: 'unset',
                            border: 0,
                            marginLeft: 'auto',
                            '&::before': {
                              content: '""',
                              top: 0,
                              bottom: 0,
                              left: 0,
                              right: 0,
                              position: 'absolute',
                              borderRadius: 2.5,
                              border: '1px solid transparent',
                              background:
                                'linear-gradient(45deg, rgba(193, 168, 117, 1), rgba(255, 255, 255, 1), rgba(87, 98, 101, 1)) border-box',
                              '-webkit-mask':
                                ' linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                              mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                              '-webkit-mask-composite': 'destination-out',
                              maskComposite: 'exclude',
                            },
                          }}
                        >
                          <FormattedMessage id="tasks.done" />
                        </Typography>
                      ) : (
                        <Button
                          onClick={(e) => handleClaim(e, task)}
                          sx={{
                            position: 'relative',
                            background: 'none',
                            fontSize: 12,
                            fontWeight: 400,
                            color: '#FFFFFF',
                            textTransform: 'unset',
                            border: 0,
                            marginLeft: 'auto',
                            '&::before': {
                              content: '""',
                              top: 0,
                              bottom: 0,
                              left: 0,
                              right: 0,
                              position: 'absolute',
                              borderRadius: 2.5,
                              border: '1px solid transparent',
                              background:
                                'linear-gradient(45deg, rgba(193, 168, 117, 1), rgba(255, 255, 255, 1), rgba(87, 98, 101, 1)) border-box',
                              '-webkit-mask':
                                ' linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                              mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                              '-webkit-mask-composite': 'destination-out',
                              maskComposite: 'exclude',
                            },
                            '&:hover': {
                              backgroundColor: 'unset',
                            },
                            '&.Mui-disabled': {
                              opacity: 0.3,
                            },
                          }}
                        >
                          <FormattedMessage id="tasks.claim" />
                        </Button>
                      )}
                    </Stack>
                  </Button>
                </>
              )
            }

            return (
              <>
                {task._id === doneTasksDelimeter && (
                  <Divider
                    sx={{
                      fontSize: 12,
                      color: '#8F8F8F',
                      margin: '18px 6px',
                      fontSize: 12,
                      color: '#fff',
                    }}
                  >
                    <FormattedMessage id="common.doned" />
                  </Divider>
                )}
                <TaskItem
                  key={task._id}
                  data={task}
                  handleSelect={handleSelectTask}
                  handleClaim={(e) => handleClaim(e, task)}
                />
              </>
            )
          })}
        </Box>
      </Card>

      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={openInfo}
        onClose={() => toggleDrawerInfo(false)}
        onOpen={() => toggleDrawerInfo(true)}
        swipeAreaWidth={drawerBleeding}
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
          onClick={() => toggleDrawerInfo(false)}
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
            flexGrow: 1,
            height: '264px',
            padding: '30px 20px',
            paddingBottom: '40px',
            backgroundColor: '#171717',
            backgroundImage: 'url(/images/decor-light.png)',
            backgroundPositionY: '50px',
            backgroundPositionX: 'right',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 600,
              marginTop: 2,
            }}
          >
            <FormattedMessage id="tasks.become_partner_1" />
          </Typography>

          <Button
            target="_blank"
            href={intl.formatMessage({ id: 'tasks.partner_url' })}
            sx={{
              mt: '48px',
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
              textTransform: 'unset',
              border: '1px solid #fff',
              '&:hover': {
                backgroundColor: 'rgba(193, 168, 117, 1)',
              },
            }}
          >
            <FormattedMessage id="tasks.get_more_info" />
          </Button>
        </Box>
      </SwipeableDrawer>

      <SwipeableDrawer
        container={container}
        anchor={isInputFocused && isTouchDevice ? 'top' : 'bottom'}
        open={open}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen
        ModalProps={{
          keepMounted: true,
          sx: {
            zIndex: 9999999,
          },
        }}
        PaperProps={{
          sx: {
            background: '#171717',
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

        <Box
          sx={{
            zIndex: 1,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 2,
            pt: 4,
            mb: 0,
            minHeight: '250px',
            maxHeight: isSmallScreen ? 'auto' : '80vh',
            backgroundColor: '#171717',
            color: '#fff',
            '&::after': {
              content: '""',
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
          {selectedTask?.type === 'add_project' ? (
            <Paper
              square
              elevation={0}
              sx={{
                marginTop: 2,
                width: '100%',
                background: '#1F1F1F',
                border: '1px solid #383D4A',
                padding: '10px 20px',
                borderRadius: '16px',
              }}
            >
              <Typography
                sx={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  marginBottom: 1,
                }}
              >
                <FormattedMessage id="tasks.addProjectText" />
              </Typography>
              <Typography
                sx={{
                  fontSize: '12px',
                  color: '#FDE0B4',
                  lineHeight: 1.2,
                }}
              >
                <FormattedMessage id={`tasks.addProjectText2`} />
              </Typography>
            </Paper>
          ) : (
            <>
              <Typography
                sx={{ textAlign: 'center', fontSize: 24, fontWeight: 600 }}
              >
                {getTitle(selectedTask?.title)}
              </Typography>
              <Typography
                sx={{
                  padding: '4px 12px',
                  color: '#AFAFAF',
                  fontSize: 14,
                  fontWeight: 400,
                  textAlign: 'center',
                }}
              >
                {getDescription(selectedTask?.description)}
              </Typography>
            </>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
            <CoinRewardDisplay
              amount={selectedTask?.reward}
              coinsTextSx={{
                fontSize: 26,
                fontWeight: 600,
                color: '#FDE0B4',
              }}
              coinSx={{
                width: 26,
              }}
            />
          </Box>
          <Typography
            sx={{
              marginBottom: 3,
              fontSize: 14,
              color: '#AFAFAF',
            }}
          >
            <FormattedMessage id="tasks.rewards" />
          </Typography>

          {selectedTask?.type === 'add_project' ? (
            <TextField
              onBlur={(e) => {
                setIsInputFocused(false)
              }}
              onFocus={(e) => {
                setIsInputFocused(true)
              }}
              error={createError}
              helperText={
                createError ? (
                  <Typography sx={{ fontSize: 12, marginBottom: 3 }}>
                    {createError}
                  </Typography>
                ) : null
              }
              InputProps={{
                sx: {
                  height: '48px',
                  display: 'flex',
                  width: '100%',
                  marginBottom: createError ? 0 : 3,
                  alignItems: 'center',
                  borderRadius: 4,
                  background: '#1F1F1F',
                  border: '1px solid #383D4A',
                  paddingInline: '7px',
                  '& .MuiInputBase-root': {
                    height: '48px',
                    borderRadius: '16px',
                    color: '#FDE0B4',
                  },
                },
              }}
              size="small"
              placeholder={`t.me/zzz.bot or https://t.me/zzz.bot`}
              fullWidth
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
              }}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                marginBottom: '18px',
                alignItems: 'center',
                padding: '15px',
                height: '48px',
                background: '#201F1C',
                borderRadius: 4,
              }}
            >
              <Typography
                sx={{
                  flex: 1,
                  fontSize: 14,
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {getTaskData(selectedTask)}
              </Typography>
              <Button
                href={getTaskData(selectedTask)}
                target="_blank"
                // disabled={selectedTask.status === 'done'}
                // onClick={() => {
                //   if (selectedTask.status === 'todo' && selectedTask.action) {
                //     window.open(item.action, '_blank')
                //   }
                // }}
                sx={{
                  position: 'relative',
                  background: 'none',
                  fontSize: 12,
                  fontWeight: 400,
                  color: '#FFFFFF',
                  textTransform: 'unset',
                  border: 0,
                  marginLeft: 'auto',
                  '&::before': {
                    content: '""',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    position: 'absolute',
                    borderRadius: 2.5,
                    border: '1px solid transparent',
                    background:
                      'linear-gradient(45deg, rgba(193, 168, 117, 1), rgba(255, 255, 255, 1), rgba(87, 98, 101, 1)) border-box',
                    '-webkit-mask':
                      ' linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    '-webkit-mask-composite': 'destination-out',
                    maskComposite: 'exclude',
                  },
                  '&:hover': {
                    backgroundColor: 'unset',
                  },
                  '&.Mui-disabled': {
                    opacity: 0.3,
                  },
                }}
              >
                <FormattedMessage id="tasks.next" />
              </Button>
            </Box>
          )}

          {selectedTask?.status === 'processing' &&
            selectedTask?.type !== 'add_project' && (
              <Typography
                variant="body2"
                sx={{
                  marginBottom: 2,
                }}
              >
                <FormattedMessage id="tasks.checking1" />
              </Typography>
            )}

          {selectedTask?.type === 'add_project' ? (
            <Button
              onClick={() => {
                addProjectTask(selectedTask?._id, input)
              }}
              disabled={!input.length}
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
                textTransform: 'unset',
                border: '1px solid #fff',
                opacity: !input.length ? 0.4 : 1,
                '&:hover': {
                  backgroundColor: 'rgba(193, 168, 117, 1)',
                },
              }}
            >
              <FormattedMessage id="common.continue" />
            </Button>
          ) : (
            <TaskAction
              handler={() => takeTask(selectedTask)}
              data={selectedTask}
            />
          )}
        </Box>
      </SwipeableDrawer>

      <DailyRewardsDrawer
        open={toggleDrawerDailyReward}
        dailyReward={dailyReward}
        toggleDrawer={handleToggleDrawerDailyReward}
        handleClaim={claimDailyRewardTask}
      />
    </Box>
  )
}

export default TasksPage
