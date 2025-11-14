import { z } from "zod"

export const createStudentSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters"),
  rollNumber: z
    .string()
    .min(3, "Roll number must be at least 3 characters")
    .max(20, "Roll number must not exceed 20 characters")
    .regex(/^[A-Z0-9-]+$/, "Roll number must contain only uppercase letters, numbers, and hyphens"),
  classId: z.string().cuid("Invalid class ID"),
  dateOfBirth: z
    .string()
    .refine((date) => {
      const dob = new Date(date)
      const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      return age >= 3 && age <= 25
    }, "Student must be between 3 and 25 years old"),
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Gender must be Male, Female, or Other" }),
  }),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must not exceed 500 characters"),
  phone: z
    .string()
    .regex(/^\+233[0-9]{9}$/, "Phone must be in format +233XXXXXXXXX")
    .optional()
    .or(z.literal("")),
  parentId: z.string().cuid("Invalid parent ID").optional(),
})

export const updateStudentSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters")
    .optional(),
  classId: z.string().cuid("Invalid class ID").optional(),
  dateOfBirth: z
    .string()
    .refine((date) => {
      const dob = new Date(date)
      const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      return age >= 3 && age <= 25
    }, "Student must be between 3 and 25 years old")
    .optional(),
  gender: z
    .enum(["Male", "Female", "Other"], {
      errorMap: () => ({ message: "Gender must be Male, Female, or Other" }),
    })
    .optional(),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must not exceed 500 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^\+233[0-9]{9}$/, "Phone must be in format +233XXXXXXXXX")
    .optional()
    .or(z.literal("")),
  parentId: z.string().cuid("Invalid parent ID").optional().nullable(),
})

export const studentQuerySchema = z.object({
  classId: z.string().cuid().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
})

export type CreateStudentInput = z.infer<typeof createStudentSchema>
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>
export type StudentQueryInput = z.infer<typeof studentQuerySchema>
