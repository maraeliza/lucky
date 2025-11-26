"use client";
import {
  Box,
  Heading,
  Icon,
  useBreakpointValue,
  Center,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { FaExchangeAlt } from "react-icons/fa";
import { useState } from "react";

import LoginComponent from "./login";
import RegisterComponent from "./register";

const frostedGlassStyle = {
  bg: "rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "20px",
};

const backgroundImageSrc = "/imgs/login/bg.jpg";

const LoginScreen: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => setIsLogin(!isLogin);
  
  return (
    <Box
      position="relative"
      w="100vw"
      h="100vh"
      overflow={"hidden"}
      bgColor={"#A6F6AF"}
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        backgroundImage={`url(${backgroundImageSrc})`}
        backgroundSize="cover"
        backgroundPosition="center"
        filter="blur(5px)"
        opacity="0.4"
        zIndex="0"
      />
      <Center
        w="100vw"
        h="100vh"
        bg="transparent"
        p={4}
        position="relative"
        zIndex="1"
      >
        <SimpleGrid
          columns={isMobile ? 1 : 2}
          spacing={0}
          sx={frostedGlassStyle}
          w={isMobile ? "95%" : "800px"}
          h={isMobile ? "auto" : "600px"}
          overflow="hidden"
        >
          <VStack
            p={8}
            bg="rgba(255, 255, 255, 0.7)"
            color="gray.700"
            justify="center"
            align="start"
            spacing={6}
            position="relative"
            borderRight={
              isMobile ? "none" : "1px solid rgba(255, 255, 255, 0.3)"
            }
          >
            <Heading size="lg" mb={4} color="gray.700" fontWeight="bold">
              {isLogin ? "BEM VINDO" : "CRIE SUA CONTA"}
            </Heading>

            <Center
              position={"absolute"}
              top="50%"
              right={isMobile ? "50%" : -5}
              transform={isMobile ? "translate(50%, 50%)" : "translateY(-50%)"}
              zIndex={10}
              w="35px"
              h="35px"
              borderRadius="full"
              bg="white"
              border="1px solid"
              borderColor="gray.300"
              boxShadow="md"
              cursor="pointer"
              onClick={toggleForm}
            >
              <Icon as={FaExchangeAlt} color="gray.500" w={4} h={4} />
            </Center>
          </VStack>

          {isLogin ? (
            <LoginComponent />
          ) : (
            <RegisterComponent setIsLogin={setIsLogin} />
          )}
        </SimpleGrid>
      </Center>
    </Box>
  );
};

export default LoginScreen;
