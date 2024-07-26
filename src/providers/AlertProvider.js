import { useMemo, useState, createContext } from 'react'
import Alert from '@/components/PopAlert'

export const AlertContext = createContext({})

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ message: '', type: 'info' })

  const defaultProps = useMemo(
    () => ({
      alert,
      setAlert,
    }),
    [alert]
  )

  return (
    <AlertContext.Provider value={defaultProps}>
      <Alert data={alert} />
      {children}
    </AlertContext.Provider>
  )
}
