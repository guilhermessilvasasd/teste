import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Apple, Wallet, Calendar, BookOpen, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import type { WorkoutLog, Meal, Transaction, Task, StudyMaterial } from "@shared/schema";

export default function Dashboard() {
  const { userId } = useUser();
  const today = new Date().toISOString().split('T')[0];
  const thisMonth = new Date().toISOString().slice(0, 7);

  // Fetch data from multiple endpoints in parallel
  const { data: workoutLogs = [], isLoading: logsLoading } = useQuery<WorkoutLog[]>({
    queryKey: [`/api/workout-logs?userId=${userId}`],
  });

  const { data: meals = [], isLoading: mealsLoading } = useQuery<Meal[]>({
    queryKey: [`/api/meals?userId=${userId}&date=${today}`],
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: [`/api/transactions?userId=${userId}&month=${thisMonth}`],
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: [`/api/tasks?userId=${userId}`],
  });

  const { data: studyMaterials = [], isLoading: materialsLoading } = useQuery<StudyMaterial[]>({
    queryKey: ["/api/study-materials"],
  });

  const isLoading = logsLoading || mealsLoading || transactionsLoading || tasksLoading || materialsLoading;

  // Calculate stats
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const workoutsThisWeek = workoutLogs.filter(
    (log) => new Date(log.completedAt) >= oneWeekAgo
  ).length;

  const caloriesToday = meals.reduce((sum, meal) => {
    const items = Array.isArray(meal.items) ? meal.items : [];
    return sum + items.reduce((itemSum: number, item: any) => {
      return itemSum + (item.calories || 0) * (item.servings || 1);
    }, 0);
  }, 0);

  const monthBalance = transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, 0);

  const pendingTasks = tasks.filter((t) => !t.completed).length;

  const stats = [
    {
      title: "Treinos esta semana",
      value: workoutsThisWeek.toString(),
      description: workoutsThisWeek > 0 ? `${workoutsThisWeek} treino${workoutsThisWeek > 1 ? 's' : ''} completado${workoutsThisWeek > 1 ? 's' : ''}` : "Nenhum treino registrado ainda",
      icon: Dumbbell,
      color: "text-chart-1",
    },
    {
      title: "Calorias hoje",
      value: `${Math.round(caloriesToday)} kcal`,
      description: caloriesToday > 0 ? "Consumidas hoje" : "Configure seu perfil nutricional",
      icon: Apple,
      color: "text-chart-2",
    },
    {
      title: "Saldo do mês",
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthBalance),
      description: monthBalance >= 0 ? "Positivo" : "Negativo",
      icon: Wallet,
      color: "text-chart-3",
    },
    {
      title: "Tarefas pendentes",
      value: pendingTasks.toString(),
      description: pendingTasks > 0 ? `${pendingTasks} tarefa${pendingTasks > 1 ? 's' : ''} pendente${pendingTasks > 1 ? 's' : ''}` : "Nenhuma tarefa agendada",
      icon: Calendar,
      color: "text-chart-4",
    },
    {
      title: "Materiais de estudo",
      value: studyMaterials.length.toString(),
      description: studyMaterials.length > 0 ? "Recursos disponíveis" : "Comece seus estudos",
      icon: BookOpen,
      color: "text-chart-5",
    },
    {
      title: "Progresso geral",
      value: "0%",
      description: "Comece a usar o sistema",
      icon: TrendingUp,
      color: "text-primary",
    },
  ];
  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu hub de gerenciamento pessoal
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            [...Array(6)].map((_, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))
          ) : (
            stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="hover-elevate" data-testid={`card-stat-${index}`}>
                  <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid={`text-stat-value-${index}`}>
                      {stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>
                Suas últimas ações no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <p className="text-sm">Nenhuma atividade recente</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dicas Rápidas</CardTitle>
              <CardDescription>
                Orientações para aproveitar melhor o sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                <p className="text-sm">Configure seu perfil nutricional para tracking de dieta</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                <p className="text-sm">Crie seu primeiro programa de treino</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                <p className="text-sm">Registre suas despesas diárias para melhor controle financeiro</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
