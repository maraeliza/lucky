"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react";
import { Path, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateModalProps } from "@/interfaces/common";
import { ColorInput } from "../ColorInput";

export function CreateModal<T extends Record<string, any>>({
  isOpen,
  onClose,
  onSubmit,
  schema,
  fields,
  title = "Cadastrar",
  isPending = false,
}: CreateModalProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<T>({
    resolver: zodResolver(schema),
  });

  const handleFormSubmit = (data: T) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack
            as="form"
            onSubmit={handleSubmit(handleFormSubmit)}
            spacing={4}
          >
            {fields.map((field) => (
              <FormControl
                key={String(field.key)}
                isInvalid={!!errors[field.key]}
              >
                <FormLabel>{field.label}</FormLabel>

                {field.type === "select" && field.options ? (
                  <Select
                    placeholder={field.placeholder || "Selecione..."}
                    {...register(field.key as Path<T>, { valueAsNumber: true })}
                  >
                    {field.options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </Select>
                ) : field.type === "color" ? (
                  <ColorInput
                    value={""}
                    onChange={() => {}}
                    placeholder={field.placeholder || "Digite #RRGGBB ou cor"}
                  />
                ) : (
                  <Input
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    {...register(
                      field.key as Path<T>,
                      field.type === "number" ? { valueAsNumber: true } : {}
                    )}
                  />
                )}

                <FormErrorMessage>
                  {errors[field.key]?.message as string}
                </FormErrorMessage>
              </FormControl>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit(handleFormSubmit)}
            isLoading={isPending}
          >
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
