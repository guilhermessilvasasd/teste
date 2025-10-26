import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Finance
export interface Finance {
  id: string;
  descricao: string;
  valor: string;
  categoria: string;
  tipo: "receita" | "despesa";
  data: string;
}

export const insertFinanceSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  tipo: z.enum(["receita", "despesa"]),
  data: z.string().min(1, "Data é obrigatória"),
});

export type InsertFinance = z.infer<typeof insertFinanceSchema>;

// Workout
export interface Workout {
  id: string;
  exercicio: string;
  series: number;
  repeticoes: number;
  peso: string | null;
  data: string;
  observacoes: string | null;
}

export const insertWorkoutSchema = z.object({
  exercicio: z.string().min(1, "Exercício é obrigatório"),
  series: z.coerce.number().min(1, "Séries deve ser maior que 0"),
  repeticoes: z.coerce.number().min(1, "Repetições deve ser maior que 0"),
  peso: z.string().optional(),
  data: z.string().min(1, "Data é obrigatória"),
  observacoes: z.string().optional(),
});

export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;

// Meal
export interface Meal {
  id: string;
  nome: string;
  calorias: number | null;
  proteinas: string | null;
  carboidratos: string | null;
  gorduras: string | null;
  data: string;
  refeicao: string;
  observacoes: string | null;
}

export const insertMealSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  calorias: z.coerce.number().optional(),
  proteinas: z.string().optional(),
  carboidratos: z.string().optional(),
  gorduras: z.string().optional(),
  data: z.string().min(1, "Data é obrigatória"),
  refeicao: z.string().min(1, "Tipo de refeição é obrigatório"),
  observacoes: z.string().optional(),
});

export type InsertMeal = z.infer<typeof insertMealSchema>;

// Task
export interface Task {
  id: string;
  titulo: string;
  descricao: string | null;
  data: string;
  hora: string | null;
  concluida: boolean;
  prioridade: string;
}

export const insertTaskSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().optional(),
  data: z.string().min(1, "Data é obrigatória"),
  hora: z.string().optional(),
  concluida: z.boolean().default(false),
  prioridade: z.string().min(1, "Prioridade é obrigatória"),
});

export type InsertTask = z.infer<typeof insertTaskSchema>;

// Study
export interface Study {
  id: string;
  titulo: string;
  descricao: string | null;
  categoria: string;
  progresso: number;
  data_inicio: string | null;
  data_conclusao: string | null;
  observacoes: string | null;
}

export const insertStudySchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().optional(),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  progresso: z.coerce.number().min(0).max(100).default(0),
  data_inicio: z.string().optional(),
  data_conclusao: z.string().optional(),
  observacoes: z.string().optional(),
});

export type InsertStudy = z.infer<typeof insertStudySchema>;
