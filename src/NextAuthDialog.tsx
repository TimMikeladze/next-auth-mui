import React, { useEffect } from 'react';
import {
  AuthDialog,
  AuthDialogProps,
  ProviderConfig,
} from './AuthDialog';

export type NextAuthDialogProps = AuthDialogProps & {
  /**
   * The endpoint of NextAuth server. Defaults to `/api/auth/providers`.
   */
  url?: string;
  /**
   * Disable sorting of providers by name when rendering their buttons.
   */
  disableSortByName?: boolean;
}

export function NextAuthDialog(props: NextAuthDialogProps) {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [providers, setSetProviders] = React.useState<Record<string, ProviderConfig>>();

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

      setSetProviders(filtered);
    };

    fetchData()
      .catch((err) => {
        throw err;
      })
      .finally(() => setLoading(false));
  }, [props.url, props.disableSortByName]);

  return (
    <AuthDialog
      loading={loading}
      providers={providers}
      {...props}
    />
  );
}
