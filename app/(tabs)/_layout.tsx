import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Welcome' }} />
      <Stack.Screen
        name="authentification/login"
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name="authentification/register"
        options={{ title: 'Register' }}
      />
    </Stack>
  );
}
