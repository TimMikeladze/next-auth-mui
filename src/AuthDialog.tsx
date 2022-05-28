import React, { PropsWithChildren } from 'react';
import {
  Box,
  Breakpoint,
  Button,
  ButtonProps,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentProps,
  DialogContentText,
  DialogContentTextProps,
  DialogProps,
  DialogTitle,
  DialogTitleProps,
  Divider,
  IconButton,
  LinearProgress,
  LinearProgressProps,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
  TypographyProps,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Icon, IconProps } from '@iconify/react';
import { signIn } from 'next-auth/react';
import { SignInOptions, SignInResponse } from 'next-auth/react/types';
import { icons } from './icons';

export type OauthProviderConfig = {
  /**
   * Override props passed to provider's button. See @mui/material documentation.
   */
  ButtonProps?: ButtonProps
  /**
   * Override props passed to provider's button's typography. See @mui/material documentation.
   */
  ButtonTypographyProps?: TypographyProps
  /**
   * Override the provider's name when rendering the button.
   */
  label?: string;
  /**
   * Hide the provider names button.
   */
  hideProviderName?: boolean;
  /**
   * Hide the provider icon on button.
   */
  hideProviderIcon?: boolean;
  /**
   * Override props passed to provider's icon. See @iconify/react documentation.
   */
  IconProps?: IconProps;
  /**
   * Override the provider's icon. Can be a @iconify/react icon name or a custom component.
   */
  icon?: string | React.ReactNode;
}

export type EmailProviderConfig = {
  /**
   * Override start icon rendered in the email input field
   */
  startIcon?: React.ReactNode;
  /**
   * Override end icon rendered in the email input field
   */
  endIcon?: React.ReactNode;
  /**
   * Override props passed to the email's input field. See @mui/material documentation.
   */
  TextFieldProps?: TextFieldProps
  /**
   * Override text rendered below the email input field.
   */
  helperText?: string | React.ReactNode;
  /**
   * Override the placeholder text rendered in the email input field.
   */
  placeholder?: string;
}

export type ProviderConfig = OauthProviderConfig & EmailProviderConfig & {
  /**
   * ID of the provider.
   */
  id: string;
  /**
   * Name of the provider. Will be used as the button's label and used when sorting providers.
   */
  name: string;
  /**
   * Type of the provider.
   * Only `email` and `oauth` are supported, all other types will be ignored when rendering fields.
   */
  type: 'oauth' | 'email' | string;
  /**
   * Override sign in options to be passed when calling `signIn`.  See next-auth for documentation
   */
  signInOptions?: SignInOptions;
};

export type AuthDialogProps = PropsWithChildren<{
  /**
   * Controls width of dialog.
   * When breakpoint >= viewport the dialog will be rendered in mobile mode.
   * Defaults to `xs`.
   */
  breakpoint?: Breakpoint
  /**
   * When true the dialog will be open.
   */
  open: boolean
  /**
   * Callback for closing the dialog.
   */
  onClose?: () => void;
  /**
   * See @mui/material documentation
   */
  DialogContentTextProps?: DialogContentTextProps
  /**
   * See @mui/material documentation
   */
  DialogContentProps?: DialogContentProps;
  /**
   * See @mui/material documentation
   */
  DialogTitleProps?: DialogTitleProps;
  /**
   * See @mui/material documentation
   */
  DialogProps?: DialogProps;
  /**
   * See @mui/material documentation
   */
  ButtonProps?: ButtonProps
  /**
   * An object mapping of provider id to provider config.
   */
  providers?: Record<string, ProviderConfig>;
  /**
   * Hide the dialog title. In mobile mode this will hide the close "x" icon.
   */
  hideTitle?: boolean;
  /**
   * Text to display in the dialog title. Empty by default.
   */
  titleText?: string | React.ReactNode;
  /**
   * Text to display between email field and oauth buttons. Defaults to "or".
   */
  dividerText?: string | React.ReactNode;
  /**
   * If true a loading indicator will be displayed in the dialog.
   */
  loading?: boolean;
  /**
   * A custom loading indicator.
   */
  Progress?: React.ReactNode;
  /**
   * Props to pass to the default loading indicator. See @mui/material documentation
   */
  LinearProgressProps?: LinearProgressProps;
  /**
   * See @mui/material documentation
   */
  ButtonTypographyProps?: TypographyProps
  /**
   * Callback runs on a successful sign in.
   */
  onOAuthSignInSuccess?: (response: SignInResponse | undefined) => void;
  /**
   * Callback runs on a failed sign in.
   */
  onOAuthSignInError?: (error: Error) => void;
  /**
   * Props passed to the email input field. See @mui/material documentation
   */
  TextFieldProps?: TextFieldProps;
  /**
   * Custom email validation function.
   */
  isValidEmail?: (email: string) => boolean;
  /**
   * Override default email submission function.
   * This is useful for implementing authentication with a 3rd party API like MagicLink.
   */
  onSubmitEmail?: (email: string) => Promise<void>;
  /**
   * Additional sign in options to be passed when calling `signIn`.  See next-auth for documentation
   */
  signInOptions?: SignInOptions;
  /**
   * Hide the provider names on their buttons.
   */
  hideProviderName?: boolean;
  /**
   * Hide the provider icons on their buttons.
   */
  hideProviderIcon?: boolean;
}>

export function isValidEmail(email: string) {
  if (!email) return false;
  // eslint-disable-next-line no-useless-escape
  const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

export function AuthDialog(props: AuthDialogProps) {
  const theme = useTheme();
  const breakpoint = props.breakpoint || 'xs';
  const mobile = useMediaQuery(theme.breakpoints.down(breakpoint));
  const dividerText = props.dividerText || 'or';
  const Progress = props.Progress
    || <Box sx={{ mb: 2 }}><LinearProgress {...props.LinearProgressProps} /></Box>;
  const noProviders = !props.loading
    && (!props.providers || Object.keys(props.providers || {}).length === 0);
  const emailProviderConfig = props.providers?.email;
  const [email, setEmail] = React.useState<string>('');
  const [validEmail, setValidEmail] = React.useState<boolean>(false);
  const [emailLoading, setEmailLoading] = React.useState<boolean>(false);
  const noDivider = noProviders || (Object.keys(props.providers || {})
    .filter((key) => key !== 'email').length === 0 || !emailProviderConfig);

  const handleClickProvider = async (provider: ProviderConfig) => {
    try {
      const res = await signIn(provider.id, provider.signInOptions || props.signInOptions);
      if (props.onOAuthSignInSuccess) {
        props.onOAuthSignInSuccess(res);
      }
    } catch (err: any) {
      if (props.onOAuthSignInError) {
        props.onOAuthSignInError(err);
      }
    }
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setEmail(event.target.value);
    if (props.isValidEmail) {
      setValidEmail(props.isValidEmail(event.target.value));
    } else {
      setValidEmail(isValidEmail(event.target.value));
    }
  };

  const handleSubmitEmail = async () => {
    setEmailLoading(true);
    try {
      if (props.onSubmitEmail) {
        await props.onSubmitEmail(email);
      } else {
        const options = emailProviderConfig?.signInOptions || props.signInOptions || {};
        options.email = email;
        await signIn('email', options);
      }
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullWidth
      fullScreen={mobile}
      maxWidth={breakpoint}
      {...props.DialogProps}
    >
      {!props.hideTitle && (
        <DialogTitle {...props.DialogTitleProps}>
          {mobile && (
            <IconButton onClick={props.onClose} />
          )}
          {props.titleText}
        </DialogTitle>
      )}
      <DialogContent
        style={{
          paddingTop: theme.spacing(1),
          paddingBottom: !props.hideTitle ? theme.spacing(4) : undefined,
        }}
        {...props.DialogContentProps}
      >
        {props.loading ? Progress : (
          <>
            <DialogContentText {...props.DialogContentTextProps} />
            <Stack spacing={2}>
              {props.children}
              {emailProviderConfig && (
                <TextField
                  required
                  fullWidth
                  type="email"
                  autoFocus
                  value={email}
                  onChange={(e) => handleChangeEmail(e)}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && validEmail) {
                      await handleSubmitEmail();
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
                      <IconButton disabled={!validEmail}>
                        {emailLoading ? (
                          <CircularProgress size={theme.spacing(3)} />
                        ) : (
                          <Icon icon="mdi:send-outline" />
                        )}
                      </IconButton>
                    ),
                  }}
                  placeholder={emailProviderConfig.name || emailProviderConfig.placeholder || 'Email'}
                  helperText={emailProviderConfig.helperText || 'A sign-in link will be sent to your inbox.'}
                  {...props.TextFieldProps}
                  {...emailProviderConfig.TextFieldProps}
                />
              )}
              {noDivider ? null : <Divider>{dividerText}</Divider>}
              {noProviders ? null : Object.values(props.providers || {})
                .filter((provider) => provider.id !== 'email')
                .map((provider: ProviderConfig) => (
                  <Button
                    key={provider.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                    }}
                    size="large"
                    fullWidth
                    variant="contained"
                    onClick={() => handleClickProvider(provider)}
                    {...props.ButtonProps}
                    {...provider.ButtonProps}
                  >
                    <Box sx={{
                      mr: 1.5,
                      mb: -1,
                      width: theme.spacing(4),
                    }}
                    >
                      {(props.hideProviderIcon || provider.hideProviderIcon) ? null : (
                        React.isValidElement(provider.icon) ? provider.icon : (
                          <Icon
                            icon={(provider.icon || icons[provider.id] || 'mdi:login') as string}
                            fontSize={24}
                            {...provider.IconProps}
                          />
                        ))}
                    </Box>
                    <Typography
                      {...props.ButtonTypographyProps}
                      {...provider.ButtonTypographyProps}
                    >
                      {(props.hideProviderName || provider.hideProviderName)
                        ? null
                        : provider.label || provider.name}
                    </Typography>
                  </Button>
                ))}
            </Stack>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
