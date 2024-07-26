import React, { useCallback, useMemo, useState } from 'react'

import { MessageContext } from './Context'
import { ChatTab } from '@/components/webapp/chatTabs'


const initialState = {
	lead: '',
	account: '',
	chatId: '',
	messageId: '',
	replyMessageId: '',
	message: '',
	chatTab: ChatTab.Manual,
	isMessageEdit: false,
}

export const MessageProvider = ({ children }) => {
	const [state, setState] = useState(initialState)
	const [updateTriggerCount, setUpdateTriggerCount] = useState(0)

	const setMessageState = useCallback((messageState) => setState(prevState => ({...prevState, ...messageState})), []);
	const resetMessageState = useCallback((messageState) => setState({...initialState, ...messageState}), [])

	const editMsg = useCallback(async ({
		chatId,
		messageId,
		message,
		account,
		lead,
	  }) => {
		const manager =
		  localStorage.getItem('known_manager') ||
		  localStorage.getItem('tg_username')
	
		const response = await fetch('/api/edit-msg/', {
		  method: 'POST',
		  body: JSON.stringify({
			manager,
			from: account,
			lead: lead,
			msg_id: messageId,
			chat_id: chatId,
			message
		  }),
		  headers: {
			'Content-Type': 'application/json',
		  },
		})


	
		if (!response.ok) {
		  return {
			message: 'Failed to edit message',
			type: 'error',
		  }
		}
	
		const { error } = await response.json()
		
		if (error) {
		  return {
			message: error,
			type: 'error',
		  }
		}

		resetMessageState({chatTab: ChatTab.Manual})
	
		return {
		  message: 'Message edited successfully!',
		  type: 'success',
		}
	}, [])

	const updateTrigger = (account = false) => {
		console.log('Account ', account)
		if (account && window.reloadChat && window.reloadChat[account]) {
			window.reloadChat[account]() // hit reload by this synthetic
			return true
		}
		
		// if no account specified, reload chat history from ALL
		setUpdateTriggerCount((count) => count+1)
	}

	const value = useMemo(() => ({
		...state,
		updateTriggerCount,
		editMsg,
		updateTrigger,
		setMessageState,
		resetMessageState,
	}), [state, updateTriggerCount, editMsg, setState])

	return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
}
