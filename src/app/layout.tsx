"use client";
import "./globals.css";
import { ChakraProviderClient } from "../context/ChakraProvider";
import Navbar from "@/components/my-ui/Navbar";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { CartProvider } from "@/context/CartProvider";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    if (!isPageLoaded) {
      setIsPageLoaded(true);
    }
  }, []);
  if (!isPageLoaded) return <></>;
  return (
    <html lang="en">
      <body>
        <ChakraProviderClient>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <Box
                as="main"
                minH="100vh"
                w="full"
                minW="100vw"
                mx="auto"
                bg="gray.50"
                color="gray.800"
              >
                {children}
              </Box>
            </CartProvider>
          </AuthProvider>
        </ChakraProviderClient>
      </body>
    </html>
  );
}
