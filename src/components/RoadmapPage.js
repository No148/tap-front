import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material'

const roadmapData = [
  {
    quarter: 'Q2 2024',
    items: [
      'Beta Launch Lead Generation/ 1000000 users of SecretPad Bot',
      'Beta tools for Telegram marketing',
      'NFT for early users',
    ],
  },
  {
    quarter: 'Q3 2024',
    items: [
      'Decentralized launchpad (only for mid- and senior-level investors)',
      'TON projects are launched first',
      '1000+ Partnership announcements',
    ],
  },
  {
    quarter: 'Q4 2024',
    items: [
      '1 mln SecretPad Bot community',
      'Airdrop for 100000 early users',
      'Allocation according the amount of PadBot tokens',
      'Public Launch for Secret Launchpad',
    ],
  },
  {
    quarter: 'Q1 2025',
    items: [
      'Listing on Tier 1 exchanges: Kucoin, Huobi , Okx',
      '10,000,000 community',
      'Game mechanics for SecretPad Bot',
      'Wallet - in - game implementation',
      'App Store/ Google Play release',
    ],
  },
  {
    quarter: 'Q1 2025',
    items: [
      'Listing on Binance',
      'PadBot token is one of TOP 100 CMC tokens (according to the Market Cap size)',
    ],
  },
];

const RoadmapPage = () => {
  return (
    <List sx={{overflow: 'hidden'}}>
      {roadmapData.map((quarter, index) => (
        <React.Fragment key={index}>
          <ListItem sx={{ pb: 0, pt:2 }}>
            <img src={`/icons/${index === 0 ? 'roadmap' : 'roadmap-dark'}.png`} alt="roadmap" style={{width:'16px',height:'16px'}}/>
            <ListItemText
              primary={
              <Typography sx={{ml: 2, fontSize: 14, fontWeight: 800,
                color: index === 0 ? 'primary.main' : 'rgba(255, 255, 255, 0.2)',
              }} variant="h6">
                {quarter.quarter}
            </Typography>}
            />
          </ListItem>
          {quarter.items.map((item, itemIndex) => (
            <ListItem key={itemIndex} sx={{ ml: 4, py: 0 }}>
              <ListItemText
                sx={{
                  my: '1px',
                  ...(index === 0 ? {} : {
                    color: 'rgba(255, 255, 255, 0.2)',
                  }),
              }}
                primary={
                  <Typography variant="body1" sx={{fontSize: 12, lineHeight: 1}}>
                    <span style={{ marginRight: '8px' }}>•</span>
                    {item}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </React.Fragment>
      ))}
    </List>
  );
}

export default RoadmapPage