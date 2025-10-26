import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Calendar as CalendarIcon, Clock, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Task, Note } from "@shared/schema";

export default function Agenda() {
  const { userId } = useUser();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const today = format(new Date(), "d 'de' MMMM", { locale: ptBR });
  const todayDate = new Date().toISOString().split('T')[0];

  // Fetch tasks and notes from backend
  const { data: allTasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: [`/api/tasks?userId=${userId}`],
  });

  const { data: notes = [], isLoading: notesLoading } = useQuery<Note[]>({
    queryKey: [`/api/notes?userId=${userId}`],
  });

  // Filter tasks for today
  const todayTasks = allTasks.filter((task) => {
    if (!task.date) return false;
    return task.date === todayDate;
  });

  const completedTodayTasks = todayTasks.filter((t) => t.completed).length;
  const pendingTasks = allTasks.filter((t) => !t.completed).length;

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Agenda</h1>
            <p className="text-muted-foreground">
              Organize suas tarefas, compromissos e anotações
            </p>
          </div>
          <Button data-testid="button-add-task">
            <Plus className="h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="today" data-testid="tab-today">
              Hoje
            </TabsTrigger>
            <TabsTrigger value="calendar" data-testid="tab-calendar">
              Calendário
            </TabsTrigger>
            <TabsTrigger value="notes" data-testid="tab-notes">
              Anotações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tarefas Hoje</CardTitle>
                  <Circle className="h-4 w-4 text-chart-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayTasks.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {todayTasks.length > 0 ? `${todayTasks.length} tarefa${todayTasks.length > 1 ? 's' : ''} agendada${todayTasks.length > 1 ? 's' : ''}` : "Nenhuma tarefa agendada"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-2">{completedTodayTasks}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {todayTasks.length > 0 ? `${Math.round((completedTodayTasks / todayTasks.length) * 100)}% das tarefas` : "0% das tarefas"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Próximo Evento</CardTitle>
                  <Clock className="h-4 w-4 text-chart-3" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">--:--</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sem eventos próximos
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle>Timeline do Dia</CardTitle>
                    <CardDescription className="capitalize">
                      {today}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{todayTasks.length - completedTodayTasks} pendentes</Badge>
                    <Badge variant="secondary">{completedTodayTasks} concluídas</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Nenhuma tarefa agendada para hoje
                    </p>
                    <Button variant="outline" size="sm" data-testid="button-add-first-task">
                      <Plus className="h-4 w-4" />
                      Adicionar Primeira Tarefa
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Calendário</CardTitle>
                  <CardDescription>
                    Selecione uma data para ver as tarefas
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    locale={ptBR}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedDate ? format(selectedDate, "d 'de' MMMM", { locale: ptBR }) : "Selecione uma data"}
                  </CardTitle>
                  <CardDescription>
                    Tarefas e eventos agendados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <p className="text-sm">Nenhuma tarefa para esta data</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between flex-wrap gap-4">
                  <span>Minhas Anotações</span>
                  <Button variant="outline" size="sm" data-testid="button-add-note">
                    <Plus className="h-4 w-4" />
                    Nova Anotação
                  </Button>
                </CardTitle>
                <CardDescription>
                  Guarde ideias, lembretes e informações importantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Nenhuma anotação criada ainda
                    </p>
                    <Button variant="outline" size="sm" data-testid="button-add-first-note">
                      <Plus className="h-4 w-4" />
                      Criar Primeira Anotação
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
