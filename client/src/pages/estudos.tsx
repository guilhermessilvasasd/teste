import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import { insertStudySchema, type Study, type InsertStudy } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Estudos() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<Study | null>(null);
  const { toast } = useToast();

  const { data: studies = [], isLoading } = useQuery<Study[]>({
    queryKey: ["/api/studies"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertStudy) =>
      apiRequest("/api/studies", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/studies"] });
      toast({ title: "Estudo adicionado com sucesso!" });
      setDialogOpen(false);
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InsertStudy }) =>
      apiRequest(`/api/studies/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/studies"] });
      toast({ title: "Estudo atualizado com sucesso!" });
      setDialogOpen(false);
      setEditingStudy(null);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/studies/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/studies"] });
      toast({ title: "Estudo removido com sucesso!" });
    },
  });

  const form = useForm<InsertStudy>({
    resolver: zodResolver(insertStudySchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      categoria: "",
      progresso: 0,
      data_inicio: "",
      data_conclusao: "",
      observacoes: "",
    },
  });

  const onSubmit = (data: InsertStudy) => {
    if (editingStudy) {
      updateMutation.mutate({ id: editingStudy.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (study: Study) => {
    setEditingStudy(study);
    form.reset({
      titulo: study.titulo,
      descricao: study.descricao || "",
      categoria: study.categoria,
      progresso: study.progresso,
      data_inicio: study.data_inicio || "",
      data_conclusao: study.data_conclusao || "",
      observacoes: study.observacoes || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este estudo?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingStudy(null);
      form.reset();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Estudos</h1>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-study">
              <Plus className="h-4 w-4 mr-2" />
              Novo Estudo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingStudy ? "Editar Estudo" : "Novo Estudo"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Curso de JavaScript"
                          data-testid="input-titulo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Programação, Idiomas..."
                          data-testid="input-categoria"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detalhes sobre o estudo..."
                          data-testid="input-descricao"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="progresso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Progresso (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          data-testid="input-progresso"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="data_inicio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Início</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            data-testid="input-data-inicio"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="data_conclusao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Conclusão</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            data-testid="input-data-conclusao"
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
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Notas adicionais..."
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
                  data-testid="button-submit-study"
                >
                  {editingStudy ? "Atualizar" : "Adicionar"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meus Estudos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Carregando...</p>
          ) : studies.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum estudo cadastrado. Adicione um novo estudo para começar.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studies.map((study) => (
                <Card key={study.id} data-testid={`study-item-${study.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{study.titulo}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {study.categoria}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(study)}
                          data-testid={`button-edit-${study.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(study.id)}
                          data-testid={`button-delete-${study.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {study.descricao && (
                      <p className="text-sm text-muted-foreground">
                        {study.descricao}
                      </p>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progresso</span>
                        <span className="font-mono font-semibold">
                          {study.progresso}%
                        </span>
                      </div>
                      <Progress value={study.progresso} />
                    </div>
                    {(study.data_inicio || study.data_conclusao) && (
                      <div className="text-sm text-muted-foreground space-y-1">
                        {study.data_inicio && (
                          <p>
                            Início:{" "}
                            {format(new Date(study.data_inicio), "dd/MM/yyyy")}
                          </p>
                        )}
                        {study.data_conclusao && (
                          <p>
                            Conclusão:{" "}
                            {format(new Date(study.data_conclusao), "dd/MM/yyyy")}
                          </p>
                        )}
                      </div>
                    )}
                    {study.observacoes && (
                      <p className="text-sm text-muted-foreground">
                        {study.observacoes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
