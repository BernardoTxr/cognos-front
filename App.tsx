import React from 'react';
import Navigation from "./src/navegation";
import { AuthProvider } from "./src/context/AuthContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from "expo-font";
import { Fonts } from "./src/themes/fonts";

const queryClient = new QueryClient();

export default function App() {
  const [loaded] = useFonts({
    [Fonts.regular]: require("./src/assets/fonts/Loos_Normal_Regular.otf"),
    [Fonts.medium]: require("./src/assets/fonts/Loos_Normal_Medium.otf"),
    [Fonts.bold]: require("./src/assets/fonts/Loos_Normal_Bold.otf"),
    [Fonts.light]: require("./src/assets/fonts/Loos_Normal_Light.otf"),
    [Fonts.extraLight]: require("./src/assets/fonts/Loos_Normal_Extra_Light.otf"),
    [Fonts.thin]: require("./src/assets/fonts/Loos_Normal_Thin.otf"),
    [Fonts.black]: require("./src/assets/fonts/Loos_Normal_Black.otf"),
});

  if (!loaded) {
    return null;
  }
  
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Navigation />
      </QueryClientProvider>
    </AuthProvider>
  );
}