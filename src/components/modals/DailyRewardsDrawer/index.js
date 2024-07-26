import React, { useCallback, useMemo } from 'react';
import {
  SwipeableDrawer,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import styled from '@emotion/styled';
import { FormattedMessage } from 'react-intl';
import { formatInt } from '@/helpers/formatter';

const MuiButton = styled(Button)(({ sx }) => ({
  ...sx,
  width: '100%',
  height: 64,
  textTransform: 'capitalize',
  color: '#171717',
  fontSize: 18,
  fontWeight: 700,
  borderRadius: 10,
  backgroundImage:
    'linear-gradient(76.82deg, #576265 11.6%, #9EA1A1 25.31%, #848B8A 48.06%, #576265 55.72%, #576265 77.23%, #757A7B 85.34%, #576265 91.31%)',
  backgroundColor: 'rgba(193, 168, 117, 1)',
  backgroundBlendMode: 'overlay',
  boxShadow: '4px 6px 4px 0px rgba(0, 0, 0, 0.34)',
  '&:hover': {
    backgroundColor: 'rgba(193, 168, 117, 1)',
  },
}));

const MuiImage = styled('img')(({ sx }) => ({ ...sx }));

const CardStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '16px',
  background: 'rgba(175, 175, 175, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
};

const CardStyleActive = {
  ...CardStyle,
  position: 'relative',
  overflow: 'hidden',
  border: 'none',
  backgroundImage: 'linear-gradient(118.24deg, rgba(130, 108, 65, 0.3) 18.88%, rgba(253, 253, 186, 0.3) 40.48%, rgba(130, 108, 65, 0.3) 70.31%)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '16px',
    padding: '1px',
    background: 'linear-gradient(118.24deg, #826C41 18.88%, #FDFDBA 40.48%, #826C41 70.31%)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'destination-out',
    maskComposite: 'exclude',
  },
};

const TypographyStyle = {
  fontFamily: 'Roboto',
  fontSize: '17px',
  fontWeight: 400,
  lineHeight: '16.41px',
  textAlign: 'center',
  opacity: 0.5,
};

const status = {
  unlocked: 1,
  active: 2,
  locked: 3,
}

const RewardCard = ({ reward, progress, claimable }) => {
  const rewardCurrentStatus = useMemo(() => {
    if (reward.day === progress && claimable) {
      return status.active
    } 
    
    if (reward.day <= progress) {
      return status.unlocked
    } else {
      return status.locked
    }
  }, [progress, reward, claimable])

  const iconSrc = useMemo(() => {
    switch (rewardCurrentStatus) {
      case status.active:
        return '/icons/tasks/golden-coin.png'
      case status.unlocked:
        return '/icons/tasks/golden-check.png'
      default:
        return '/icons/tasks/silver-lock.png'
    }
  }, [rewardCurrentStatus])

  const isUnlocked = useMemo(() => rewardCurrentStatus === status.active, [rewardCurrentStatus])

  return (
  <Grid item xs={4}>
    <Card sx={ isUnlocked ? CardStyleActive : CardStyle}>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          placeItems: 'center',
          maxHeight: 115,
          pt: 1.5,
          gap: 0.5,
        }}
      >
        <Typography sx={{ ...TypographyStyle, fontSize: 14 }}>
          <FormattedMessage id='tasks.day' />
          {' '}
          {reward.day}
        </Typography>
        <MuiImage width={50} src={iconSrc} />
        <Typography sx={TypographyStyle}>{formatInt(reward.amount)}</Typography>
      </CardContent>
    </Card>
  </Grid>
)};

const DailyRewardsDrawer = React.memo(({ dailyReward, open, toggleDrawer, handleClaim }) => {
  const handleToggleDrawer = useCallback(
    (isOpen) => toggleDrawer(isOpen),
    [toggleDrawer]
  );

  const rewards = useMemo(() => (
    Object.entries(dailyReward?.daily_rewards ?? {}).map(([key, value]) => ({id: key, day: +key, amount: value}))
  ), [dailyReward])

  const handleClaimButton = () => {
    if (dailyReward.status === 'claimable') {
      handleClaim(dailyReward)
    }

    handleToggleDrawer(false)
  }

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={() => handleToggleDrawer(false)}
      onOpen={() => handleToggleDrawer(true)}
      PaperProps={{
        sx: {
          fontFamily: 'Roboto',
          height: '100vh',
        },
      }}
    >
      <IconButton
        onClick={() => handleToggleDrawer(false)}
        size="large"
        sx={{
          zIndex: 99,
          marginLeft: 'auto',
          position: 'absolute',
          right: 10,
        }}
      >
        <Close sx={{ color: '#fff' }} />
      </IconButton>
      <Box
        sx={{
          height: '100vh',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundImage: 'url(/images/daily-reward-bg.jpg)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ pb: 1, overflowY: 'auto', height: '100%' }}>
          <Box textAlign="center">
            <MuiImage
              sx={{
                marginTop: 10,
              }}
              src="/icons/tasks/golden-calendar.png"
              alt="Icon"
            />
            <Typography
              fontFamily="Roboto"
              variant="h4"
              fontWeight="bold"
              mt={0.7}
              fontSize={29}
            >
              <FormattedMessage id='tasks.dailyReward' />
            </Typography>
            <Typography
              fontFamily="Roboto"
              variant="h5"
              fontWeight="bold"
              mt={1}
              fontSize={18}
            >
              <FormattedMessage id='tasks.loginEveryDay' />
            </Typography>
          </Box>
          <Grid mt={1} container spacing={1.4} sx={{ px: 2 }}>
            {rewards.map((reward, i) => (
              <RewardCard
                key={reward}
                element={i}
                progress={dailyReward.progress}
                claimable={dailyReward.status === 'claimable'}
                reward={reward} />
            ))}
            <MuiButton
              sx={{ ml: 1.4, mt: 1.4 }}
              onClick={handleClaimButton}
            >
              {
                dailyReward?.status === 'claimable'
                ? <FormattedMessage id='tasks.claim' /> 
                : <FormattedMessage id='tasks.comeBackTomorrow' /> 
              }
            </MuiButton>
          </Grid>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
});

export default DailyRewardsDrawer;
