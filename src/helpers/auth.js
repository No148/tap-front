const whitelist = [
  'angelika_erhan',
  'natalya_le',
  'marinappl',
  'frogwithgreenbelly',
  'kari_ee',
  'manizhaash',
  'malikadlt',
  'adiyaturgan',
  'eniriya',
  'annyann8',
  'laylith',
  'violet_888',
  'eliz_sidorova',
  'ecaterina_c',
  'soofvee',
  'danamaralkyzy',
  'olyaneko',
  'kuznetsova765',
  'yuliia_bobkova',
  'albinabychkova',
  'luyms',
  'yulia_petrushenko',
  'eva935',
  'gbmikaelian',
  'tgaru',
  'fedor_platinum',
  'katjaezerskaja',
  'pshenia',
  'ollzhas',
  'no148',
  'artemstarchkov',
  'khayrullosss',
  'tonydzi',
  'platinumvc',
  'defigemlady',
  'ksplat',
  'katepla',
  'alejandracastanedaj',
  'pepehouse',
  'clsimon',
  'sfnetwrk',
  'jzuckerman1984',
  'emburns',
  'ryanape',
  'dudov_s',
  'martina_liii',
  'emma_rp',
  'marykhod',
  'alinakral',
  'laylavc',
  'thomas_russell_jr',
  'jacob_cto',
  'anthonyyurkov',
  'safronovantony',
]

export const emailWhitelist = {
  'dzyatkovskiy.a2@gmail.com': { name: 'Anton', username: 'tonydzi' },
  'angelika.erhan@gmail.com': { name: 'Angelika', username: 'angelika_erhan' },
  'nalevalesele@gmail.com': { name: 'Natalia', username: 'natalya_le' },
  'nabugornova.polina2000@gmail.com': {
    name: 'Polina',
    username: 'frogwithgreenbelly',
  },
  'karinazelenina047@gmail.com': { name: 'Karina', username: 'kari_ee' },
  'zhasmine214@gmail.com': { name: 'Manizha', username: 'manizhaash' },
  'malika.daulett@gmail.com': { name: 'Malika', username: 'malikadlt' },
  'adiyaturgan13@gmail.com': { name: 'Adiya', username: 'adiyaturgan' },
  'queenofowlland@gmail.com': { name: 'Alina', username: 'eniriya' },
  'anmays98@gmail.com': { name: 'Anna', username: 'annyann8' },
  'viola.balasanova@gmail.com': { name: 'Viola', username: 'violet_888' },
  'esidorova90@gmail.com': { name: 'Liza', username: 'eliz_sidorova' },
  'ecaterina000031@gmail.com': { name: 'Kate', username: 'ecaterina_c' },
  'sofasemenova909@gmail.com': { name: 'Sofia', username: 'soofvee' },
  'olyanekrasova14@gmail.com': { name: 'Olya', username: 'olyaneko' },
  'tatanakuznecova32567@gmail.com': {
    name: 'Tatiana',
    username: 'kuznetsova765',
  },
  'bobkova.juliya24@gmail.com': { name: 'Julia', username: 'yuliia_bobkova' },
  'laylibeng@gmail.com': { name: 'Lali', username: 'laylith' },
  'bychkova.solnyshkina@gmail.com': {
    name: 'Albina',
    username: 'albinabychkova',
  },
  'lybovkrada@gmail.com': { name: 'Lyubov', username: 'luyms' },
  'yauheniya.chaikouskaya@gmail.com': { name: 'Evgenia', username: 'eva935' },
  'dudov.al16@gmail.com': { name: 'Alex', username: 'dudov_s' },
  'g.b.mikaelian@gmail.com': { name: 'Garik', username: 'gbmikaelian' },
  'tgagoldbox@gmail.com': { name: 'Gleb', username: 'tgaru' },
  'fedor.shopping@gmail.com': { name: 'Fedor', username: 'fedor_platinum' },
  'ezersk@gmail.com': { name: 'Kate', username: 'katjaezerskaja' },
  'olzhas.kuanov@gmail.com': { name: 'Olzhas', username: 'ollzhas' },
  'whono1knows@gmail.com': { name: 'Denis', username: 'no148' },
  'artemstarchkov@gmail.com': { name: 'Artem', username: 'artemstarchkov' },
  'rustamov.khayrullo@gmail.com': {
    name: 'Khayrullo',
    username: 'khayrullosss',
  },
  'work.antonyurkov@gmail.com': { name: 'Anton', username: 'anthonyyurkov' },
  'm.ozheshko@gmail.com': {
    name: 'Maria Khod',
    username: 'marykhod',
  },
  'alinakralechkina@gmail.com': {
    name: 'Alina Kral',
    username: 'alinakral',
  },
  'kataliya.ad.moscow21@gmail.com': {
    name: 'Ekaterina',
    username: 'pshenia',
  },
  'slevindiwq@gmail.com': {
    name: 'Anthony',
    username: 'safronovantony',
  },
}

export const SYNTHETICS_LIST = [
  'any', // DEFAULT: from any synthetic
  'TODO_LOAD_IT_FROM_MONGO'
]

export function checkWhitelist(username) {
  if (!username) return false
  return whitelist.includes(username.toLowerCase())
}

export function checkEmailWhitelist(mail) {
  if (!mail || !emailWhitelist[mail]) return false

  return emailWhitelist[mail]
}
