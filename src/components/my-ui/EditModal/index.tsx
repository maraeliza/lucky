import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Select,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ColorInput } from "../ColorInput";
import { EditModalProps } from "@/interfaces/common";

export function EditModal<T extends Record<string, any>>({
  isOpen,
  onClose,
  initialData,
  fields,
  title = "Editar",
  onSubmit,
  isPending,
}: EditModalProps<T>) {
  const [values, setValues] = useState<Record<string, any>>({});

  useEffect(() => {
    if (initialData) {
      const initialValues: Record<string, any> = {};
      fields.forEach((f) => {
        initialValues[String(f.key)] = initialData[f.key] ?? "";
      });
      setValues(initialValues);
    }
  }, [initialData, fields]);

  function handleChange(key: keyof T, value: any) {
    setValues((prev) => ({ ...prev, [String(key)]: value }));
  }

  function handleSubmit() {
    if (!initialData) return;
    onSubmit({ ...initialData, ...values } as T);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack align="stretch" gap={4}>
            {fields.map((field) => {
              const value = values[String(field.key)] ?? "";

              // Select
              if (field.type === "select" && field.options) {
                return (
                  <FormControl key={String(field.key)}>
                    <FormLabel>{field.label}</FormLabel>
                    <Select
                      placeholder={field.placeholder || "Selecione..."}
                      value={value}
                      onChange={(e) =>
                        handleChange(
                          field.key,
                          field.options![0] &&
                            typeof field.options![0].id === "number"
                            ? Number(e.target.value)
                            : e.target.value
                        )
                      }
                    >
                      {field.options.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                );
              }

              // Color
              if (field.type === "color") {
                return (
                  <FormControl key={String(field.key)}>
                    <FormLabel>{field.label}</FormLabel>
                    <ColorInput
                      value={value}
                      onChange={(val) => handleChange(field.key, val)}
                      placeholder="Digite #RRGGBB ou cor"
                    />
                  </FormControl>
                );
              }
              return (
                <FormControl key={String(field.key)}>
                  <FormLabel>{field.label}</FormLabel>
                  <Input
                    type={field.type ?? "text"}
                    placeholder={field.placeholder ?? ""}
                    value={value}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    maxLength={20}
                  />
                </FormControl>
              );
            })}
          </VStack>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isPending}
          >
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
