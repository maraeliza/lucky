"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  SimpleGrid,
  useToast,
  FormErrorMessage,
  Spinner,
  InputGroup,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { MaskedInput } from "@/components/my-ui/MaskedInput";
import { normalizeCepNumber, normalizePhoneNumber } from "@/utils/formats";
import { useViaCep } from "@/hooks/utils/getAddressByCEP";
import { useAddUser } from "@/hooks/user/useAdd";
import { LockIcon } from "@chakra-ui/icons";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const addressSchema = z.object({
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  district: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  zipCode: z.string().min(1, "CEP é obrigatório"),
});

const userSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  address: addressSchema,
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  confirmPassword: z.string().min(8, {
    message: "A confirmação de senha deve ter pelo menos 8 caracteres",
  }),
});

export type UserFormData = z.infer<typeof userSchema>;
type Props = {
  isOpen: boolean;
  onClose: () => void;
};
export default function UserCreateModal({ isOpen, onClose }: Props) {
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);
  const handleShowConfirmClick = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const useMutationAdd = useAddUser();

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: {
        street: "",
        number: "",
        district: "",
        city: "",
        state: "",
        zipCode: "",
      },
    },
  });

  const rawZipCode = watch("address.zipCode") || "";
  const zipCode = rawZipCode.replace(/\D/g, "");
  const { data: cepData, isLoading } = useViaCep(
    zipCode.length === 8 ? zipCode : ""
  );

  useEffect(() => {
    if (cepData) {
      setValue("address.street", cepData.logradouro || "");
      setValue("address.district", cepData.bairro || "");
      setValue("address.city", cepData.localidade || "");
      setValue("address.state", cepData.uf || "");
    }
  }, [cepData, setValue]);

  const onSubmit: SubmitHandler<UserFormData> = async (values) => {
    try {
      await useMutationAdd.mutateAsync(values);
      toast({
        title: "Perfil adicionado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch {
      toast({
        title: "Erro ao adicionar perfil",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  console.log(errors);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Perfil</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <Box p={4} bg="white" shadow="md" borderRadius="md">
                <Heading size="md" mb={4}>
                  Informações Pessoais
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isInvalid={!!errors.name}>
                    <FormLabel>Nome</FormLabel>
                    <Input {...register("name")} />
                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" {...register("email")} />
                    <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.phone}>
                    <FormLabel>Telefone</FormLabel>
                    <MaskedInput
                      {...register("phone")}
                      limit={15}
                      mask={normalizePhoneNumber}
                      placeholder="(11) 98765-4321"
                    />
                    <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>
              </Box>
              <Box p={4} bg="white" shadow="md" borderRadius="md">
                <Heading size="md">Segurança</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={5}>
                  <FormControl isInvalid={!!errors.password}>
                    <InputGroup size="md">
                      <InputLeftElement pointerEvents="none" h="100%">
                        <LockIcon color="gray.600" />
                      </InputLeftElement>
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        placeholder="Senha"
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
                </SimpleGrid>
              </Box>

              {/* Endereço */}
              <Box p={4} bg="white" shadow="md" borderRadius="md">
                <Heading size="md" mb={4}>
                  Endereço
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isInvalid={!!errors.address?.zipCode}>
                    <FormLabel>CEP</FormLabel>
                    <MaskedInput
                      {...register("address.zipCode")}
                      limit={9}
                      mask={normalizeCepNumber}
                      placeholder="00000-000"
                    />
                  </FormControl>
                  {(
                    [
                      ["street", "Rua"],
                      ["number", "Número"],
                      ["district", "Bairro"],
                      ["city", "Cidade"],
                      ["state", "Estado"],
                    ] as const
                  ).map(([field, label]) => (
                    <FormControl
                      key={field}
                      isInvalid={!!errors.address?.[field]}
                    >
                      <FormLabel>{label}</FormLabel>
                      <InputGroup>
                        <Input {...register(`address.${field}` as const)} />
                        {["street", "district", "city", "state"].includes(
                          field
                        ) &&
                          isLoading && (
                            <InputRightElement>
                              <Spinner size="sm" />
                            </InputRightElement>
                          )}
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.address?.[field]?.message}
                      </FormErrorMessage>
                    </FormControl>
                  ))}
                </SimpleGrid>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              isLoading={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              Adicionar Usuário
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
