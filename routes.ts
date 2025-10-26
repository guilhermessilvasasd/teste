import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertFinanceSchema,
  insertWorkoutSchema,
  insertMealSchema,
  insertTaskSchema,
  insertStudySchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.get("/api/finances", async (_req, res) => {
    const finances = await storage.getFinances();
    res.json(finances);
  });

  app.get("/api/finances/:id", async (req, res) => {
    const finance = await storage.getFinance(req.params.id);
    if (!finance) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }
    res.json(finance);
  });

  app.post("/api/finances", async (req, res) => {
    try {
      const validated = insertFinanceSchema.parse(req.body);
      const finance = await storage.createFinance(validated);
      res.status(201).json(finance);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.put("/api/finances/:id", async (req, res) => {
    try {
      const validated = insertFinanceSchema.parse(req.body);
      const finance = await storage.updateFinance(req.params.id, validated);
      if (!finance) {
        return res.status(404).json({ error: "Transação não encontrada" });
      }
      res.json(finance);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.delete("/api/finances/:id", async (req, res) => {
    const deleted = await storage.deleteFinance(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }
    res.status(204).send();
  });

  app.get("/api/workouts", async (_req, res) => {
    const workouts = await storage.getWorkouts();
    res.json(workouts);
  });

  app.get("/api/workouts/:id", async (req, res) => {
    const workout = await storage.getWorkout(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: "Treino não encontrado" });
    }
    res.json(workout);
  });

  app.post("/api/workouts", async (req, res) => {
    try {
      const validated = insertWorkoutSchema.parse(req.body);
      const workout = await storage.createWorkout(validated);
      res.status(201).json(workout);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.put("/api/workouts/:id", async (req, res) => {
    try {
      const validated = insertWorkoutSchema.parse(req.body);
      const workout = await storage.updateWorkout(req.params.id, validated);
      if (!workout) {
        return res.status(404).json({ error: "Treino não encontrado" });
      }
      res.json(workout);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.delete("/api/workouts/:id", async (req, res) => {
    const deleted = await storage.deleteWorkout(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Treino não encontrado" });
    }
    res.status(204).send();
  });

  app.get("/api/meals", async (_req, res) => {
    const meals = await storage.getMeals();
    res.json(meals);
  });

  app.get("/api/meals/:id", async (req, res) => {
    const meal = await storage.getMeal(req.params.id);
    if (!meal) {
      return res.status(404).json({ error: "Refeição não encontrada" });
    }
    res.json(meal);
  });

  app.post("/api/meals", async (req, res) => {
    try {
      const validated = insertMealSchema.parse(req.body);
      const meal = await storage.createMeal(validated);
      res.status(201).json(meal);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.put("/api/meals/:id", async (req, res) => {
    try {
      const validated = insertMealSchema.parse(req.body);
      const meal = await storage.updateMeal(req.params.id, validated);
      if (!meal) {
        return res.status(404).json({ error: "Refeição não encontrada" });
      }
      res.json(meal);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.delete("/api/meals/:id", async (req, res) => {
    const deleted = await storage.deleteMeal(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Refeição não encontrada" });
    }
    res.status(204).send();
  });

  app.get("/api/tasks", async (_req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.get("/api/tasks/:id", async (req, res) => {
    const task = await storage.getTask(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }
    res.json(task);
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validated = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validated);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const validated = insertTaskSchema.parse(req.body);
      const task = await storage.updateTask(req.params.id, validated);
      if (!task) {
        return res.status(404).json({ error: "Tarefa não encontrada" });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    const deleted = await storage.deleteTask(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }
    res.status(204).send();
  });

  app.get("/api/studies", async (_req, res) => {
    const studies = await storage.getStudies();
    res.json(studies);
  });

  app.get("/api/studies/:id", async (req, res) => {
    const study = await storage.getStudy(req.params.id);
    if (!study) {
      return res.status(404).json({ error: "Estudo não encontrado" });
    }
    res.json(study);
  });

  app.post("/api/studies", async (req, res) => {
    try {
      const validated = insertStudySchema.parse(req.body);
      const study = await storage.createStudy(validated);
      res.status(201).json(study);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.put("/api/studies/:id", async (req, res) => {
    try {
      const validated = insertStudySchema.parse(req.body);
      const study = await storage.updateStudy(req.params.id, validated);
      if (!study) {
        return res.status(404).json({ error: "Estudo não encontrado" });
      }
      res.json(study);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.delete("/api/studies/:id", async (req, res) => {
    const deleted = await storage.deleteStudy(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Estudo não encontrado" });
    }
    res.status(204).send();
  });

  const httpServer = createServer(app);

  return httpServer;
}
