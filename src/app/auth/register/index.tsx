"use client";
import {
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  VStack,
  Icon,
  FormControl,
  FormErrorMessage,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import { FaUser, FaEnvelope, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutationRegister } from "@/hooks/login/useMutationRegister";
import { FormRegister, schemaRegister } from "@/utils/schema";

export default function RegisterComponent({
  setIsLogin,
}: {
  setIsLogin: (value: boolean) => void;
}) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);
  const handleShowConfirmClick = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const toast = useToast();
  const mutationRegister = useMutationRegister();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormRegister>({
    resolver: zodResolver(schemaRegister),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormRegister> = async (data) => {
    await mutationRegister.mutateAsync(data, {
      onSuccess: () => {
        toast({
          title: "Registro concluído!",
          description: "Conta criada com sucesso.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsLogin(true);
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
        REGISTRAR
      </Text>

      <Heading size="lg" fontWeight="extrabold" mb={4} color="gray.700">
        CRIE SUA CONTA
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} w="100%">
          <FormControl isInvalid={!!errors.name}>
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none" h="100%">
                <Icon as={FaUser} color="gray.600" />
              </InputLeftElement>
              <Input
                placeholder="Nome"
                _placeholder={{ color: "gray.500" }}
                bg="rgba(255, 255, 255, 0.7)"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.5)"
                borderRadius="full"
                h="45px"
                fontSize="sm"
                boxShadow="sm"
                {...register("name")}
              />
            </InputGroup>
            <FormErrorMessage fontSize="xs" ml={4} color="red.500">
              {errors.name?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.email}>
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none" h="100%">
                <Icon as={FaEnvelope} color="gray.600" />
              </InputLeftElement>
              <Input
                placeholder="E-mail"
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
              {errors.email?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.phone}>
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none" h="100%">
                <Icon as={FaPhone} color="gray.600" />
              </InputLeftElement>
              <Input
                placeholder="Telefone"
                _placeholder={{ color: "gray.500" }}
                bg="rgba(255, 255, 255, 0.7)"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.5)"
                borderRadius="full"
                h="45px"
                fontSize="sm"
                boxShadow="sm"
                {...register("phone")}
              />
            </InputGroup>
            <FormErrorMessage fontSize="xs" ml={4} color="red.500">
              {errors.phone?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none" h="100%">
                <LockIcon color="gray.600" />
              </InputLeftElement>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
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
              {errors.password?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.confirmPassword}>
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none" h="100%">
                <LockIcon color="gray.600" />
              </InputLeftElement>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar Senha"
                _placeholder={{ color: "gray.500" }}
                bg="rgba(255, 255, 255, 0.7)"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.5)"
                borderRadius="full"
                h="45px"
                fontSize="sm"
                boxShadow="sm"
                paddingRight="4.5rem"
                {...register("confirmPassword")}
              />
              <InputRightElement width="4.5rem" h="100%">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={handleShowConfirmClick}
                  bg="transparent"
                  _hover={{ bg: "rgba(0,0,0,0.05)" }}
                  p={0}
                  w="100%"
                >
                  <Icon
                    as={showConfirmPassword ? FaEyeSlash : FaEye}
                    color="gray.600"
                    w={4}
                    h={4}
                  />
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage fontSize="xs" ml={4} color="red.500">
              {errors.confirmPassword?.message}
            </FormErrorMessage>
          </FormControl>
        </VStack>

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
          Registrar
        </Button>
      </form>
    </VStack>
  );
}
