import { Button as MuiButton } from '@mui/material'

import {forwardRef} from 'react';

const Button = forwardRef(({children, ...props}, ref) => {
    return (
        <MuiButton {...props} ref={ref}>
            {children}
        </MuiButton>
    );
});

export default Button;
