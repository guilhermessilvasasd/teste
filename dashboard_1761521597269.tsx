import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { DollarSign, Dumbbell, UtensilsCrossed, Calendar, BookOpen, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Finance, Workout, Meal, Task, Study } from "@shared/schema";

export default function Dashboard() {
  const { data: finances = [] } = useQuery<Finance[]>({
    queryKey: ["/api/finances"],
  });

  const { data: workouts = [] } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const { data: meals = [] } = useQuery<Meal[]>({
    queryKey: ["/api/meals"],
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: studies = [] } = useQuery<Study[]>({
    queryKey: ["/api/studies"],
  });

  const totalReceitas = finances
    .filter((f) => f.tipo === "receita")
    .reduce((sum, f) => sum + parseFloat(f.valor), 0);

  const totalDespesas = finances
    .filter((f) => f.tipo === "despesa")
    .reduce((sum, f) => sum + parseFloat(f.valor), 0);

  const saldo = totalReceitas - totalDespesas;

  const totalCalorias = meals.reduce((sum, m) => sum + (m.calorias || 0), 0);
  const tasksPendentes = tasks.filter((t) => !t.concluida).length;
  const progressoEstudos = studies.length > 0
    ? Math.round(studies.reduce((sum, s) => sum + s.progresso, 0) / studies.length)
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Visão geral da sua vida pessoal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finanças</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold font-mono ${saldo >= 0 ? "text-green-600" : "text-red-600"
                }`}
              data-testid="text-saldo-dashboard"
            >
              R$ {saldo.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {finances.length} transações registradas
            </p>
            <Link href="/financas">
              <Button variant="ghost" size="sm" className="mt-4 w-full" data-testid="link-financas">
                Ver detalhes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treinos</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="text-treinos-dashboard">
              {workouts.length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Treinos registrados
            </p>
            <Link href="/treinos">
              <Button variant="ghost" size="sm" className="mt-4 w-full" data-testid="link-treinos">
                Ver detalhes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dieta</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="text-calorias-dashboard">
              {totalCalorias} kcal
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Total de calorias hoje
            </p>
            <Link href="/dieta">
              <Button variant="ghost" size="sm" className="mt-4 w-full" data-testid="link-dieta">
                Ver detalhes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agenda</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="text-tarefas-dashboard">
              {tasksPendentes}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Tarefas pendentes
            </p>
            <Link href="/agenda">
              <Button variant="ghost" size="sm" className="mt-4 w-full" data-testid="link-agenda">
                Ver detalhes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="text-estudos-dashboard">
              {progressoEstudos}%
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Progresso médio ({studies.length} estudos)
            </p>
            <Link href="/estudos">
              <Button variant="ghost" size="sm" className="mt-4 w-full" data-testid="link-estudos">
                Ver detalhes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao seu gerenciador de vida pessoal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Use a barra lateral para navegar entre os diferentes módulos e começar a
            organizar sua vida. Você pode adicionar transações financeiras, registrar
            treinos, planejar sua dieta, gerenciar tarefas e acompanhar seus estudos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Módulos Disponíveis:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Finanças - Controle de receitas e despesas</li>
                <li>• Treinos - Registro de exercícios físicos</li>
                <li>• Dieta - Planejamento de refeições</li>
                <li>• Agenda - Gestão de tarefas e compromissos</li>
                <li>• Estudos - Acompanhamento de cursos e aprendizado</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Começando:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>1. Escolha um módulo na barra lateral</li>
                <li>2. Clique em "Novo" ou "Adicionar" para criar um item</li>
                <li>3. Preencha os dados e salve</li>
                <li>4. Edite ou exclua quando necessário</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
