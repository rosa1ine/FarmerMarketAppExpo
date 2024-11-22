import { Stack } from 'expo-router';

export default function Navigation() {
  return (
    <Stack>
      <Stack.Screen name="auauthentificationth/login" options={{ title: 'Login' }} />
      <Stack.Screen name="authentification/register" options={{ title: 'Register' }} />
      <Stack.Screen name="authentification/registerFarmer" options={{ title: 'Register as Farmer' }} />
      <Stack.Screen name="authentification/registerBuyer" options={{ title: 'Register as Buyer' }} />
      <Stack.Screen name="buyer/index" options={{ title: 'Buyer Dashboard' }} />
      <Stack.Screen name="buyer/ProductDetail" options={{ title: 'Product Detail' }} /> {/* Add this line */}
      <Stack.Screen name="farmer/index" options={{ title: 'Farmer Dashboard' }} />
      <Stack.Screen name="farmer/AddProduct" options={{ title: 'Add Product' }} />
      <Stack.Screen name="farmer/FarmerProfile" options={{ title: 'Farmer Profile' }} />

      
    </Stack>
  );
}
