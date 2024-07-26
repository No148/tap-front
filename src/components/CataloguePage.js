import AddProjectContent from '@/components/AddProjectContent'
import FavGames from '@/components/catalogue/FavGames'
import ListGames from '@/components/catalogue/ListGames'
import RandomBox from '@/components/catalogue/RandomBox'
import UserInfo from '@/components/catalogue/UserInfo'
import { getHeaders } from '@/helpers/utils'
import { Box, Card, CardActionArea, Fade, IconButton } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'

const AddGameCard = ({ handleClick }) => {
  return (
    <Card
      sx={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '109px',
        borderRadius: 3,
        bgcolor: 'rgba(175, 175, 175, 0.05)',
        '&::after': {
          zIndex: -1,
          content: '""',
          position: 'absolute',
          top: 30,
          left: 10,
          width: 90,
          height: 40,
          borderRadius: '100%',
          background: 'rgba(233, 176, 93, 0.5)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(30px)',
          transform: 'rotate(136deg)',
        },
      }}
    >
      <CardActionArea
        onClick={() => {
          handleClick?.(true)
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          columnGap: 2,
          width: '100%',
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            width: 60,
            height: 60,
          }}
        >
          <img
            src={`/images/game.png`}
            style={{
              width: 'inherit',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        </Box>
        <Box flexBasis={'85%'} justifySelf={'center'}>
          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#FFFFFF',
              textAlign: 'left',
              textTransform: 'uppercase',
            }}
          >
            <FormattedMessage id="catalogue.add_game" />
          </Typography>
        </Box>
        <IconButton
          sx={{
            flexBasis: '10%',
            ml: 'auto',
            py: '3px',
            height: '34px',
            width: '34px',
            color: '#171717',
            borderRadius: '100%',
            '&:hover': {
              backgroundColor: 'unset',
            },
          }}
        >
          <img src={'/images/btn-plus.svg'} />
        </IconButton>
      </CardActionArea>
    </Card>
  )
}

const CataloguePage = ({ list, special, balance }) => {
  const [favList, setFavList] = useState([])
  const [extList, setExtList] = useState(list)
  const [openAddProject, setOpenAddProject] = useState(false)
  const [activeTab, setActiveTab] = useState('AllGames')

  const [fadeIn, setFadeIn] = useState(true)

  const handleTabChange = (tab) => {
    setFadeIn(false)
    setTimeout(() => {
      setActiveTab(tab)
      setFadeIn(true)
    }, 100)
  }

  const loadFavList = async () => {
    const c = window.localStorage.getItem('chat_id') || false

    const response = await fetch(`/api/fav-games/?id=${c}`, {
      method: 'GET',
      headers: getHeaders(),
    })

    if (!response.ok) {
      return false
    }
    const data = await response.json()
    if (data.error) {
      return
    }
    setFavList(data)
    const m = {}
    data.forEach((i) => {
      m[i._id] = true
    })

    const p = list.map((i) => {
      return {
        ...i,
        favorite: m[i._id] || false,
      }
    })
    setExtList(p)
  }

  const addFavorite = async (id) => {
    const c = window.localStorage.getItem('chat_id') || false

    const response = await fetch(`/api/save-fav-game/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ project_id: id, user_id: c }),
    })

    if (!response.ok) {
      return false
    }
    const data = await response.json()
    if (data.error) {
      return
    }

    loadFavList() // reload and update list
  }

  const removeFavorite = async (id) => {
    const c = window.localStorage.getItem('chat_id') || false

    const response = await fetch(
      `/api/delete-fav-game/?id=${c}&game_id=${id}`,
      {
        method: 'GET',
        headers: getHeaders(),
      },
    )

    if (!response.ok) {
      return false
    }
    const data = await response.json()
    if (data.error) {
      return
    }

    loadFavList() // reload and update list
  }

  useEffect(() => {
    loadFavList()
  }, [])

  if (openAddProject) {
    return (
      <AddProjectContent
        mode="catalogue"
        onClose={() => {
          setOpenAddProject(false)
        }}
      />
    )
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      rowGap={2}
    >
      <UserInfo
        balance={balance}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        favoritesCount={favList.length}
        gamesCount={extList.length}
      />

      <AddGameCard handleClick={setOpenAddProject} />

      <Fade in={fadeIn} timeout={100}>
        <Box>
          {activeTab === 'Favorites' && (
            <FavGames games={favList} removeFavorite={removeFavorite} />
          )}
          {activeTab === 'AllGames' && (
            <ListGames
              games={extList}
              addFavorite={addFavorite}
              removeFavorite={removeFavorite}
            />
          )}
        </Box>
      </Fade>

      <Box display="flex" columnGap={1} flexBasis={'50%'} width={'100%'}>
        <RandomBox
          title="Most popular"
          data={special && special[1] ? special[1] : false}
          bg={'linear-gradient(180deg, #0193FE 0%, #59BCF0 100%)'}
        />
        <RandomBox
          title="Recommended"
          data={special && special[2] ? special[2] : false}
          bg={
            'linear-gradient(67.74deg, #C973F1 3.46%, #FB7AA1 45.54%, #FFB57A 96.97%)'
          }
        />
      </Box>
      <br />
      <br />
      <br />
    </Box>
  )
}

export default CataloguePage
