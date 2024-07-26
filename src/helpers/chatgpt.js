import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'
import { parseTelegramChat } from './formatter'

const { publicRuntimeConfig } = getConfig()
const { imageStorage, domainName, chatGptApiKey } = publicRuntimeConfig

let cacheAccount = ''
let cache = {}
let cacheInfo = {}

export const loadDirections = async () => {
  const url = `/api/chat-directions/`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    console.log(response.errors)
    return { error: response.statusText }
  }
  const d = await response.json()
  return d.options
}

export const loadChatHistory = async (account, lead, chatId, full = false) => {
  console.log('try to get history', account, lead)

  if (lead != cacheAccount) {
    cache = {} // reset cache
  }
  cacheAccount = lead

  const m =
    localStorage.getItem('known_manager') || localStorage.getItem('tg_username')
  let url = `/api/get-dialog/?lead=${lead}&from=${account}&chatId=${chatId}&manager=${m}`
  if (full) url += '&full=true'

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    console.log(response.errors)
    return { error: response.statusText }
  }
  const d = await response.json()

  if (d.error) {
    console.log('error', d.error)
    return { error: d.error }
  }

  const history = parseTelegramChat({ chat: d, account, lead })

  cache[account] = history
  return {
    history,
  }
}

export const formatAnswer = (answer) => {
  const c = answer.split('"')
  if (c.length > 2) return c[1]

  const a1 = new RegExp(/^[A-D]\)/)
  const b = new RegExp(/^[A-D]:/)
  const a2 = new RegExp(/^[A-D]. /)

  if (answer.match(/^Option [A-D]:/)) {
    const a = answer.split(': ')
    a.shift()
    return a.join(' ')
  }

  if (b.test(answer)) {
    const a = answer.split(': ')
    a.shift()
    return a.join(' ')
  }

  if (a1.test(answer)) {
    const a = answer.split(') ')
    a.shift()
    return a.join(' ')
  }

  if (a2.test(answer)) {
    return answer.substring(3)
  }

  return answer
}

export const getSuggestions = async (
  leadTg,
  leadProfile,
  leadBio,
  synthetic, // chatHistory,
  direction,
  prompt,
  from,
  manager,
) => {
  // TODO: send request to ChatGPT
  let log = false

  if (!leadProfile || direction === 'tagging') log = false

  const chatHistory = cache[synthetic] || []
  const chat = []

  if (chatHistory && chatHistory.length > 1) {
    chatHistory.forEach((item) => {
      if (item.in) {
        chat.push(`Customer: ${item.msg}`)
      } else {
        chat.push(`Me: ${item.msg}`)
      }
    })
  } else {
    chat.push('Empty')
  }

  console.log('TOGGLE GET SUGGESTIONS FOR', synthetic, chat)

  let o = prompt
  let text =
    `Me as sales manager in AI and blockchain industry talking with customer.` +
    `Process given client information and existing dialogue. ${o}.` +
    `Provide A-B-C list of 3 options to answer to customer. Each answer must be maximum 25 words.` +
    `Client information: Name is ${leadProfile?.name || 'unknown'}.`

  if (leadProfile['Status']) {
    text += leadProfile['Status'] + '. '
  }

  if (leadBio && leadBio.length > 1) {
    text += `Client\'s profile description: "${leadBio}".`
  }

  text += `Existing dialogue:\n${chat.join('\n')}.`

  let body = {
    lead_tg: leadTg,
    from: manager || from,
    model: 'gpt-4',
    systemMsg:
      'You are a sales manager in AI and blockchain industry and senior programmer.',
    text,
    direction: direction.includes('Custom') ? prompt : direction,
    log,
  }

  if (manager) body.parent = manager

  console.log('GPT text param:', text)

  return await fetch(`/api/ask-chatgpt/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': chatGptApiKey,
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.ok) return response.json()
      throw new Error('failed to send message')
    })
    .catch((err) => {
      console.log('failed to save on server!!', err)
      return { error: err }
    })
}

export const getSuggestionsCustomPrompt = async (
  leadTg,
  prompt,
  manager,
  systemMsg,
  // synthetic
) => {
  let extra = ''

  if (window.group_chat_history) {
    const c = window.group_chat_history()

    const quotes = []
    c.forEach((i) => {
      if (i.content && i.content.length > 1)
        quotes.push(`${i.name}: "${i.content}"`)
    })

    if (quotes.length > 0) {
      extra = `\nAnalyze following quotes of the customer from public discussion to generate answer: ${quotes.join(
        '\n',
      )}`
    }
  }

  /*
  if (synthetic) {
    const chatHistory = cache[synthetic] || []
    const quotes = []

    if (chatHistory && chatHistory.length > 1) {
      chatHistory.forEach((item) => {
        if (item.in && item.msg.length > 2) {
          quotes.push(`"${item.msg}"\n`)
        }
      })
    }

    if (quotes.length > 0) {
      extra = `\nВот цитаты товарища на основе которых нужно построить ответ: ${quotes.join(
        '\n',
      )}`
    }
  } */

  let body = {
    lead_tg: leadTg,
    from: manager,
    model: 'gpt-4',
    systemMsg,
    text: prompt + extra,
    direction: 'Manual',
    log: false,
    parent: manager,
  }

  console.log('GPT req:', body, prompt + extra)

  return await fetch(`/api/ask-chatgpt/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': chatGptApiKey,
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.ok) return response.json()
      throw new Error('failed to send message')
    })

    .catch((err) => {
      console.log('failed to save on server!!', err)
      return { error: err }
    })
}
