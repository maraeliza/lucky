"use client";

import { useEffect } from "react";
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
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { ProtectedRoute } from "@/context/ProtectedRoute";
import { useUserById } from "@/hooks/user/useUserById";
import { useAuth } from "@/context/AuthProvider";
import { useEditUser } from "@/hooks/user/useEdit";
import { normalizeCepNumber, normalizePhoneNumber } from "@/utils/formats";
import { MaskedInput } from "@/components/my-ui/MaskedInput";
import { useViaCep } from "@/hooks/utils/getAddressByCEP";

const addressSchema = z.object({
  street: z
    .string()
    .min(1, "Rua é obrigatória")
    .max(100, "Rua não pode ter mais de 100 caracteres"),
  number: z
    .string()
    .min(1, "Número é obrigatório")
    .max(10, "Número não pode ter mais de 10 caracteres"),
  district: z
    .string()
    .min(1, "Bairro é obrigatório")
    .max(50, "Bairro não pode ter mais de 50 caracteres"),
  city: z
    .string()
    .min(1, "Cidade é obrigatória")
    .max(50, "Cidade não pode ter mais de 50 caracteres"),
  state: z
    .string()
    .min(1, "Estado é obrigatório")
    .max(15, "Estado deve ter no máximo 15 caracteres"),
  zipCode: z
    .string()
    .min(1, "CEP é obrigatório")
    .max(9, "CEP inválido"),
});
const userSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome não pode ter mais de 100 caracteres"),
  email: z.string().email("Email inválido").max(50, "Email não pode ter mais de 50 caracteres"),
  phone: z.string().min(1, "Telefone é obrigatório").max(15, "Telefone inválido"),
  address: addressSchema,
});

export type UserFormData = z.infer<typeof userSchema>;

export default function MyProfile() {
  const toast = useToast();
  const { user } = useAuth();
  const { data } = useUserById({ userId: user?.id || 0 });
  const useMutationEdit = useEditUser();

  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      id: user?.id || 0,
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
  useEffect(() => {
    if (data) {
      reset({
        id: data.id,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: {
          street: data.address?.street || "",
          number: data.address?.number || "",
          district: data.address?.district || "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          zipCode: data.address?.zipCode || "",
        },
      });
    }
  }, [data, reset]);
  const rawZipCode = watch("address.zipCode");
  const zipCode = rawZipCode.replace(/\D/g, "");

  const { data: cepData, isLoading } = useViaCep(zipCode);

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
      await useMutationEdit.mutateAsync(values);
      toast({
        title: "Perfil atualizado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Erro ao atualizar perfil",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  console.log(errors);
  return (
    <ProtectedRoute roles={["ADMIN", "CLIENT"]}>
      <Box p={6} bg="gray.50" minH="100vh">
        <Heading mb={6}>Meu Perfil</Heading>
        <VStack spacing={6} align="stretch" maxW="800px" mx="auto">
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
                <FormControl key={field} isInvalid={!!errors.address?.[field]}>
                  <FormLabel>{label}</FormLabel>
                  <InputGroup>
                    <Input {...register(`address.${field}` as const)} />
                    {["street", "district", "city", "state"].includes(field) &&
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

          <Button
            colorScheme="green"
            isLoading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}
          >
            Salvar Alterações
          </Button>
        </VStack>
      </Box>
    </ProtectedRoute>
  );
}
