// SECURITY: Zod schemas provide type-safe, runtime validation and sanitization
// for every form that submits data to the API.
// SECURITY: stripHtml removes injected markup before any value reaches the backend.

import { z } from 'zod';

const stripHtml = (s: string) => s.replace(/<[^>]*>/g, '').trim();

// --- Auth ---

// SECURITY: max 254 chars matches RFC 5321 email length limit
export const loginSchema = z.object({
  email: z.string().trim().email('Correo electrónico inválido').max(254).transform(stripHtml),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').max(128),
});

// SECURITY: confirmPassword cross-field check prevents silent mismatch
export const registerAccountSchema = z
  .object({
    email: z.string().trim().email('Correo inválido').max(254).transform(stripHtml),
    password: z.string().min(8).max(128),
    confirmPassword: z.string(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

// SECURITY: DNI 7-8 digits; nombres max 50 chars matching backend model
export const registerEmployeeSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(50).transform(stripHtml),
  apellido: z.string().trim().min(1, 'El apellido es obligatorio').max(50).transform(stripHtml),
  dni: z.string().regex(/^\d{7,8}$/, 'DNI inválido (7 u 8 dígitos)'),
  ubicacion: z.string().trim().min(1, 'La ubicación es obligatoria').max(200).transform(stripHtml),
});

// SECURITY: CUIL is 11 digits per AFIP spec
export const registerEmployerSchema = z.object({
  companyName: z.string().trim().min(1, 'El nombre de la empresa es obligatorio').max(100).transform(stripHtml),
  cuil: z.string().regex(/^\d{11}$/, 'CUIL inválido (11 dígitos sin guiones)'),
});

// --- Profile ---

export const profileDescriptionSchema = z.object({
  description: z.string().trim().max(500, 'Máximo 500 caracteres').transform(stripHtml).optional(),
});

// --- Vacancy / Job ---

// SECURITY: max lengths match the backend model field limits
export const vacancySchema = z.object({
  descripcion: z.string().trim().max(200, 'Máximo 200 caracteres').transform(stripHtml),
  otrosRol: z.string().trim().max(100).transform(stripHtml).optional(),
  requerimiento: z.string().trim().max(150).transform(stripHtml).optional(),
});

// --- Reset password ---

export const newPasswordSchema = z
  .object({
    password: z.string().min(8).max(128),
    confirmPassword: z.string(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

// Inferred types for use in hooks
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterAccountInput = z.infer<typeof registerAccountSchema>;
export type RegisterEmployeeInput = z.infer<typeof registerEmployeeSchema>;
export type RegisterEmployerInput = z.infer<typeof registerEmployerSchema>;
export type VacancyInput = z.infer<typeof vacancySchema>;
