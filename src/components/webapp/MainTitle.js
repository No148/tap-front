import {
  AccountBox,
  AddTask,
  Block,
  Call,
  Devices,
  Diversity1,
  Group,
  Hearing,
  StickyNote2,
  HistoryToggleOff,
  Leaderboard,
  Message,
  Settings,
  Search,
  VolunteerActivism,
} from '@mui/icons-material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const MainTitle = ({ children, path }) => {
  let title = 'Calls'
  let icon = <Call fontSize={'small'} />

  if (path.includes('/telegram/search')) {
    title = 'Telegram Search'
    icon = <Search fontSize="small" />
  } else if (path.includes('/search')) {
    title = 'CRM Search'
    icon = <Search fontSize="small" />
  }

  if (path.includes('/messages')) {
    title = 'Messages'
    icon = <Message fontSize="small" />
  }

  if (path.includes('/pitching')) {
    title = 'Cold Pitching'
    icon = <Message fontSize="small" />
  }

  if (path.includes('/suggestions')) {
    title = 'Suggestions'
    icon = <VolunteerActivism fontSize="small" />
  }

  if (path.includes('/chat-tasks')) {
    title = 'Chat tasks'
    icon = <AddTask fontSize="small" />
  }

  if (path.includes('/open-chat')) {
    title = 'Chat with lead'
    icon = <Message fontSize="small" />
  }

  if (path.includes('/open-group')) {
    title = 'Group chat'
    icon = <Diversity1 fontSize="small" />
  }

  if (path.includes('/profile')) {
    title = 'Profile'
    icon = <AccountBox fontSize="small" />
  }

  if (path.includes('/user/')) {
    title = 'User profile'
    icon = <AccountBox fontSize="small" />
  }

  if (path.includes('/device')) {
    title = 'Device'
    icon = <Devices fontSize="small" />
  }

  if (path.includes('/history')) {
    title = 'History'
    icon = <HistoryToggleOff fontSize="small" />
  }

  if (path.includes('/leaderboard')) {
    title = 'Leaderboard'
    icon = <Leaderboard fontSize="small" />
  }

  if (path.includes('/no-access')) {
    title = 'Access Denied'
    icon = <Block fontSize="small" />
  }

  if (path.includes('/accounts')) {
    title = 'Accounts'
    icon = <Group fontSize="small" />
  }

  if (path.includes('/employees')) {
    title = 'Employees'
    icon = <Group fontSize="small" />
  }

  if (path.includes('/employees-templates')) {
    title = 'Employees Templates'
    icon = <StickyNote2 fontSize="small" />
  }

  if (path.includes('/chats')) {
    title = 'Chats'
    icon = <Message fontSize="small" />
  }

  if (path.includes('/listener')) {
    title = 'Listener'
    icon = <Hearing fontSize="small" />
  }

  if (path.includes('/listener/settings')) {
    title = 'Listener Settings'
    icon = <Settings fontSize="small" />
  }

  return (
    <Box sx={{ maxWidth: 500 }}>
      <Typography
        variant="overline"
        display="block"
        gutterBottom
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'black',
          gap: 1,
          lineHeight: 1,
          mb: 0,
        }}
      >
        {icon} {title}
      </Typography>
    </Box>
  )
}
export default MainTitle
