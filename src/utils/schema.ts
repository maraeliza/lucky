"use client";

import { z } from "zod";

export const schemaLogin = z.object({
  email: z
    .string()
    .email({ message: "E-mail inválido" })
    .min(1, { message: "O e-mail é obrigatório" })
    .max(50, { message: "O e-mail não pode ter mais de 50 caracteres" }),
  password: z
    .string()
    .min(8, { message: "A senha é obrigatória e deve ser válida" })
    .max(50, { message: "A senha não pode ter mais de 50 caracteres" }),
  rememberMe: z.boolean().optional(),
});

export const schemaRecoverPassword = z.object({
  email: z
    .string()
    .email({ message: "Informe um email válido" })
    .max(50, { message: "O e-mail não pode ter mais de 50 caracteres" }),
});
export const schemaCategory = z.object({
  description: z
    .string()
    .min(3, { message: "O nome da categoria é obrigatório" })
    .max(50, { message: "A descrição não pode ter mais de 50 caracteres" }),
  color: z.string().max(7, { message: "Cor inválida" }).optional(),
});
export const schemaAddress = z.object({
  id: z.number().int().positive().optional(),
  street: z
    .string()
    .min(3, { message: "A rua é obrigatória" })
    .max(50, { message: "A rua não pode ter mais de 50 caracteres" }),
  number: z
    .string()
    .min(1, { message: "O número é obrigatório" })
    .max(8, { message: "O número não pode ter mais de 8 caracteres" }),
  district: z
    .string()
    .min(3, { message: "O bairro é obrigatório" })
    .max(50, { message: "O bairro não pode ter mais de 50 caracteres" }),
  city: z
    .string()
    .min(3, { message: "A cidade é obrigatória" })
    .max(50, { message: "A cidade não pode ter mais de 50 caracteres" }),
  state: z
    .string()
    .length(2, { message: "O estado deve ter 2 letras (Ex: SP)" }),
  zipCode: z.string().regex(/^\d{5}-\d{3}$/, {
    message: "CEP inválido, use o formato 00000-000",
  }),
});
export const schemaUserCadastro = z.object({
  name: z
    .string()
    .min(1, { message: "O nome é obrigatório" })
    .max(50, { message: "O nome não pode ter mais de 50 caracteres" }),
  email: z
    .string()
    .email({ message: "E-mail inválido" })
    .min(1, { message: "O e-mail é obrigatório" })
    .max(50, { message: "O email não pode ter mais de 50 caracteres" }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
    .max(50, { message: "A senha não pode ter mais de 50 caracteres" }),
  confirmPassword: z.string().min(8, {
    message: "A confirmação de senha deve ter pelo menos 8 caracteres",
  }),
  phone: z.string().regex(/\(\d{2}\) \d{5}-\d{4}/, {
    message: "Celular inválido, siga o formato (XX) XXXXX-XXXX",
  }),
});
export const schemaUserEdit = z.object({
  id: z.number().min(1, { message: "O id é obrigatório" }),
  name: z.string().min(1, { message: "O nome é obrigatório" }),
  email: z
    .string()
    .email({ message: "E-mail inválido" })
    .min(1, { message: "O e-mail é obrigatório" }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
    .max(50, { message: "A senha não pode ter mais de 50 caracteres" }),
  confirmPassword: z.string().min(8, {
    message: "A confirmação de senha deve ter pelo menos 8 caracteres",
  }),
  phone: z.string().regex(/\(\d{2}\) \d{5}-\d{4}/, {
    message: "Celular inválido, siga o formato (XX) XXXXX-XXXX",
  }),
});
export const schemaItem = z.object({
  description: z
    .string()
    .min(3, {
      message: "A descrição do item é obrigatória (mínimo 3 caracteres).",
    })
    .max(50, { message: "A descrição não pode ter mais de 50 caracteres" }),
  unitPrice: z
    .number()
    .min(0.01, { message: "O preço unitário deve ser um valor positivo." }),
  categoryId: z
    .number()
    .int()
    .min(1, { message: "A categoria é obrigatória." }),
  image: z
    .string()
    .url({ message: "A imagem deve ser uma URL válida." })
    .optional()
    .or(z.literal("")),
});

export const schemaRegister = z.object({
  name: z
    .string()
    .min(2, "Nome é obrigatório")
    .max(50, { message: "O nome não pode ter mais de 50 caracteres" }),
  email: z
    .string()
    .email("Email inválido")
    .max(50, { message: "O email não pode ter mais de 50 caracteres" }),
  phone: z.string().regex(/\(\d{2}\) \d{5}-\d{4}/, {
    message: "Celular inválido, siga o formato (XX) XXXXX-XXXX",
  }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
    .max(50, { message: "A senha não pode ter mais de 50 caracteres" }),
  confirmPassword: z.string().min(8, {
    message: "A confirmação de senha deve ter pelo menos 8 caracteres",
  }),
});

export type FormItem = z.infer<typeof schemaItem>;
export type FormCategory = z.infer<typeof schemaCategory>;
export type FormUserEdit = z.infer<typeof schemaUserEdit>;
export type FormUser = z.infer<typeof schemaUserCadastro>;
export type FormLogin = z.infer<typeof schemaLogin>;
export type FormRegister = z.infer<typeof schemaRegister>;
export type FormRecover = z.infer<typeof schemaRecoverPassword>;
