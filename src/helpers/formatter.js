import moment from 'moment'
const U = 8,
  s = 'en-US',
  b = [
    '\u2080',
    '\u2081',
    '\u2082',
    '\u2083',
    '\u2084',
    '\u2085',
    '\u2086',
    '\u2087',
    '\u2088',
    '\u2089',
  ]

var C = (() => {
  return ((wt = C || (C = {})).FULL = 'full'), (wt.EXPANDED = 'expanded'), C
  var wt
})()

export class PriceFormatter {
  //
  static generateRandomInt(O) {
    return (Math.random() * (O + 1)) | 0
  }
  //
  static toFixed(O) {
    let S = O.toString()
    if (Math.abs(O) < 1) {
      const Y = parseInt(O.toString().split('e-')[1], 10)
      Y &&
        ((O *= Math.pow(10, Y - 1)),
        (S = '0.' + new Array(Y).join('0') + O.toString().substring(2)))
    } else {
      let Y = parseInt(O.toString().split('+')[1], 10)
      Y > 20 &&
        ((Y -= 20), (S = (O /= Math.pow(10, Y)) + new Array(Y + 1).join('0')))
    }
    return S
  }
  //
  static tokensNumberFormat(O, S) {
    return O.length <= S ? 0.01 : +[O.slice(0, -S), '.', O.slice(S)].join('')
  }
  //
  static getOptimalDecimals(O) {
    const S = ((Math.floor(O) || '') + '').length
    let Y = S ? U - S : -Math.floor(Math.log(O) / Math.log(10) + 1)
    return (
      (Y = S ? Y : Y ? Math.max(Y + 2 + 1, U) : U), Math.max(0, Math.min(Y, 14))
    )
  }
  static shortPrice(O, S = 10) {
    if (null == O) return ''
    const Y = PriceFormatter.toReadableNumber(O, null, S)
    return Y && Y.indexOf('...') >= 0
      ? Y.slice(0, S + 2)
      : Y
      ? Y.slice(0, S)
      : ''
  }
  static shortenPrice(O, S = 4) {
    if (null == O) return ''
    if (O === 0) return '0'
    if (O >= 1) return PriceFormatter.toReadableNumber(O)
    {
      const Y = PriceFormatter.formatNumbersWithLargeDecimals(Math.abs(O), S)
      let absResult = void 0 !== Y ? Y : ''
      const isNegative = O < 0
      let result = isNegative ? `-${absResult}` : absResult

      if (result === '-0') {
        result = '0'
      }

      return result
    }
  }
  static formatNumbersWithLargeDecimals(O, S) {
    if (0 !== O) {
      const $ = PriceFormatter.toReadableNumber(O, C.FULL)
      let rt = $ ? parseInt($.split('.')[1]) : ''
      rt = parseInt(rt)
      const Q = -Math.floor(Math.log(O) / Math.log(10) + 1),
        Ot = S || 2
      return '0' === $
        ? '0'
        : Q > Ot
        ? '0.0' + PriceFormatter.getUnicodeValue(Q) + String(rt).substring(0, 4)
        : PriceFormatter.formatNumber(O, S && Q <= Ot ? Q + 4 : 4)
    }
    return '0'
  }
  static formatNumber(O, S) {
    let $ = (
      S
        ? new Intl.NumberFormat('en-US', { minimumFractionDigits: S + 1 })
        : new Intl.NumberFormat('en-US')
    ).format(O)
    return S && ($ = $.substring(0, $.length - 1)), $
  }
  static getUnicodeValue(O, S) {
    if (O > 9) {
      let Y = (O = String(O)).charAt(0)
      return (
        (Y = b[Y]), PriceFormatter.getUnicodeValue(O.substring(1, O.length), Y)
      )
    }
    return S ? (S += b[O]) : b[O]
  }
  static toReadableNumber(O, S = null, Y = 2, $ = 30) {
    if (
      null == O ||
      (void 0 === O.length && isNaN(O)) ||
      '' === (O + '').trim()
    )
      return ''
    const rt = Math.floor(+O),
      Q = (rt || '').toString().length
    return S === C.FULL
      ? PriceFormatter._displayFull(+O, rt, Q)
      : PriceFormatter._displayableNumber(+O, rt, Q, S === C.EXPANDED, Y, $)
  }
  static _displayableNumber(O, S, Y, $, rt = 2, Q = 30, Ot = s) {
    if (Y) {
      if (S.toString().split('e')[1]) return O.toLocaleString(Ot)
      {
        const Ct = Math.max(0, 6 - Y)
        return (+O.toFixed(Ct)).toLocaleString(Ot, {
          minimumFractionDigits: Ct < rt ? Ct : rt,
          maximumFractionDigits: Ct,
        })
      }
    }
    {
      const Ct =
          0 === O ? 0 : Y ? 6 - Y : -Math.floor(Math.log(O) / Math.log(10) + 1),
        zt = Math.min(Math.max(Ct + rt + 2, 6), 20),
        ie = (+O.toFixed(Math.max(0, Math.min(zt, Q)))).toLocaleString(Ot, {
          minimumFractionDigits: rt,
          maximumFractionDigits: zt,
        })
      return Ct < 4 || $
        ? ie
        : ie.slice(0, 3) + '...' + ie.slice(-ie.length + Ct)
    }
  }
  static _displayFull(O, S, Y, $ = s) {
    return Y && S.toString().split('e')[1]
      ? PriceFormatter.toFixed(O)
      : O.toLocaleString($, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 20,
        })
  }
}

// https://stackoverflow.com/questions/1685680/how-to-avoid-scientific-notation-for-large-numbers-in-javascript
// Number to string without exponent
export const toFixed = function (x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1])
    if (e) {
      x *= Math.pow(10, e - 1)
      x = '0.' + new Array(e).join('0') + x.toString().substring(2)
    }
  } else {
    var e = parseInt(x.toString().split('+')[1])
    if (e > 20) {
      e -= 20
      x /= Math.pow(10, e)
      x += new Array(e + 1).join('0')
    }
  }
  return x
}

/**
 * Format number to string without exponent
 * @param {Number} num The number to format
 * @param {Number} precision Max rounding precision
 * @returns {String} Formatted number
 */

export const formatNumberWithoutSign = (num) => {
  // let val = 0
  // // const b = parseFloat(num).toFixed(24) + '0'
  // const b = toFixed(num)
  // const r = new RegExp('^0.0(0000[0]+)([1-9][0-9]+)')

  // if (r.test(b)) {
  // 	val = b.replace(r, '0.00..$2').slice(0, 10)
  // } else {
  // 	val = new Intl.NumberFormat('en-US', {
  // 		minimumFractionDigits: 2,
  // 		maximumFractionDigits: num > 99 ? 4 : 8,
  // 	}).format(num)
  // }

  // return val

  return PriceFormatter.shortenPrice(num)
}

export const formatNumber = (num) => {
  const isNegative = num < 0

  const formattedWithoutSign = formatNumberWithoutSign(Math.abs(num))
  return isNegative ? `-${formattedWithoutSign}` : formattedWithoutSign
}

// for integers only, wallets count, etc
export const formatInt = (number) => {
  if (typeof number == 'undefined') return '-'
  const res = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    // maximumSignificantDigits: precision,
  }).format(number)
  return res
}

export const formatEasy = (number, showSign = false) => {
  let res = ''

  if (!showSign) {
    res = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(number)
  } else {
    res = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(number)
  }

  return res.slice(0, -2)
}

export const formatCurrency = (number, showSign = false, isInt = false) => {
  let precision = 20

  if (Math.abs(parseFloat(number)) < 0.00001) {
    return PriceFormatter.shortenPrice(number)
  }

  if (Math.abs(parseFloat(number)) > 1) {
    precision = 5
  }

  /*
	if (Math.abs(parseFloat(number)) > 10) {
		precision = 2
	} */

  let res = ''
  if (!showSign) {
    res = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: isInt ? 0 : 2,
      maximumFractionDigits: isInt ? 0 : precision,
      // maximumSignificantDigits: precision,
    }).format(number)
  } else {
    res = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: isInt ? 0 : 2,
      maximumFractionDigits: isInt ? 0 : precision,
      // maximumSignificantDigits: precision,
    }).format(number)
  }

  return res
}

export const formatCurrencySmart = (
  number,
  rawText = false,
  shortThousand = false,
) => {
  const suffixes = [
    { value: 1_000_000_000_000_000_000_000_000_000_000, suffix: 'n' },
    { value: 1_000_000_000_000_000_000_000_000_000, suffix: 'o' },
    { value: 1_000_000_000_000_000_000_000_000, suffix: 'S' },
    { value: 1_000_000_000_000_000_000_000, suffix: 's' },
    { value: 1_000_000_000_000_000_000, suffix: 'Q' },
    { value: 1_000_000_000_000_000, suffix: 'q' },
    { value: 1_000_000_000_000, suffix: 'T' },
    { value: 1_000_000_000, suffix: 'B' },
    { value: 1_000_000, suffix: 'M' },
    { value: 1_000, suffix: 'k' },
  ];

  let res = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);

  for (const { value, suffix } of suffixes) {
    if (Math.abs(number) >= value) {
      const digits = Math.log10(value) - 3;
      const regex = new RegExp(`\\,([0-9][0-9])[0-9](?:,\\d+){${digits / 3}}$`);
      let upd = res.replace(regex, '.$1');
      if (upd.endsWith('.00')) {
        upd = upd.slice(0, -3);
      }
      return rawText ? upd + suffix : <span>{upd}{suffix}</span>;
    }
  }

  if (res.endsWith('.00')) {
    res = res.slice(0, -3);
  }

  return rawText ? res : <span>{res}</span>;
};

/**
 * Format date to convenient view
 * @param {String | Number | Date} dateValue Var of date
 * @returns {String} Formatted UTC date
 */
export const formatUTCDate = (dateValue) => {
  try {
    const date = new Date(dateValue)

    const year = date.getUTCFullYear()
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2)
    const day = ('0' + date.getUTCDate()).slice(-2)
    const hours = ('0' + date.getUTCHours()).slice(-2)
    const minutes = ('0' + date.getUTCMinutes()).slice(-2)
    const seconds = ('0' + date.getUTCSeconds()).slice(-2)

    return (
      year +
      '-' +
      month +
      '-' +
      day +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds
    )
  } catch (error) {
    console.log(error)
    return dateValue
  }
}

export const formatPeriod = (seconds) => {
  if (!seconds) {
    return `N/A`
  }
  if (seconds < 60) {
    return `${seconds} sec`
  }

  if (seconds < 60 * 60) {
    return `${Math.floor(seconds / 60)} min`
  }

  if (seconds < 60 * 60 * 24) {
    return `${Math.floor(seconds / 3600)} hours`
  }

  return `${Math.floor(seconds / (24 * 3600))} days`
}

export const formatDateByLocale = (dat) => {
  const countries = ['en-US', 'en-CA', 'en-GB']
  const lang = navigator.language || 'en'

  if (countries.includes(lang)) {
    // return moment(`${dat}`).format('MM/DD/YYYY')
  }

  return moment(`${dat}`).format('MMM D, YYYY') // 'YYYY-MM-DD'
}

export const parseTelegramChat = ({
  chat,
  isGroupChat = false,
  account,
  lead,
}) => {
  const { dialog, messages } = chat
  const msgs = []

  for (const item of messages) {
    const c = {
      id: item.id,
      time: moment(item.date).format('DD MMM YYYY HH:mm'),
      reply_to: item.reply_to,
      read_outbox_max_id: dialog.read_outbox_max_id,
      senderId: item.sender.id,
      senderName: item.sender.full_name,
      senderUsername: item.sender.username,
      serviceMsg: item._ === 'MessageService',
      chat_id: isGroupChat ? `-100${dialog.peer.channel_id}` : dialog.peer.user_id,
      in: !item.out,
      account,
      lead,
    }

    if (item.fwd_from && item.fwd_from.from_id) {
      c.forwarded = item.fwd_from.from_id || 'unknown'
    }

    if (item.action && item.action._ == 'MessageActionChatCreate') {
      msgs.push({
        ...c,
        msg: `${item.sender.full_name} created the group «${item.action.title}»`,
      })
      continue
    }

    if (item.action && item.action._ == 'MessageActionChatEditTitle') {
      msgs.push({
        ...c,
        msg: `${item.sender.full_name} change group title to «${item.action.title}»`,
      })
      continue
    }

    if (item.action && item.action._ == 'MessageActionChatJoinedByLink') {
      msgs.push({
        ...c,
        msg: `${item.sender.full_name} has joined to the group by link`,
      })
      continue
    }

    if (item.action && item.action._ == 'MessageActionChatAddUser') {
      msgs.push({
        ...c,
        msg: `${
          item.sender.full_name
        } add user ${item.action.users.toString()} to the group`,
      })
      continue
    }

    if (item.action && item.action._ == 'MessageActionChatDeleteUser') {
      msgs.push({
        ...c,
        msg: `${item.sender.full_name} left the group`,
      })
      continue
    }

    if (item.action && item.action._ == 'MessageActionPinMessage') {
      msgs.push({
        ...c,
        msg: `${item.sender.full_name} pinned "${item.reply_to?.reply_to_msg}"`,
      })
      continue
    }

    if (item.action && item.action._ == 'MessageActionHistoryClear') {
      msgs.push({
        ...c,
        msg: `${item.sender.full_name} has deleted chat`,
      })
      continue
    }

    if (item.action && item.action._ == 'MessageActionChatEditPhoto') {
      msgs.push({
        ...c,
        msg: `${item.sender.full_name} edit chat photo`,
      })
      continue
    }

    if (item.action && item.action._ == 'MessageActionContactSignUp') {
      msgs.push({
        ...c,
        msg: `${item.sender.full_name} has joined to Telegram`,
      })
      continue
    }

    if (item.action && item.action._ == 'MessageActionSetMessagesTTL') {
      const period = moment.duration(item.action.period, 'seconds').humanize()
      const msg =
        item.action.period === 0
          ? `${item.sender.full_name} disable self-destruct timer for all chats`
          : `${item.sender.full_name} enable self-destruct timer for all chats after ${period}`

      msgs.push({
        ...c,
        msg,
      })
      continue
    }

    if (item.media && item.media._ == 'MessageMediaPhoto') {
      let pic = null
      item.media.photo.sizes.forEach((p) => {
        if (p.bytes) pic = p.bytes
      })

      msgs.push({
        ...c,
        msg: item.message,
        photo_id: item.media.photo.id,
        photo: pic,
      })
      continue
    }

    if (item.media && item.media._ == 'MessageMediaDocument') {
      const mediaAttrs = item.media.document?.attributes.find(
        (k) => k.file_name,
      )

      msgs.push({
        ...c,
        msg: item.message,
        file_id: item.media.document.id,
        file: `${mediaAttrs?.file_name ?? ''} (${
          item.media.document.mime_type
        })`,
      })

      continue
    }

    const reactions = []
    if (item.reactions?.recent_reactions) {
      item.reactions.recent_reactions.forEach((i) => {
        reactions.push({
          emoticon: i.reaction.emoticon, user: {
            id: i.peer_id.user_id,
            first_name: i.peer_info.first_name,
            last_name: i.peer_info.last_name,
            username: i.peer_info.username,
          }
        })
      })
    }

    if (item.message && item.message.length > 0) {
      msgs.push({
        ...c,
        msg: item.message,
        reactions
      })
    }
  }

  return msgs.reverse()
}
