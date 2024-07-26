import React, { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { formatInt } from '@/helpers/formatter';

const commonBoxStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 1,
  fontSize: '12px',
  fontWeight: 500,
  color: '#fff',
  p: 0.7,
  borderRadius: 2,
  columnGap: 1,
  transition: 'background-color 100ms ease-in-out',
  WebkitTapHighlightColor: 'transparent',
  WebkitTouchCallout: 'none',
  WebkitUserSelect: 'none',
  KhtmlUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  userSelect: 'none',
};

const UserInfo = ({ balance, activeTab, setActiveTab, gamesCount, favoritesCount }) => {
  const tabs = useMemo(() => [
    { icon: 'fav.png', msId: 'catalogue.favorites', id: 'Favorites', count: favoritesCount },
    { icon: 'game.png', msId: 'catalogue.allGames', id: 'AllGames', count: gamesCount }
  ], [gamesCount, favoritesCount]);

  const handleActive = (name) => {
    setActiveTab(name);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        gap: 1,
      }}
    >
      <Box
        sx={{
          ...commonBoxStyles,
          backgroundColor: 'rgba(175, 175, 175, 0.05)',
        }}
      >
        <img
          src={`/images/btc-mini.png`}
          style={{ width: '15px' }}
        />
        {formatInt(balance)}
      </Box>

      {tabs.map((tab) => (
        <Box
          key={tab.id}
          sx={{
            ...commonBoxStyles,
            backgroundColor: activeTab === tab.id ? 'rgba(193, 168, 117, 1)' : 'rgba(175, 175, 175, 0.05)',
            cursor: 'pointer',
          }}
          onClick={() => handleActive(tab.id)}
        >
          <img
            src={`/images/${tab.icon}`}
            style={{ width: '15px' }}
          />
          <FormattedMessage id={tab.msId} /> ({tab.count})
        </Box>
      ))}
    </Box>
  );
};

export default UserInfo;
