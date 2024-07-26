import moment from 'moment'
import striptags from 'striptags'
import _ from 'lodash'
import getConfig from 'next/config'
import timezones from 'city-timezones'
import { useEffect, useRef, useReducer, useMemo } from 'react'

const { publicRuntimeConfig } = getConfig()
const { imageStorage, domainName } = publicRuntimeConfig

export function hexToBigInt(hexString) {
  let result = BigInt(0)
  let paw = hexString.length - 1
  hexString.split('').forEach((symbol) => {
    result = result + BigInt(parseInt(symbol, 16) * 16 ** paw)
    paw -= 1
  })
  return result.toString()
}

export const stripTags = (str) => {
  const c = str.replace(/<br>/g, '<br>\n')
  return striptags(c, ['spoiler', 'em', 'strong', 'br'])
 // return str.replace(/(<([^>]+)>)/gi, '')
}

export const textPreview = (str, limit = 30) => {
  const txt = stripTags(str)
  if (txt.length < limit) return txt

  return `${txt.substring(0, limit - 1)}...`
}

export const timePassed = (since) => {
  if (!since || since.includes('0001-01-01')) return '-'

  const min = moment().diff(since, 'minutes')

  if (min < 1) return `1 min ago`
  if (min >= 60 * 24) return `${Math.floor(min / (60 * 24))} days ago`
  if (min >= 120) return `${Math.floor(min / 60)} hours ago`
  if (min >= 60) return `1 hour ago`

  return `${min} min ago`
}

export const timePassedSec = (sec) => {
  const hours   = Math.floor(sec / 3600)
  const minutes = Math.floor(sec / 60) % 60
  const seconds = sec % 60

  return [hours,minutes,seconds]
    .map(v => v < 10 ? "0" + v : v)
    .filter((v,i) => v !== "00" || i > 0)
    .join(":")
}

export const timePassedWithoutDay = (since) => {
  if (!since || since.includes('0001-01-01')) return '-'

  const min = moment().diff(since, 'minutes')

  if (min < 1) return `1 min ago`
  if (min >= 60 * 24) return null
  if (min >= 120) return `${Math.floor(min / 60)} hours ago`
  if (min >= 60) return `1 hour ago`

  return `${min} min ago`
}

export const sortingParams = (query) => {
  if (!query.orderBy || !query.orderBy.field) return false

  const dir = query.orderDirection === 'asc' ? '' : '-'
  return `&sort=${dir}${query.orderBy.field}`
}

export const sortingParamsNeo = (query, nullsLast = false) => {
  if (!query.orderBy || !query.orderBy.field) return false

  let dir = query.orderDirection
  if (nullsLast) {
    dir = dir == 'asc' ? 'asc_nulls_first' : 'desc_nulls_last'
  }
  return `&sort_by=${query.orderBy.field}&sort_direction=${dir}`
}

export const getHeaders = () => {
  const token = localStorage.getItem('token') || ''
  let res = {
    'Content-Type': 'application/json',
  }

  if (token && token.length > 8) {
    res['Authorization'] = `Bearer ${token}`
  }

  return res
}

export const handleServerError = (resp, router) => {
  const code = resp.status || 0
  if (code && code == 503) {
    window.location.reload() // force reload front-end to avoid Cloudflare cookie expire
    return false
  }

  if (code && code == 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('wallet')
    window.location = '/login'
    return false
  }

  if (code && code == 400) {
    if (window.location.pathname.includes('/nft-projects/')) {
      window.location = `/nft-projects/404`
      return false
    }

    return true
  }

  if (code && code == 403 && !window.location.pathname.includes('/whitelist')) {
    window.location = '/whitelist'
    return false
  }

  const dex = `${router.query?.dex || 'uniswap'}`
  const pair = getDefaultPair(dex)

  if (code && code == 404) {
    console.log('handle server error 404')
    if (window.location.pathname.includes('/nft-projects/')) {
      window.location = `/nft-projects/404`
      return false
    }

    if (window.location.pathname.includes('/tokens/')) {
      window.location = `/${dex}/${pair}/tokens/404`
    } else {
      // dont throw to 404 page for wallet
      // window.location = `/${dex}/${pair}/wallets/404`
      return false
    }
  }

  // return true to show error to user
  return true
}

export const emptyField = (data) =>
  data === null || (typeof data === 'string' && data.trim().length === 0)

export const getDefaultPair = (dex) => {
  if (dex == 'pancake') return 'WBNB'
  if (dex == 'quickswap') return 'MATIC'
  if (dex == 'traderjoe') return 'AVAX'
  if (dex == 'spookyswap') return 'FTM'
  if (dex == 'raydium') return 'SOL'
  if (dex == 'trisolaris') return 'NEAR'
  if (dex == 'klayswap') return 'KLAY'
  return 'WETH'
}

export const getNetworkToken = (dex) => {
  if (dex == 'pancake') return 'BNB'
  if (dex == 'quickswap') return 'MATIC'
  if (dex == 'traderjoe') return 'AVAX'
  if (dex == 'spookyswap') return 'FTM'
  if (dex == 'raydium') return 'SOL'
  if (dex == 'trisolaris') return 'NEAR'
  if (dex == 'klayswap') return 'KLAY'
  return 'ETH'
}

export const getScan = (dex) => {
  if (dex == 'pancake') return 'bscscan.com'
  if (dex == 'quickswap') return 'polygonscan.com'
  if (dex == 'spookyswap') return 'ftmscan.com'
  if (dex == 'raydium') return 'solscan.io'
  if (dex == 'traderjoe') return 'snowtrace.io' // 'avascan.info/blockchain/c'
  if (dex == 'trisolaris') return 'aurorascan.dev'
  if (dex == 'klayswap') return 'scope.klaytn.com'
  return 'etherscan.io'
}

export const getBlockchain = (dex) => {
  if (dex == 'pancake') return 'bsc'
  if (dex == 'quickswap') return 'matic'
  if (dex == 'traderjoe') return 'avax'
  if (dex == 'spookyswap') return 'ftm'
  if (dex == 'raydium') return 'sol'
  if (dex == 'trisolaris') return 'aurora'
  if (dex == 'klayswap') return 'klay'
  return 'eth'
}

export const getDexInfo = (dex, address, type = 'token') => {
  if (dex == 'pancake')
    return `https://pancakeswap.finance/info/${
      type === 'token' ? 'token' : 'pool'
    }/${address}`

  if (dex == 'quickswap')
    return `https://info.quickswap.exchange/#/${type}/${address}`

  if (dex == 'spookyswap')
    return `https://info.spookyswap.finance/${type}/${address}`

  if (dex == 'raydium')
    return `https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${address}&outputAmount=0&fixed=in`

  if (dex == 'trisolaris') return `https://trisolaris.io/#/${type}/${address}`

  if (dex == 'traderjoe')
    return type === 'token'
      ? `https://traderjoexyz.com/trade?outputCurrency=${address}#/`
      : 'https://traderjoexyz.com/pool'
  if (dex == 'klayswap') return 'https://klayswap.com/exchange/swap'

  return `https://v2.info.uniswap.org/${type}/${address}`
}

export const swapToken = (dex, from, to) => {
  if (dex == 'pancake')
    return `https://pancakeswap.finance/swap?inputCurrency=${from}&outputCurrency=${to}`
  if (dex == 'quickswap')
    return `https://quickswap.exchange/#/swap?inputCurrency=${from}&outputCurrency=${to}`
  if (dex == 'spookyswap')
    return `https://spookyswap.finance/swap?inputCurrency=${from}&outputCurrency=${to}`
  if (dex == 'raydium')
    return `https://raydium.io/swap?inputCurrency=${from}&outputCurrency=${to}`
  if (dex == 'traderjoe')
    return `https://traderjoexyz.com/trade?inputCurrency=${from}&outputCurrency=${to}`
  if (dex == 'trisolaris')
    return `https://trisolaris.io/#/swap?inputCurrency=${from}&outputCurrency=${to}`
  if (dex == 'klayswap') return 'https://klayswap.com/exchange/swap'

  return `https://app.uniswap.org/#/swap?inputCurrency=${from}&outputCurrency=${to}&use=V2&chain=mainnet`
}

export const BASE_TOKEN_ADDRESS = {
  uniswap: {
    weth: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    usdt: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    wbtc: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  },
  pancake: {
    wbnb: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    busd: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
  },
  quickswap: {
    matic: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    usdc: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    weth: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    usdt: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  },
  traderjoe: {
    avax: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    'usdc.e': '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
    'usdt.e': '0xc7198437980c041c805a1edcba50c1ce5db95118',
    'weth.e': '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
  },
  spookyswap: {
    ftm: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    usdc: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    fusdt: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
    weth: '0x74b23882a30290451a17c44f4f05243b6b58c76d',
  },
  raydium: {
    sol: 'So11111111111111111111111111111111111111112',
    usdc: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  },
  trisolaris: {
    near: '0xc42c30ac6cc15fac9bd938618bcaa1a1fae8501d',
    weth: '0xc9bdeed33cd01541e1eed10f90519d2c06fe3feb',
    usdc: '0xb12bfca5a55806aaf64e99521918a4bf0fc40802',
    usdt: '0x4988a896b1227218e4a686fde5eabdcabd91571f',
  },
  klayswap: {
    klay: '0x0000000000000000000000000000000000000000',
    oeth: '0x34d21b1e550d73cee41151c77f3c73359527a396',
    ousdt: '0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167',
  },
}

export const dexioLink = (dex, pairAddress) => {
  if (dex == 'pancake')
    return `https://www.dextools.io/app/bsc/pair-explorer/${pairAddress}`
  if (dex == 'quickswap')
    return `https://www.dextools.io/app/polygon/pair-explorer/${pairAddress}`
  if (dex == 'spookyswap')
    return `https://www.dextools.io/app/fantom/pair-explorer/${pairAddress}`
  if (dex == 'traderjoe')
    return `https://www.dextools.io/app/avalanche/pair-explorer/${pairAddress}`
  if (dex == 'raydium')
    return `https://www.dextools.io/app/solana/pair-explorer/${pairAddress}`
  if (dex == 'trisolaris')
    return `https://www.dextools.io/app/aurora/pair-explorer/${pairAddress}`
  if (dex == 'klayswap') return null

  return `https://www.dextools.io/app/ether/pair-explorer/${pairAddress}`
}

export const holdingsLink = (dex, address) => {
  const scan = getScan(dex)
  if (dex == 'klayswap') {
    return `https://${scan}/account/${address}?tabId=tokenBalance`
  }
  return `https://${scan}/tokenholdings?a=${address}`
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement('textarea')
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    var successful = document.execCommand('copy')
    var msg = successful ? 'successful' : 'unsuccessful'
    console.log('Fallback: Copying text command was ' + msg)
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err)
  }

  document.body.removeChild(textArea)
}

export function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text)
    return
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log('Async: Copying to clipboard was successful!')
    },
    function (err) {
      console.error('Async: Could not copy text: ', err)
    }
  )
}

export function isValidWallet(wallet = '', isSolana = false) {
  if (isSolana) {
    if (wallet.length < 44) return false
    return true
  }

  const a = wallet.toLowerCase().split('x')
  if (wallet.length != 42 || a.length != 2 || a[0] != '0') return false
  const reg = a[1].match(/[0-9a-f]{40}/g)
  return reg != null
}

export function getTokenIcon(address, dex = 'uniswap', extension) {
  const network = getBlockchain(dex)
  if (!address || !extension) {
    return `${imageStorage}/tokens/${network}/empty-token.png`
  }

  return `${imageStorage}/tokens/${network}/${address}.${extension}`
}

export function getContrastColor(hexColor, dark = '#000', light = '#fff') {
  const r = parseInt(hexColor.substr(1, 2), 16)
  const g = parseInt(hexColor.substr(3, 2), 16)
  const b = parseInt(hexColor.substr(5, 2), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 160 ? dark : light
}

// for live pairs page
export function getAddressesOfSelectedTokens(dexes, tokens) {
  const c = tokens.map((item) => item.title.toLowerCase())

  const res = []
  dexes.forEach((dex) => {
    c.forEach((token) => {
      if (BASE_TOKEN_ADDRESS[dex][token]) {
        res.push(BASE_TOKEN_ADDRESS[dex][token])
      }
    })
  })

  return res
}

// no by default
export function isProduction() {
  if (typeof window == 'undefined') return false
  if (
    window.location.host == 'cheesus.ai' ||
    window.location.host == 'onchainlab.ai'
  )
    return true
  return false
}

export function axisBottomMapper(data = [], paramsOptions = {}, key = 'x') {
  const mapper = {}
  const frame = data[0].frame || '7D'
  let datum = []

  data.forEach((d) => {
    if (d.data.length > datum.length) {
      datum = d.data
    }
  })

  const defaultOptions = {
    '30D': {
      xInterval: 7,
      xFormat: 'MMM DD',
    },
    '7D': {
      xInterval: 2,
      xFormat: 'MMM DD',
    },
    '24H': {
      xInterval: 6,
      xFormat: 'HH:mm',
    },
  }

  const options = _.merge(defaultOptions, paramsOptions)

  let xFormat = options['30D'].xFormat
  let xInterval = options['30D'].xInterval

  if (frame === '24H') {
    xFormat = options['24H'].xFormat
    xInterval = options['24H'].xInterval
  }

  if (frame === 'All' && options['All']) {
    xFormat = options['All'].xFormat
    xInterval = options['All'].xInterval
  }

  if (frame === '1Y' && options['1Y']) {
    xFormat = options['1Y'].xFormat
    xInterval = options['1Y'].xInterval
  }

  if (frame == '7D') {
    xInterval = options['7D'].xInterval
  }

  const lowData = datum.length < 6

  datum.forEach((item, ind) => {
    const xAxisValue =
      typeof item[key] === 'string' ? item[key] : item[key].toString()
    if ((ind == 0 && frame != '7D') || lowData) {
      // mapper[xAxisValue] = true
      return
    }

    const k = (ind + 1) % xInterval == 0
    mapper[xAxisValue] = k
  })

  return {
    mapper,
    xFormat,
  }
}

export function timezoneByCity(city, event) {
  let defaultTz = 'America/Los_Angeles'
  let c = city && city.length > 1 ? city.trim() : 'Miami'

  if (city == 'NY' || city == 'NYC' || city.includes('New York')) {
    c = 'New York'
  }

  const res = timezones.lookupViaCity(c)

  let filtered = res
  if (filtered.length > 1) {
    filtered = res.filter((item) => item.country == event.country)
  }
  return filtered && filtered.length > 0 ? filtered[0].timezone : defaultTz
}

export function is12HourTime(onlyDate = false) {
  const lang = navigator.language || 'en'
  const countries = ['en-US', 'en-CA', 'en-GB']
  const dateCountries = ['en-US', 'en-CA']

  if (onlyDate) return dateCountries.includes(lang)
  return countries.includes(lang)
}

export function localFormattedTime(time) {
  const ampm = is12HourTime()

  return moment(`2022-12-01 ${time}`).format(ampm ? 'h:mm a' : 'HH:mm')
}

export function localFormattedDate(dat) {
  const ampm = is12HourTime(true)

  return moment(`${dat}`).format('ddd, MMM D') // 'ddd, YYYY-MM-DD'
}

export function localFormattedDateWithoutDay(dat) {
  const ampm = is12HourTime(true)

  return moment(`${dat}`).format('MMM D, YYYY') // 'YYYY-MM-DD'
}

export function useDebounce(callback, timer = 500) {
  const ref = useRef()

  useEffect(() => {
    ref.current = callback
  }, [callback])

  const debouncedCallback = useMemo(() => {
    const func = (a) => {
      ref.current?.(a)
    }

    return _.debounce(func, timer)
  }, [])

  return debouncedCallback
}

export const sleeper = async (sec) => {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000)
  })
}

export const validateUrl = (url) => {
  if (url.startsWith('http://')) {
    return url
  }

  if (!url.startsWith('https://')) {
    return 'https://' + url
  }

  return url
}

export const filterSymbols = (text) => {
  if (!text) return 'User'

  const nonAlphaNumericRegex = /[^A-zА-я0-9 ]/gu
  const letters = text.replace(nonAlphaNumericRegex, '').split(' ')
  const trimLetters = letters.map((v) => v.trim())
  const filteredLetters = trimLetters.filter((v) => v !== '')
  const firstLetter = filteredLetters?.[0]
  return firstLetter || 'User'
}

export const generateJPG = (source) => {
  const a = Buffer.from(source, 'base64')

  const init = Buffer.from(
    'ffd8ffe000104a46494600010100000100010000ffdb004300281c' +
      '1e231e19282321232d2b28303c64413c37373c7b585d4964918099968f808c8aa0b4e6c3' +
      'a0aadaad8a8cc8ffcbdaeef5ffffff9bc1fffffffaffe6fdfff8ffdb0043012b2d2d3c35' +
      '3c76414176f8a58ca5f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8' +
      'f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8ffc00011080000000003012200' +
      '021101031101ffc4001f0000010501010101010100000000000000000102030405060708' +
      '090a0bffc400b5100002010303020403050504040000017d010203000411051221314106' +
      '13516107227114328191a1082342b1c11552d1f02433627282090a161718191a25262728' +
      '292a3435363738393a434445464748494a535455565758595a636465666768696a737475' +
      '767778797a838485868788898a92939495969798999aa2a3a4a5a6a7a8a9aab2b3b4b5b6' +
      'b7b8b9bac2c3c4c5c6c7c8c9cad2d3d4d5d6d7d8d9dae1e2e3e4e5e6e7e8e9eaf1f2f3f4' +
      'f5f6f7f8f9faffc4001f0100030101010101010101010000000000000102030405060708' +
      '090a0bffc400b51100020102040403040705040400010277000102031104052131061241' +
      '510761711322328108144291a1b1c109233352f0156272d10a162434e125f11718191a26' +
      '2728292a35363738393a434445464748494a535455565758595a636465666768696a7374' +
      '75767778797a82838485868788898a92939495969798999aa2a3a4a5a6a7a8a9aab2b3b4' +
      'b5b6b7b8b9bac2c3c4c5c6c7c8c9cad2d3d4d5d6d7d8d9dae2e3e4e5e6e7e8e9eaf2f3f4' +
      'f5f6f7f8f9faffda000c03010002110311003f00',
    'hex'
  )

  const footer = Buffer.from('ffd9', 'hex')

  init[164] = a[1]
  init[166] = a[2]

  return Buffer.concat([init, a.slice(3), footer]).toString('base64')
}

export const between = (s, prefix, suffix) => {
  let i = s.indexOf(prefix)
  if (i === -1) return ''
  s = s.substring(i + prefix.length)
  if (suffix) {
    i = s.indexOf(suffix)
    if (i === -1) return ''
    s = s.substring(0, i)
  }
  return s
}

export const chunk = (array, size = 10) => {
  const chunkedArr = []

  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size))
  }

  return chunkedArr
}

export const isShallowEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false

  let targetArr1 = []
  let targetArr2 = []
  const isObjectType = arr1.some((i) => typeof i === 'object')

  if (isObjectType) {
    targetArr1 = arr1.map((i) => i.id)
    targetArr2 = arr2.map((i) => i.id)
  }

  if (!targetArr1.every((i) => targetArr2.includes(i))) return false

  return true
}

export const buildAvatarImageUrl = (id) => {
  return `https://tg-agent.onchainlab.ai/uploads/chat_logos/${id}.png`
}
