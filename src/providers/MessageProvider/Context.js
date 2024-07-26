import { ChatTab } from '@/components/webapp/chatTabs'
import { createContext } from 'react'

export const MessageContext = createContext({
	account: '',
	lead: '',
	chatId: '',
	messageId: '',
	replyMessageId: '',
	message: '',
	chatTab: ChatTab.Manual,
	isMessageEdit: false,
	updateTriggerCount: 0,
	editMsg: async () => {},
	setMessageState: () => {},
	resetMessageState: () => {},
	updateTrigger: () => {},
})
