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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useEditUser } from "@/hooks/user/useEdit";
import { MaskedInput } from "@/components/my-ui/MaskedInput";
import { normalizeCepNumber, normalizePhoneNumber } from "@/utils/formats";
import { useViaCep } from "@/hooks/utils/getAddressByCEP";
import { UserResponse } from "@/interfaces/user";

const addressSchema = z.object({
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  district: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  zipCode: z.string().min(1, "CEP é obrigatório"),
});

const userSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  address: addressSchema,
});

export type UserFormData = z.infer<typeof userSchema>;
type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse | null;
};
export default function UserEditModal({ user, isOpen, onClose }: Props) {
  const toast = useToast();

  const useMutationEdit = useEditUser();
  console.log(user);
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      id: user?.id,
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: {
        street: user?.address?.street || "",
        number: user?.address?.number || "",
        district: user?.address?.district || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        zipCode: user?.address?.zipCode || "",
      },
    },
  });

  // Auto-complete do CEP
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
      await useMutationEdit.mutateAsync(values);
      toast({
        title: "Perfil atualizado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch {
      toast({
        title: "Erro ao atualizar perfil",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    if (user) {
      reset({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: {
          street: user.address.street,
          number: user.address.number,
          district: user.address.district,
          city: user.address.city,
          state: user.address.state,
          zipCode: user.address.zipCode,
        },
      });
    }
  }, [user, reset]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Perfil</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              {/* Informações pessoais */}
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
              disabled={!isValid || isSubmitting}
            >
              Salvar Alterações
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
