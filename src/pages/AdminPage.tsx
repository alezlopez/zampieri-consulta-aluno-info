import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader } from '@/components/loader';
import { LogOut, Trash2 } from 'lucide-react';

interface Student {
  id: number;
  nomeAluno: string | null;
  nomeResponsavel: string | null;
  whatsapp: string | null;
  Status: string | null;
  desconto: string | null;
  data_entrevista: string | null;
}

const ALL_STATUSES = [
  'Avaliação Agendada',
  'CPF Aprovado - Aguardando Agendamento',
  'CPF Negativo - Reprovado',
  'Concluido - Contrato Assinado',
  'Contrato Enviado',
  'Entrevista Realizada - Matrícula Pendente',
];

const AdminPage = () => {
  const { user, signOut } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('pre_matricula')
        .select('id, nomeAluno, nomeResponsavel, whatsapp, Status, desconto, data_entrevista')
        .order('nomeAluno');

      if (error) {
        throw error;
      }

      const studentData = data as Student[];
      setStudents(studentData);
      setFilteredStudents(studentData);

      // Extract unique statuses
      const statuses = [...new Set(studentData.map(s => s.Status).filter(Boolean))].sort();
      setAvailableStatuses(statuses);

    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados dos alunos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStudents();
    }
  }, [user]);

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(students.filter(student => student.Status === selectedStatus));
    }
  }, [selectedStatus, students]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  const handleStatusChange = async (studentId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('pre_matricula')
        .update({ Status: newStatus })
        .eq('id', studentId);

      if (error) {
        throw error;
      }

      // Atualiza a lista localmente
      setStudents(prev => prev.map(s => 
        s.id === studentId ? { ...s, Status: newStatus } : s
      ));

      toast({
        title: "Status atualizado",
        description: `Status alterado para "${newStatus}"`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar o status",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('pre_matricula')
        .delete()
        .eq('id', studentToDelete.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Registro excluído",
        description: `O registro de ${studentToDelete.nomeAluno || 'aluno'} foi excluído com sucesso.`,
      });

      // Atualiza a lista removendo o aluno excluído
      setStudents(prev => prev.filter(s => s.id !== studentToDelete.id));
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao excluir o registro",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-school-lightGreen to-school-green/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <img src="/lovable-uploads/a19b7b63-1082-4838-8ae7-2c0396b4bdc4.png" alt="Logo" className="h-12 w-auto" />
            <h1 className="text-2xl font-bold text-school-darkGreen">Painel Administrativo</h1>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        {/* Filter Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-school-darkGreen">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex flex-col w-full sm:w-auto">
                <label className="text-sm font-medium text-gray-700 mb-2">Filtrar por Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-64">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    {availableStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-gray-600">
                {filteredStudents.length} aluno(s) encontrado(s)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-school-darkGreen">Lista de Alunos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Aluno</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Desconto</TableHead>
                    <TableHead>Data da Entrevista</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-20 text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        Nenhum aluno encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.nomeAluno || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {student.nomeResponsavel || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {student.whatsapp || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {student.desconto || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {(student.Status === 'Avaliação Agendada' || student.Status === 'Entrevista Realizada - Matrícula Pendente') 
                            ? (student.data_entrevista || 'N/A') 
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={student.Status || ''} 
                            onValueChange={(value) => handleStatusChange(student.id, value)}
                          >
                            <SelectTrigger className="w-48 h-8 text-xs">
                              <SelectValue placeholder="Selecionar status" />
                            </SelectTrigger>
                            <SelectContent>
                              {ALL_STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(student)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o registro de{' '}
              <strong>{studentToDelete?.nomeAluno || 'este aluno'}</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPage;
