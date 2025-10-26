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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWorkoutSchema, type Workout, type InsertWorkout } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Treinos() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const { toast } = useToast();

  const { data: workouts = [], isLoading } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertWorkout) =>
      apiRequest("/api/workouts", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({ title: "Treino adicionado com sucesso!" });
      setDialogOpen(false);
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InsertWorkout }) =>
      apiRequest(`/api/workouts/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({ title: "Treino atualizado com sucesso!" });
      setDialogOpen(false);
      setEditingWorkout(null);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/workouts/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({ title: "Treino removido com sucesso!" });
    },
  });

  const form = useForm<InsertWorkout>({
    resolver: zodResolver(insertWorkoutSchema),
    defaultValues: {
      exercicio: "",
      series: 3,
      repeticoes: 10,
      peso: "0",
      data: format(new Date(), "yyyy-MM-dd"),
      observacoes: "",
    },
  });

  const onSubmit = (data: InsertWorkout) => {
    if (editingWorkout) {
      updateMutation.mutate({ id: editingWorkout.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout);
    form.reset({
      exercicio: workout.exercicio,
      series: workout.series,
      repeticoes: workout.repeticoes,
      peso: workout.peso || "0",
      data: workout.data,
      observacoes: workout.observacoes || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este treino?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingWorkout(null);
      form.reset();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Treinos</h1>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-workout">
              <Plus className="h-4 w-4 mr-2" />
              Novo Treino
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingWorkout ? "Editar Treino" : "Novo Treino"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="exercicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercício</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Supino, Agachamento..."
                          data-testid="input-exercicio"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="series"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Séries</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            data-testid="input-series"
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
                    name="repeticoes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Repetições</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            data-testid="input-repeticoes"
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
                    name="peso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.5"
                            data-testid="input-peso"
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
                          placeholder="Notas sobre o treino..."
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
                  data-testid="button-submit-workout"
                >
                  {editingWorkout ? "Atualizar" : "Adicionar"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Treinos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Carregando...</p>
          ) : workouts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum treino cadastrado. Adicione um novo treino para começar.
            </p>
          ) : (
            <div className="space-y-2">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-4 rounded-md border"
                  data-testid={`workout-item-${workout.id}`}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{workout.exercicio}</h3>
                    <p className="text-sm text-muted-foreground">
                      {workout.series}x{workout.repeticoes} {workout.peso && `• ${workout.peso}kg`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(workout.data), "dd/MM/yyyy")}
                    </p>
                    {workout.observacoes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {workout.observacoes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(workout)}
                      data-testid={`button-edit-${workout.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(workout.id)}
                      data-testid={`button-delete-${workout.id}`}
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
