import React from 'react';
import { Typography, Box, styled } from '@mui/material';
import { formatCurrencySmart, formatInt } from '@/helpers/formatter';


const StyledImg = styled('img')(({}) => ({}));

const CoinRewardDisplay = ({
  coinSx,
  coinsTextSx,
  plusSx,
  amount,
  plus=false,
  formatLArgeNum=true,
  totalAmount
}) => {

  return (
    <>
      {plus ? <Typography component="span" paddingRight={0.5} sx={plusSx}>+</Typography> : ''}
      <StyledImg
        src={'/icons/golden-toncoin.png'}
        sx={coinSx}
      />
      &nbsp;
      <Typography
        display="inline-flex"
        align="center"
        fontSize="inherit"
        fontWeight="inherit"
        fontFamily="inherit"
        whiteSpace="nowrap"
        sx={coinsTextSx}
        component="span">
          {
            totalAmount
            ? `${formatInt(amount)}/${formatInt(totalAmount)}`
            : formatLArgeNum ? formatCurrencySmart(amount) : formatInt(amount)
          }
          &nbsp;$COINs
      </Typography>
    </>
  );
};

export default CoinRewardDisplay;
