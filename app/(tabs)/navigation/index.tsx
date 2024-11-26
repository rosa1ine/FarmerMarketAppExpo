import { Stack } from 'expo-router';

export default function Navigation() {
  return (
    <Stack>
      {/* Auth Screens */}
      <Stack.Screen name="authentification/login" options={{ title: 'Login' }} />
      <Stack.Screen name="authentification/register" options={{ title: 'Register' }} />
      <Stack.Screen name="authentification/registerFarmer" options={{ title: 'Register as Farmer' }} />
      <Stack.Screen name="authentification/registerBuyer" options={{ title: 'Register as Buyer' }} />

      {/* Buyer Screens */}
      <Stack.Screen name="buyer/index" options={{ title: 'Buyer Dashboard' }} />
      <Stack.Screen name="buyer/ProductDetail" options={{ title: 'Product Detail' }} />
      <Stack.Screen name="buyer/BuyerCart" options={{ title: 'Buyer Cart' }} />
      <Stack.Screen name="buyer/SearchNavBar" options={{ title: 'Search' }} />


      {/* Farmer Screens */}
      <Stack.Screen name="farmer/index" options={{ title: 'Farmer Dashboard' }} />
      <Stack.Screen name="farmer/AddProduct" options={{ title: 'Add Product' }} />
      <Stack.Screen name="farmer/FarmerProfileStart" options={{ title: 'Profile' }} />
      <Stack.Screen name="farmer/FarmerEditProfile" options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="farmer/EditProduct" options={{ title: 'Edit Product' }} /> {/* Add this */}
    </Stack>
  );
}
