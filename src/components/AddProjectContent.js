import { useSnackbar } from '@/providers/SnackbarProvider'
import { Box, Button, Paper, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

const AddProjectContent = ({
  onClose = () => {},
  taskId,
  reloadTasks = () => {},
  mode = 'tasks',
}) => {
  const { snackbar } = useSnackbar()
  const [input, setInput] = useState('')
  const [activeStep, setActiveStep] = useState(1)
  const [createError, setCreateError] = useState(false)
  const userId = window.localStorage.getItem('chat_id')

  const takeTask = async (project_url) => {
    const response = await fetch('/api/take-task/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: userId,
        task_id: taskId,
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
    onClose?.()
    setCreateError(false)
    reloadTasks?.()
  }

  const createProject = async (url) => {
    const response = await fetch('/api/create-project/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
      }),
    })
    if (!response.ok) {
      snackbar('Failed to create project', true)
      setCreateError('Failed to add project')
      console.error('Failed to create project', response)
      return
    }
    const data = await response.json()
    if (data.error) {
      snackbar(data.error, true)
      setCreateError(data.error)
      return
    }

    setCreateError(false)
    if (data.status === 'ok') {
      setActiveStep((prev) => prev + 1)
    } else {
      setCreateError('Failed to add project')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    mode === 'tasks' ? takeTask(input) : createProject(input)
  }

  return (
    <Box sx={{ overflow: 'auto', paddingBottom: '60px' }}>
      {activeStep === 1 && (
        <Box
          onSubmit={handleSubmit}
          component="form"
          sx={{
            zIndex: 1,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 0,
            minHeight: '250px',
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
          <Paper
            square
            elevation={0}
            sx={{
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
              <FormattedMessage id={`${mode}.addProjectText2`} />
            </Typography>
          </Paper>

          <TextField
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
                marginTop: '18px',
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
          <Button
            type="submit"
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

          <Button
            onClick={onClose}
            variant="outlined"
            type="button"
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
              marginTop: 2,
            }}
            fullWidth
          >
            <FormattedMessage id="swap.back" />
          </Button>
        </Box>
      )}
      {activeStep === 2 && (
        <Box
          sx={{
            zIndex: 1,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '250px',
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
            <Typography
              sx={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: 1,
              }}
            >
              <FormattedMessage id="tasks.addProjectText3" />
            </Typography>

            <Typography
              sx={{
                fontSize: '12px',
                color: '#FDE0B4',
                lineHeight: 1.2,
              }}
            >
              <FormattedMessage id="tasks.addProjectText4" />
            </Typography>
          </Paper>

          <Button
            href="https://forms.gle/BxCAgVcxLnkc7fet5"
            target="_blank"
            sx={{
              mt: 3,
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
            <FormattedMessage id="tasks.googleForm" />
          </Button>
          <Button
            onClick={() => {
              onClose?.()
              setActiveStep((prev) => prev - 1)
            }}
            variant="outlined"
            type="button"
            aria-describedby="filter-popover-tags"
            sx={{
              flex: { xs: 2, sm: 1 },
              maxHeight: '50px',
              // py: 1.8,
              fontSize: 18,
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.2,
              textAlign: 'center',
              textTransform: 'none',
              borderRadius: 2.5,
              whiteSpace: 'nowrap',
              marginTop: 2,
            }}
            fullWidth
          >
            <FormattedMessage id="common.close" />
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default AddProjectContent
