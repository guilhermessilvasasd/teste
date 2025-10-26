import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMealSchema, type Meal, type InsertMeal } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Dieta() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const { toast } = useToast();

  const { data: meals = [], isLoading } = useQuery<Meal[]>({
    queryKey: ["/api/meals"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertMeal) =>
      apiRequest("/api/meals", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meals"] });
      toast({ title: "Refeição adicionada com sucesso!" });
      setDialogOpen(false);
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InsertMeal }) =>
      apiRequest(`/api/meals/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meals"] });
      toast({ title: "Refeição atualizada com sucesso!" });
      setDialogOpen(false);
      setEditingMeal(null);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/meals/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meals"] });
      toast({ title: "Refeição removida com sucesso!" });
    },
  });

  const form = useForm<InsertMeal>({
    resolver: zodResolver(insertMealSchema),
    defaultValues: {
      nome: "",
      calorias: 0,
      proteinas: "0",
      carboidratos: "0",
      gorduras: "0",
      data: format(new Date(), "yyyy-MM-dd"),
      refeicao: "cafe",
      observacoes: "",
    },
  });

  const onSubmit = (data: InsertMeal) => {
    if (editingMeal) {
      updateMutation.mutate({ id: editingMeal.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    form.reset({
      nome: meal.nome,
      calorias: meal.calorias || 0,
      proteinas: meal.proteinas || "0",
      carboidratos: meal.carboidratos || "0",
      gorduras: meal.gorduras || "0",
      data: meal.data,
      refeicao: meal.refeicao,
      observacoes: meal.observacoes || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta refeição?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingMeal(null);
      form.reset();
    }
  };

  const totalCalorias = meals.reduce((sum, m) => sum + (m.calorias || 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Dieta</h1>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-meal">
              <Plus className="h-4 w-4 mr-2" />
              Nova Refeição
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMeal ? "Editar Refeição" : "Nova Refeição"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Frango com batata doce"
                          data-testid="input-nome"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="refeicao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refeição</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-refeicao">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cafe">Café da Manhã</SelectItem>
                          <SelectItem value="lanche_manha">Lanche da Manhã</SelectItem>
                          <SelectItem value="almoco">Almoço</SelectItem>
                          <SelectItem value="lanche_tarde">Lanche da Tarde</SelectItem>
                          <SelectItem value="jantar">Jantar</SelectItem>
                          <SelectItem value="ceia">Ceia</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="calorias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calorias</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            data-testid="input-calorias"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proteinas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proteínas (g)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            data-testid="input-proteinas"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="carboidratos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carboidratos (g)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            data-testid="input-carboidratos"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gorduras"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gorduras (g)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            data-testid="input-gorduras"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          data-testid="input-data"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Notas sobre a refeição..."
                          data-testid="input-observacoes"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit-meal"
                >
                  {editingMeal ? "Atualizar" : "Adicionar"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Calorias Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono" data-testid="text-calorias-total">
            {totalCalorias} kcal
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Refeições</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Carregando...</p>
          ) : meals.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma refeição cadastrada. Adicione uma nova refeição para começar.
            </p>
          ) : (
            <div className="space-y-2">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between p-4 rounded-md border"
                  data-testid={`meal-item-${meal.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{meal.nome}</h3>
                      <span className="text-xs text-muted-foreground">
                        {meal.refeicao.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {meal.calorias} kcal • P: {meal.proteinas}g • C: {meal.carboidratos}g • G: {meal.gorduras}g
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(meal.data), "dd/MM/yyyy")}
                    </p>
                    {meal.observacoes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {meal.observacoes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(meal)}
                      data-testid={`button-edit-${meal.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(meal.id)}
                      data-testid={`button-delete-${meal.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
