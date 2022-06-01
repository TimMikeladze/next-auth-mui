import React from 'react';
import {
  CircularProgress, IconButton, TextField, useTheme, TextFieldProps,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { ProviderConfig } from './AuthDialog';

export type EmailFieldProps = {
  TextFieldProps?: TextFieldProps,
  disableAutoFocus?: boolean,
  email: string;
  emailLoading?: boolean,
  emailProviderConfig?: ProviderConfig,
  onChangeEmail: (email: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onSubmitEmail: () => void;
  validEmail?: boolean
}

export function EmailField(props: EmailFieldProps) {
  const theme = useTheme();
  return (
    <TextField
      required
      fullWidth
      type="email"
      autoFocus={!props.disableAutoFocus}
      value={props.email}
      onChange={(e) => props.onChangeEmail(e)}
      onKeyDown={async (e) => {
        if (e.key === 'Enter' && props.validEmail) {
          await props.onSubmitEmail();
        }
      }}
      InputProps={{
        startAdornment: (
          <IconButton
            disableRipple
            sx={{
              cursor: 'unset',
            }}
          >
            <Icon icon="mdi:email-outline" />
          </IconButton>
        ),
        endAdornment: (
          <IconButton disabled={!props.validEmail} onClick={props.onSubmitEmail}>
            {props.emailLoading ? (
              <CircularProgress size={theme.spacing(3)} />
            ) : (
              <Icon icon="mdi:send-outline" />
            )}
          </IconButton>
        ),
      }}
      placeholder={props.emailProviderConfig?.name || props.emailProviderConfig?.placeholder || 'Email'}
      helperText={props.emailProviderConfig?.helperText || 'A sign-in link will be sent to your inbox.'}
      {...props.TextFieldProps}
      {...props.emailProviderConfig?.EmailFieldProps}
    />
  );
}
