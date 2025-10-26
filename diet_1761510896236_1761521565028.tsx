import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Apple, Calculator, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { NutritionProfile, Meal } from "@shared/schema";

export default function Diet() {
  const { userId } = useUser();
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];

  // Fetch nutrition profile and meals
  const { data: nutritionProfile } = useQuery<NutritionProfile>({
    queryKey: [`/api/nutrition-profile/${userId}`],
  });

  const { data: meals = [] } = useQuery<Meal[]>({
    queryKey: [`/api/meals?userId=${userId}&date=${today}`],
  });
  const [tdeeData, setTdeeData] = useState({
    age: "",
    sex: "",
    weight: "",
    height: "",
    activityLevel: "",
    goal: "",
  });
  const [tdeeResult, setTdeeResult] = useState<{
    bmr: number;
    tdee: number;
    targetCalories: number;
    protein: number;
    carbs: number;
    fats: number;
  } | null>(null);

  // Mutation to save nutrition profile
  const saveProfileMutation = useMutation({
    mutationFn: async (profile: any) => {
      return await apiRequest("/api/nutrition-profile", {
        method: "POST",
        body: JSON.stringify(profile),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/nutrition-profile/${userId}`] });
      toast({
        title: "Perfil salvo",
        description: "Seu perfil nutricional foi atualizado com sucesso!",
      });
    },
  });

  const calculateTDEE = () => {
    const { age, sex, weight, height, activityLevel, goal } = tdeeData;
    
    if (!age || !sex || !weight || !height || !activityLevel || !goal) {
      return;
    }

    // Mifflin-St Jeor Equation
    let bmr = 0;
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);

    if (sex === "M") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    // Activity multipliers
    const activityMultipliers: Record<string, number> = {
      "Sedentário": 1.2,
      "Leve": 1.375,
      "Moderado": 1.55,
      "Intenso": 1.725,
      "Muito Intenso": 1.9,
    };

    const tdee = Math.round(bmr * activityMultipliers[activityLevel]);

    // Goal adjustments
    let targetCalories = tdee;
    if (goal === "Perda de peso") {
      targetCalories = tdee - 500;
    } else if (goal === "Ganho de massa") {
      targetCalories = tdee + 300;
    }

    // Macro calculation (40% protein, 40% carbs, 20% fats for balanced)
    const protein = Math.round((targetCalories * 0.30) / 4);
    const carbs = Math.round((targetCalories * 0.40) / 4);
    const fats = Math.round((targetCalories * 0.30) / 9);

    const result = {
      bmr: Math.round(bmr),
      tdee,
      targetCalories,
      protein,
      carbs,
      fats,
    };

    setTdeeResult(result);

    // Save to backend
    saveProfileMutation.mutate({
      userId,
      age: a,
      sex,
      weight: w,
      height: h,
      activityLevel,
      goal,
      targetCalories,
      targetProtein: protein,
      targetCarbs: carbs,
      targetFats: fats,
    });
  };

  // Calculate calories consumed today
  const caloriesToday = meals.reduce((sum, meal) => {
    const items = Array.isArray(meal.items) ? meal.items : [];
    return sum + items.reduce((itemSum: number, item: any) => {
      return itemSum + (item.calories || 0) * (item.servings || 1);
    }, 0);
  }, 0);

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Dieta & Nutrição</h1>
            <p className="text-muted-foreground">
              Gerencie sua alimentação e acompanhe seus macros
            </p>
          </div>
          <Button data-testid="button-add-meal">
            <Plus className="h-4 w-4" />
            Registrar Refeição
          </Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="overview" data-testid="tab-overview">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="calculator" data-testid="tab-calculator">
              Calculadora TDEE
            </TabsTrigger>
            <TabsTrigger value="meals" data-testid="tab-meals">
              Refeições
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Meta Diária</CardTitle>
                  <Target className="h-4 w-4 text-chart-1" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {nutritionProfile?.targetCalories || 0} kcal
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {nutritionProfile ? "Meta configurada" : "Configure sua meta na calculadora"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Consumido Hoje</CardTitle>
                  <Apple className="h-4 w-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(caloriesToday)} kcal</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {caloriesToday > 0 ? "Registrado hoje" : "Nenhuma refeição registrada"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Restante</CardTitle>
                  <TrendingUp className="h-4 w-4 text-chart-3" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0 kcal</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    0% da meta atingida
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Macronutrientes Hoje</CardTitle>
                <CardDescription>
                  Acompanhe sua distribuição de proteínas, carboidratos e gorduras
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Proteínas</span>
                    <span className="font-medium">0g / 0g</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Carboidratos</span>
                    <span className="font-medium">0g / 0g</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Gorduras</span>
                    <span className="font-medium">0g / 0g</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Calculadora TDEE (Total Daily Energy Expenditure)
                </CardTitle>
                <CardDescription>
                  Calcule suas necessidades calóricas e macros ideais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="age">Idade</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Ex: 25"
                      value={tdeeData.age}
                      onChange={(e) => setTdeeData({ ...tdeeData, age: e.target.value })}
                      data-testid="input-age"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sex">Sexo</Label>
                    <Select
                      value={tdeeData.sex}
                      onValueChange={(value) => setTdeeData({ ...tdeeData, sex: value })}
                    >
                      <SelectTrigger data-testid="select-sex">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 70.5"
                      value={tdeeData.weight}
                      onChange={(e) => setTdeeData({ ...tdeeData, weight: e.target.value })}
                      data-testid="input-weight"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="Ex: 175"
                      value={tdeeData.height}
                      onChange={(e) => setTdeeData({ ...tdeeData, height: e.target.value })}
                      data-testid="input-height"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity">Nível de Atividade</Label>
                    <Select
                      value={tdeeData.activityLevel}
                      onValueChange={(value) => setTdeeData({ ...tdeeData, activityLevel: value })}
                    >
                      <SelectTrigger data-testid="select-activity">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sedentário">Sedentário (pouco ou nenhum exercício)</SelectItem>
                        <SelectItem value="Leve">Leve (1-3 dias/semana)</SelectItem>
                        <SelectItem value="Moderado">Moderado (3-5 dias/semana)</SelectItem>
                        <SelectItem value="Intenso">Intenso (6-7 dias/semana)</SelectItem>
                        <SelectItem value="Muito Intenso">Muito Intenso (atleta)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal">Objetivo</Label>
                    <Select
                      value={tdeeData.goal}
                      onValueChange={(value) => setTdeeData({ ...tdeeData, goal: value })}
                    >
                      <SelectTrigger data-testid="select-goal">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Perda de peso">Perda de peso</SelectItem>
                        <SelectItem value="Manutenção">Manutenção</SelectItem>
                        <SelectItem value="Ganho de massa">Ganho de massa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={calculateTDEE} className="w-full" data-testid="button-calculate-tdee">
                  Calcular TDEE e Macros
                </Button>

                {tdeeResult && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold text-lg">Seus Resultados:</h3>
                    
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">Taxa Metabólica Basal (BMR)</p>
                        <p className="text-2xl font-bold" data-testid="text-bmr">{tdeeResult.bmr} kcal</p>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">TDEE (Gasto Diário Total)</p>
                        <p className="text-2xl font-bold" data-testid="text-tdee">{tdeeResult.tdee} kcal</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-primary text-primary-foreground">
                      <p className="text-sm opacity-90">Meta Calórica Diária</p>
                      <p className="text-3xl font-bold" data-testid="text-target-calories">
                        {tdeeResult.targetCalories} kcal
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Distribuição de Macronutrientes:</h4>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="p-4 rounded-lg border">
                          <p className="text-sm text-muted-foreground">Proteínas</p>
                          <p className="text-xl font-bold text-chart-1" data-testid="text-protein">
                            {tdeeResult.protein}g
                          </p>
                          <Badge variant="secondary" className="mt-1">30%</Badge>
                        </div>
                        <div className="p-4 rounded-lg border">
                          <p className="text-sm text-muted-foreground">Carboidratos</p>
                          <p className="text-xl font-bold text-chart-2" data-testid="text-carbs">
                            {tdeeResult.carbs}g
                          </p>
                          <Badge variant="secondary" className="mt-1">40%</Badge>
                        </div>
                        <div className="p-4 rounded-lg border">
                          <p className="text-sm text-muted-foreground">Gorduras</p>
                          <p className="text-xl font-bold text-chart-3" data-testid="text-fats">
                            {tdeeResult.fats}g
                          </p>
                          <Badge variant="secondary" className="mt-1">30%</Badge>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full" data-testid="button-save-profile">
                      Salvar no Perfil Nutricional
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meals" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Registro de Refeições</CardTitle>
                <CardDescription>
                  Acompanhe suas refeições diárias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Nenhuma refeição registrada hoje
                    </p>
                    <Button variant="outline" size="sm" data-testid="button-add-first-meal">
                      <Plus className="h-4 w-4" />
                      Registrar Primeira Refeição
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
