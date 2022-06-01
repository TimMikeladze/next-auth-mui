import React, { PropsWithChildren } from 'react';
import {
  Box,
  Breakpoint,
  Button,
  ButtonProps,
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
import { EmailField } from './EmailField';

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
   * Override props passed to provider's icon. See @iconify/react documentation.
   */
  IconProps?: IconProps;
  /**
   * Hide the provider icon on button.
   */
  hideProviderIcon?: boolean;
  /**
   * Hide the provider names button.
   */
  hideProviderName?: boolean;
  /**
   * Override the provider's icon. Can be a @iconify/react icon name or a custom component.
   */
  icon?: string | React.ReactNode;
  /**
   * Override the provider's name when rendering the button.
   */
  label?: string;
}

export type EmailProviderConfig = {
  /**
   * Override props passed to the email's input field. See @mui/material documentation.
   */
  EmailFieldProps?: TextFieldProps,
  /**
   * Override end icon rendered in the email input field
   */
  endIcon?: React.ReactNode;
  /**
   * Override text rendered below the email input field.
   */
  helperText?: string | React.ReactNode;
  /**
   * Override the placeholder text rendered in the email input field.
   */
  placeholder?: string;
  /**
   * Override start icon rendered in the email input field
   */
  startIcon?: React.ReactNode;
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
   * Override sign in options to be passed when calling `signIn`.  See next-auth for documentation
   */
  signInOptions?: SignInOptions;
  /**
   * Type of the provider.
   * Only `email` and `oauth` are supported, all other types will be ignored when rendering fields.
   */
  type: 'oauth' | 'email' | string;
};

export type AuthDialogProps = PropsWithChildren<{
  /**
   * See @mui/material documentation
   */
  ButtonProps?: ButtonProps,
  /**
   * See @mui/material documentation
   */
  ButtonTypographyProps?: TypographyProps,
  /**
   * See @mui/material documentation
   */
  DialogContentProps?: DialogContentProps;
  /**
   * See @mui/material documentation
   */
  DialogContentTextProps?: DialogContentTextProps
  /**
   * See @mui/material documentation
   */
  DialogProps?: DialogProps;
  /**
   * See @mui/material documentation
   */
  DialogTitleProps?: DialogTitleProps;
  /**
   * Props passed to the email input field. See @mui/material documentation
   */
  EmailFieldProps?: TextFieldProps;
  /**
   * Props to pass to the default loading indicator. See @mui/material documentation
   */
  LinearProgressProps?: LinearProgressProps;
  /**
   * A custom loading indicator.
   */
  Progress?: React.ReactNode;
  /**
   * Always show the email field regardless if email provider has been configured.
   * This is useful for implementing email auth with a 3rd party api.
   */
  alwaysShowEmailField?: boolean;
  /**
   * Controls width of dialog.
   * When breakpoint >= viewport the dialog will be rendered in mobile mode.
   * Defaults to `xs`.
   */
  breakpoint?: Breakpoint,
  /**
   * Disable autofocus of email field.
   */
  disableEmailAutoFocus?: boolean;
  /**
   * Text to display between email field and oauth buttons. Defaults to "or".
   */
  dividerText?: string | React.ReactNode;
  /**
   * Render error text instead of providers
   */
  error?: string,
  /**
   * Hide the provider icons on their buttons.
   */
  hideProviderIcon?: boolean;
  /**
   * Hide the provider names on their buttons.
   */
  hideProviderName?: boolean;
  /**
   * Hide the dialog title. In mobile mode this will hide the close "x" icon.
   */
  hideTitle?: boolean;
  /**
   * Custom email validation function.
   */
  isValidEmail?: (email: string) => boolean | Promise<boolean>;
  /**
   * If true a loading indicator will be displayed in the dialog.
   */
  loading?: boolean;
  /**
   * Callback for closing the dialog.
   */
  onClose?: () => void;
  /**
   * Callback runs on a failed sign in.
   */
  onOAuthSignInError?: (error: Error) => void;
  /**
   * Callback runs on a successful sign in.
   */
  onOAuthSignInSuccess?: (response: SignInResponse | undefined) => void;
  /**
   * Override default email submission function.
   * This is useful for implementing authentication with a 3rd party API like MagicLink.
   */
  onSubmitEmail?: (email: string) => Promise<void>;
  /**
   * When true the dialog will be open.
   */
  open: boolean,
  /**
   * An object mapping of provider id to provider config.
   */
  providers?: Record<string, ProviderConfig>;
  /**
   * Additional sign in options to be passed when calling `signIn`.  See next-auth for documentation
   */
  signInOptions?: SignInOptions;

  /**
   * Text to display in the dialog title. Empty by default.
   */
  titleText?: string | React.ReactNode;
}>

export function isValidEmail(email: string) {
  if (!email) return false;
  // eslint-disable-next-line no-useless-escape,max-len
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

  const handleChangeEmail = async (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setEmail(event.target.value);
    if (props.isValidEmail) {
      setValidEmail(await props.isValidEmail(event.target.value));
    } else {
      setValidEmail(isValidEmail(event.target.value));
    }
  };

  const handleSubmitEmail = async () => {
    if (emailLoading) return;
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
            <DialogContentText {...props.DialogContentTextProps}>
              {props.error || props.DialogContentProps?.children}
            </DialogContentText>
            <Stack spacing={2}>
              {props.children}
              {(emailProviderConfig || props.alwaysShowEmailField) && (
                <EmailField
                  onSubmitEmail={handleSubmitEmail}
                  onChangeEmail={handleChangeEmail}
                  email={email}
                  emailLoading={emailLoading}
                  emailProviderConfig={emailProviderConfig}
                  validEmail={validEmail}
                  disableAutoFocus={props.disableEmailAutoFocus}
                  TextFieldProps={{
                    ...props.EmailFieldProps,
                    ...emailProviderConfig?.EmailFieldProps,
                  }}
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
