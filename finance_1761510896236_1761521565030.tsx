import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, TrendingUp, TrendingDown, DollarSign, AlertCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { queryClient } from "@/lib/queryClient";
import type { Transaction } from "@shared/schema";

export default function Finance() {
  const { userId } = useUser();
  const thisMonth = new Date().toISOString().slice(0, 7);

  // Fetch transactions from backend
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: [`/api/transactions?userId=${userId}&month=${thisMonth}`],
  });

  // Calculate monthly metrics
  const monthlyIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = monthlyIncome - monthlyExpenses;
  const balancePercentage = monthlyIncome > 0 ? ((balance / monthlyIncome) * 100).toFixed(1) : 0;

  // Dicas personalizadas baseadas no padrão de gastos
  const getTips = () => {
    const tips = [];
    
    if (monthlyIncome === 0) {
      tips.push({
        type: "info",
        message: "Comece registrando suas receitas para ter uma visão completa das suas finanças.",
      });
    }
    
    if (monthlyExpenses > monthlyIncome * 0.9) {
      tips.push({
        type: "warning",
        message: "Atenção: Suas despesas estão muito próximas da sua renda. Considere reduzir gastos não essenciais.",
      });
    }
    
    if (balance > 0 && balance < monthlyIncome * 0.1) {
      tips.push({
        type: "info",
        message: "Tente economizar pelo menos 20% da sua renda mensal para criar uma reserva de emergência.",
      });
    }
    
    if (balance >= monthlyIncome * 0.2) {
      tips.push({
        type: "success",
        message: "Excelente! Você está economizando mais de 20% da sua renda. Continue assim!",
      });
    }

    if (tips.length === 0) {
      tips.push({
        type: "info",
        message: "Registre suas transações diárias para receber dicas personalizadas de economia.",
      });
    }

    return tips;
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Finanças</h1>
            <p className="text-muted-foreground">
              Gerencie suas receitas e despesas com inteligência
            </p>
          </div>
          <Button data-testid="button-add-transaction">
            <Plus className="h-4 w-4" />
            Nova Transação
          </Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="overview" data-testid="tab-overview">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="calculator" data-testid="tab-calculator">
              Calculadora
            </TabsTrigger>
            <TabsTrigger value="transactions" data-testid="tab-transactions">
              Transações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-2" data-testid="text-income">
                    R$ {monthlyIncome.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total de entradas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
                  <TrendingDown className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive" data-testid="text-expenses">
                    R$ {monthlyExpenses.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total de saídas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Saldo do Mês</CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div 
                    className={`text-2xl font-bold ${
                      balance >= 0 ? "text-chart-2" : "text-destructive"
                    }`}
                    data-testid="text-balance"
                  >
                    R$ {balance.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {balancePercentage}% da renda
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-chart-3" />
                  Dicas Personalizadas
                </CardTitle>
                <CardDescription>
                  Orientações baseadas nos seus padrões de gastos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {getTips().map((tip, index) => (
                  <Alert 
                    key={index}
                    variant={tip.type === "warning" ? "destructive" : "default"}
                    data-testid={`alert-tip-${index}`}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{tip.message}</AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Despesas por Categoria</CardTitle>
                <CardDescription>
                  Onde seu dinheiro está indo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  <p className="text-sm">Nenhuma transação registrada este mês</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Calculadora Financeira</CardTitle>
                <CardDescription>
                  Simule diferentes cenários financeiros e planeje seu futuro
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Regra 50/30/20</h3>
                    <p className="text-xs text-muted-foreground">
                      Distribua sua renda de forma equilibrada
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                        <span className="text-sm">Essenciais (50%)</span>
                        <Badge>R$ {(monthlyIncome * 0.5).toFixed(2)}</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                        <span className="text-sm">Desejos (30%)</span>
                        <Badge>R$ {(monthlyIncome * 0.3).toFixed(2)}</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                        <span className="text-sm">Poupança (20%)</span>
                        <Badge>R$ {(monthlyIncome * 0.2).toFixed(2)}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Meta de Reserva de Emergência</h3>
                    <p className="text-xs text-muted-foreground">
                      Tenha 6 meses de despesas guardadas
                    </p>
                    <div className="p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground mb-1">Meta ideal:</div>
                      <div className="text-2xl font-bold text-primary">
                        R$ {(monthlyExpenses * 6).toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Baseado nas suas despesas mensais
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <h3 className="font-semibold">Dicas de Economia:</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                      <p className="text-sm">Automatize suas economias: transfira uma porcentagem fixa para poupança assim que receber</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                      <p className="text-sm">Evite dívidas de cartão de crédito: pague sempre o valor total da fatura</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                      <p className="text-sm">Compare preços antes de comprar: use aplicativos de comparação</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                      <p className="text-sm">Cozinhe em casa: economize até 70% comparado a comer fora</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Transações</CardTitle>
                <CardDescription>
                  Todas as suas receitas e despesas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Nenhuma transação registrada ainda
                    </p>
                    <Button variant="outline" size="sm" data-testid="button-add-first-transaction">
                      <Plus className="h-4 w-4" />
                      Adicionar Primeira Transação
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
