"use client";
import {
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Checkbox,
  Icon,
  VStack,
  HStack,
  InputRightElement,
  FormErrorMessage,
  FormControl,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import { FaUser, FaEyeSlash, FaEye } from "react-icons/fa";
import { useMutationLogin } from "@/hooks/login/useMutationLogin";
import { useRouter } from "next/navigation";
import { FormLogin, schemaLogin } from "@/utils/schema";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { setCookie } from "nookies";
import { LoginResponse } from "@/interfaces/common";

export default function LoginComponent() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);
  const mutationLogin = useMutationLogin();
  const { setUser } = useAuth();

  const toast = useToast();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormLogin>({
    resolver: zodResolver(schemaLogin),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const onSubmit: SubmitHandler<FormLogin> = async (data) => {
    await mutationLogin.mutateAsync(data, {
      onSuccess: (res: LoginResponse) => {
        const { access_token, user } = res;
        console.log(user);
        setCookie(null, "uaifoodtoken", access_token, {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });

        setUser(user);

        toast({
          title: "Login Concluído!",
          description: "Autenticação realizada com sucesso.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push(user.role === "ADMIN" ? "/dashboard" : "/market");
      },
    });
  };
  return (
    <VStack
      p={8}
      bg="rgba(197, 222, 172, 0.4)"
      color="gray.700"
      justify="center"
      spacing={6}
      order={isMobile ? 1 : 2}
    >
      <Text
        alignSelf="flex-end"
        fontWeight="bold"
        fontSize="sm"
        color="gray.600"
        letterSpacing="wider"
        textTransform="uppercase"
      >
        LOGAR
      </Text>

      <Heading size="lg" fontWeight="extrabold" mb={4} color="gray.700">
        FAÇA LOGIN
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} w="100%">
          <FormControl isInvalid={!!errors.email}>
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none" h="100%">
                <Icon as={FaUser} color="gray.600" />
              </InputLeftElement>
              <Input
                placeholder="E-MAIL"
                _placeholder={{ color: "gray.500" }}
                bg="rgba(255, 255, 255, 0.7)"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.5)"
                borderRadius="full"
                h="45px"
                fontSize="sm"
                boxShadow="sm"
                {...register("email")}
              />
            </InputGroup>
            <FormErrorMessage fontSize="xs" ml={4} color="red.500">
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none" h="100%">
                <LockIcon color="gray.600" />
              </InputLeftElement>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                _placeholder={{ color: "gray.500" }}
                bg="rgba(255, 255, 255, 0.7)"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.5)"
                borderRadius="full"
                h="45px"
                fontSize="sm"
                boxShadow="sm"
                paddingRight="4.5rem"
                {...register("password")}
              />
              <InputRightElement width="4.5rem" h="100%">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={handleShowClick}
                  bg="transparent"
                  _hover={{ bg: "rgba(0,0,0,0.05)" }}
                  p={0}
                  w="100%"
                >
                  <Icon
                    as={showPassword ? FaEyeSlash : FaEye}
                    color="gray.600"
                    w={4}
                    h={4}
                  />
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage fontSize="xs" ml={4} color="red.500">
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
        </VStack>

        <HStack w="100%" justify="flex-start" mt={2}>
          <Checkbox
            colorScheme="green"
            size="sm"
            color="gray.600"
            borderColor="gray.400"
            {...register("rememberMe")}
          >
            Lembrar de mim
          </Checkbox>
        </HStack>

        <Button
          w="100%"
          size="lg"
          bg="#5E3F43"
          color="white"
          _hover={{ bg: "#4B3236" }}
          borderRadius="full"
          mt={4}
          fontWeight="bold"
          letterSpacing="wider"
          boxShadow="md"
          h="45px"
          fontSize="md"
          type="submit"
          isLoading={isSubmitting}
        >
          Entrar
        </Button>
      </form>
    </VStack>
  );
}
