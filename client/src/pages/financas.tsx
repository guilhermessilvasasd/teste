import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFinanceSchema, type Finance, type InsertFinance } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Financas() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFinance, setEditingFinance] = useState<Finance | null>(null);
  const { toast } = useToast();

  const { data: finances = [], isLoading } = useQuery<Finance[]>({
    queryKey: ["/api/finances"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertFinance) =>
      apiRequest("/api/finances", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/finances"] });
      toast({ title: "Transação adicionada com sucesso!" });
      setDialogOpen(false);
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InsertFinance }) =>
      apiRequest(`/api/finances/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/finances"] });
      toast({ title: "Transação atualizada com sucesso!" });
      setDialogOpen(false);
      setEditingFinance(null);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/finances/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/finances"] });
      toast({ title: "Transação removida com sucesso!" });
    },
  });

  const form = useForm<InsertFinance>({
    resolver: zodResolver(insertFinanceSchema),
    defaultValues: {
      descricao: "",
      valor: "0",
      categoria: "",
      tipo: "despesa",
      data: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const onSubmit = (data: InsertFinance) => {
    if (editingFinance) {
      updateMutation.mutate({ id: editingFinance.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (finance: Finance) => {
    setEditingFinance(finance);
    form.reset({
      descricao: finance.descricao,
      valor: finance.valor,
      categoria: finance.categoria,
      tipo: finance.tipo,
      data: finance.data,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta transação?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingFinance(null);
      form.reset();
    }
  };

  const totalReceitas = finances
    .filter((f) => f.tipo === "receita")
    .reduce((sum, f) => sum + parseFloat(f.valor), 0);

  const totalDespesas = finances
    .filter((f) => f.tipo === "despesa")
    .reduce((sum, f) => sum + parseFloat(f.valor), 0);

  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Finanças</h1>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-finance">
              <Plus className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingFinance ? "Editar Transação" : "Nova Transação"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Salário, Supermercado..."
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
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          data-testid="input-valor"
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
                          placeholder="Ex: Alimentação, Transporte..."
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
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-tipo">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="receita">Receita</SelectItem>
                          <SelectItem value="despesa">Despesa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit-finance"
                >
                  {editingFinance ? "Atualizar" : "Adicionar"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="text-receitas">
              R$ {totalReceitas.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="text-despesas">
              R$ {totalDespesas.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold font-mono ${saldo >= 0 ? "text-green-600" : "text-red-600"
                }`}
              data-testid="text-saldo"
            >
              R$ {saldo.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Carregando...</p>
          ) : finances.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma transação cadastrada. Adicione uma nova transação para começar.
            </p>
          ) : (
            <div className="space-y-2">
              {finances.map((finance) => (
                <div
                  key={finance.id}
                  className="flex items-center justify-between p-4 rounded-md border"
                  data-testid={`finance-item-${finance.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{finance.descricao}</h3>
                      <span className="text-xs text-muted-foreground">
                        {finance.categoria}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(finance.data), "dd/MM/yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-lg font-bold font-mono ${finance.tipo === "receita"
                          ? "text-green-600"
                          : "text-red-600"
                        }`}
                    >
                      {finance.tipo === "receita" ? "+" : "-"} R${" "}
                      {parseFloat(finance.valor).toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(finance)}
                        data-testid={`button-edit-${finance.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(finance.id)}
                        data-testid={`button-delete-${finance.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
