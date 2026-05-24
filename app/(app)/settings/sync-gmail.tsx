import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Button from '@/components/ui/button';
import Text from '@/components/ui/text';
import { useGmailStatus } from '@/hooks/queries/use-gmail-status';
import {
  disconnectGmailForCurrentUser,
  exchangeGmailAuthCode,
  persistGmailTokensForCurrentUser,
} from '@/lib/services/gmail.service';
import { Colors, Spacing } from '@/constants/theme';

WebBrowser.maybeCompleteAuthSession();

export default function SyncGmailScreen() {
  const queryClient = useQueryClient();
  const { data: connection, isLoading } = useGmailStatus();
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ?? '',
    scopes: ['openid', 'email', 'https://www.googleapis.com/auth/gmail.readonly'],
    responseType: 'code',
    extraParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
  });

  const connectMutation = useMutation({
    mutationFn: persistGmailTokensForCurrentUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['gmail', 'status'] });
      setError(null);
    },
    onError: (err: Error) => setError(err.message),
  });

  const disconnectMutation = useMutation({
    mutationFn: disconnectGmailForCurrentUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['gmail', 'status'] });
      setError(null);
    },
  });

  useEffect(() => {
    if (response?.type !== 'success' || !request) return;

    const run = async () => {
      try {
        setError(null);
        const code = response.params.code;
        const redirectUri = request.redirectUri;
        const codeVerifier = request.codeVerifier;

        if (!code || !redirectUri || !codeVerifier) {
          setError('OAuth response was incomplete');
          return;
        }

        const tokens = await exchangeGmailAuthCode({ code, redirectUri, codeVerifier });
        await connectMutation.mutateAsync(tokens);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gmail connection failed');
      }
    };

    void run();
  }, [response, request, connectMutation]);

  const isBusy = connectMutation.isPending || disconnectMutation.isPending;

  return (
    <ScrollView contentContainerStyle={styles.scroll} contentInsetAdjustmentBehavior="automatic">
      <Text variant="body" muted style={styles.intro}>
        Connect Gmail so the assistant can read recent messages (read-only) and suggest todos. Use{' '}
        <Text variant="body">pnpm start --tunnel</Text> on a physical device so OAuth and API routes
        reach your dev machine.
      </Text>

      {isLoading ? (
        <ActivityIndicator color={Colors.light.primary} />
      ) : connection ? (
        <View style={styles.connected}>
          <Text variant="body" selectable>
            Connected as {connection.email}
          </Text>
          <Text variant="bodySmall" muted selectable>
            Token expires {new Date(connection.expiresAt).toLocaleString()}
          </Text>
          <Button
            label="Disconnect Gmail"
            variant="ghost"
            disabled={isBusy}
            onPress={() => disconnectMutation.mutate()}
          />
        </View>
      ) : (
        <Button
          label="Connect Gmail"
          disabled={!request || isBusy}
          onPress={() => {
            setError(null);
            void promptAsync();
          }}
        />
      )}

      {error ? (
        <Text variant="bodySmall" style={styles.error}>
          {error}
        </Text>
      ) : null}

      {!process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ? (
        <Text variant="bodySmall" muted>
          Set EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID in .env (Web application client from Google Cloud).
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: Spacing.screenPadding,
    gap: Spacing.lg,
  },
  intro: {
    marginBottom: Spacing.sm,
  },
  connected: {
    gap: Spacing.md,
  },
  error: {
    color: Colors.light.error,
  },
});
