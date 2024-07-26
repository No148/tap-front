import CircularProgress from '@mui/material/CircularProgress'

export default function Spinner({ classProp = {} }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={Object.assign(
          {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          },
          classProp
        )}
      >
        <CircularProgress />
      </div>
    </div>
  )
}
