import { useContext } from 'react'

import { MessageContext } from './Context'

export const useMessageProvider = () => {
	return useContext(MessageContext)
}
