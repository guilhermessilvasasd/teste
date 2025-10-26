import { 
  type User, 
  type InsertUser,
  type Finance,
  type InsertFinance,
  type Workout,
  type InsertWorkout,
  type Meal,
  type InsertMeal,
  type Task,
  type InsertTask,
  type Study,
  type InsertStudy
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getFinances(): Promise<Finance[]>;
  getFinance(id: string): Promise<Finance | undefined>;
  createFinance(finance: InsertFinance): Promise<Finance>;
  updateFinance(id: string, finance: InsertFinance): Promise<Finance | undefined>;
  deleteFinance(id: string): Promise<boolean>;

  getWorkouts(): Promise<Workout[]>;
  getWorkout(id: string): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: string, workout: InsertWorkout): Promise<Workout | undefined>;
  deleteWorkout(id: string): Promise<boolean>;

  getMeals(): Promise<Meal[]>;
  getMeal(id: string): Promise<Meal | undefined>;
  createMeal(meal: InsertMeal): Promise<Meal>;
  updateMeal(id: string, meal: InsertMeal): Promise<Meal | undefined>;
  deleteMeal(id: string): Promise<boolean>;

  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: InsertTask): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;

  getStudies(): Promise<Study[]>;
  getStudy(id: string): Promise<Study | undefined>;
  createStudy(study: InsertStudy): Promise<Study>;
  updateStudy(id: string, study: InsertStudy): Promise<Study | undefined>;
  deleteStudy(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private finances: Map<string, Finance>;
  private workouts: Map<string, Workout>;
  private meals: Map<string, Meal>;
  private tasks: Map<string, Task>;
  private studies: Map<string, Study>;

  constructor() {
    this.users = new Map();
    this.finances = new Map();
    this.workouts = new Map();
    this.meals = new Map();
    this.tasks = new Map();
    this.studies = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getFinances(): Promise<Finance[]> {
    return Array.from(this.finances.values()).sort((a, b) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }

  async getFinance(id: string): Promise<Finance | undefined> {
    return this.finances.get(id);
  }

  async createFinance(finance: InsertFinance): Promise<Finance> {
    const id = randomUUID();
    const newFinance: Finance = { ...finance, id };
    this.finances.set(id, newFinance);
    return newFinance;
  }

  async updateFinance(id: string, finance: InsertFinance): Promise<Finance | undefined> {
    if (!this.finances.has(id)) return undefined;
    const updated: Finance = { ...finance, id };
    this.finances.set(id, updated);
    return updated;
  }

  async deleteFinance(id: string): Promise<boolean> {
    return this.finances.delete(id);
  }

  async getWorkouts(): Promise<Workout[]> {
    return Array.from(this.workouts.values()).sort((a, b) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }

  async getWorkout(id: string): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    const id = randomUUID();
    const newWorkout: Workout = { ...workout, id };
    this.workouts.set(id, newWorkout);
    return newWorkout;
  }

  async updateWorkout(id: string, workout: InsertWorkout): Promise<Workout | undefined> {
    if (!this.workouts.has(id)) return undefined;
    const updated: Workout = { ...workout, id };
    this.workouts.set(id, updated);
    return updated;
  }

  async deleteWorkout(id: string): Promise<boolean> {
    return this.workouts.delete(id);
  }

  async getMeals(): Promise<Meal[]> {
    return Array.from(this.meals.values()).sort((a, b) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }

  async getMeal(id: string): Promise<Meal | undefined> {
    return this.meals.get(id);
  }

  async createMeal(meal: InsertMeal): Promise<Meal> {
    const id = randomUUID();
    const newMeal: Meal = { ...meal, id };
    this.meals.set(id, newMeal);
    return newMeal;
  }

  async updateMeal(id: string, meal: InsertMeal): Promise<Meal | undefined> {
    if (!this.meals.has(id)) return undefined;
    const updated: Meal = { ...meal, id };
    this.meals.set(id, updated);
    return updated;
  }

  async deleteMeal(id: string): Promise<boolean> {
    return this.meals.delete(id);
  }

  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = randomUUID();
    const newTask: Task = { ...task, id };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: string, task: InsertTask): Promise<Task | undefined> {
    if (!this.tasks.has(id)) return undefined;
    const updated: Task = { ...task, id };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getStudies(): Promise<Study[]> {
    return Array.from(this.studies.values()).sort((a, b) => 
      (b.progresso || 0) - (a.progresso || 0)
    );
  }

  async getStudy(id: string): Promise<Study | undefined> {
    return this.studies.get(id);
  }

  async createStudy(study: InsertStudy): Promise<Study> {
    const id = randomUUID();
    const newStudy: Study = { ...study, id };
    this.studies.set(id, newStudy);
    return newStudy;
  }

  async updateStudy(id: string, study: InsertStudy): Promise<Study | undefined> {
    if (!this.studies.has(id)) return undefined;
    const updated: Study = { ...study, id };
    this.studies.set(id, updated);
    return updated;
  }

  async deleteStudy(id: string): Promise<boolean> {
    return this.studies.delete(id);
  }
}

export const storage = new MemStorage();
