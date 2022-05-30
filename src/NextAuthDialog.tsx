import React, { useEffect } from 'react';
import {
  AuthDialog,
  AuthDialogProps,
  ProviderConfig,
} from './AuthDialog';

export type NextAuthDialogProps = AuthDialogProps & {
  /**
   * Disable sorting of providers by name when rendering their buttons.
   */
  disableSortByName?: boolean;
  /**
   * The endpoint of NextAuth server. Defaults to `/api/auth/providers`.
   */
  url?: string;
}

export function NextAuthDialog(props: NextAuthDialogProps) {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [providers, setProviders] = React.useState<Record<string, ProviderConfig>>();
  const [error, setError] = React.useState<string>();

  useEffect(() => {
    const url = props.url || '/api/auth/providers';

    const fetchData = async () => {
      const res = await fetch(url, {
        method: 'GET',
      });
      const json = await res.json();

      const sorted = props.disableSortByName ? json : Object.keys(json)
        .sort((a, b) => json[a].name.localeCompare(json[b].name))
        .reduce((acc, key) => ({
          ...acc,
          [key]: json[key],
        }), {});

      const filtered = Object.keys(sorted).reduce((acc, key) => {
        if (['email', 'oauth'].includes(sorted[key].type)) {
          return {
            ...acc,
            [key]: sorted[key],
          };
        }
        return acc;
      }, {});

      setProviders(filtered);
    };

    fetchData()
      .catch((err) => {
        setError(`Error loading providers: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, [props.url, props.disableSortByName]);

  return (
    <AuthDialog
      loading={loading}
      providers={providers}
      error={error}
      {...props}
    />
  );
}
