import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader } from '@/components/loader';
import { LogOut } from 'lucide-react';

interface Student {
  id: number;
  nomeAluno: string | null;
  nomeResponsavel: string | null;
  whatsapp: string | null;
  Status: string | null;
}

const AdminPage = () => {
  const { user, signOut } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('pre_matricula')
        .select('id, nomeAluno, nomeResponsavel, whatsapp, Status')
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
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
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
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.Status === 'Aprovado' 
                              ? 'bg-green-100 text-green-800'
                              : student.Status === 'Reprovado'
                              ? 'bg-red-100 text-red-800'
                              : student.Status?.includes('Pendente')
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {student.Status || 'Sem Status'}
                          </span>
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
    </div>
  );
};

export default AdminPage;