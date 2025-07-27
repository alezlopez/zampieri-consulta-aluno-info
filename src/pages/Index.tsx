
import { useState } from "react";
import { CPFInput } from "@/components/cpf-input";
import { StudentInfo, PreMatricula } from "@/components/student-info";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [cpf, setCpf] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState<PreMatricula | null>(null);
  const [studentsData, setStudentsData] = useState<PreMatricula[]>([]);
  const [notFound, setNotFound] = useState(false);
  const { signOut } = useAuth();

  const validateCPF = (cpf: string) => {
    // Simplified CPF validation - just checking if it has the right format
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf);
  };

  const handleSearch = async () => {
    // Reset states
    setStudentData(null);
    setStudentsData([]);
    setNotFound(false);
    
    // Validate CPF format
    if (!validateCPF(cpf)) {
      setCpfError("CPF inválido. Use o formato 000.000.000-00");
      return;
    }
    
    setCpfError("");
    setLoading(true);
    
    try {
      // Search with formatted CPF since that's how it's stored in the database
      const formattedCPF = cpf; // Keep the formatting (e.g., 123.456.789-00)
      
      // Use Supabase client with the formatted CPF - explicitly select all columns
      const { data, error } = await supabase
        .from('pre_matricula')
        .select('*')
        .eq('cpf', formattedCPF);
      
      if (error) {
        throw error;
      }
      
      // If no results with formatted CPF, try with digits only as fallback
      if (data && data.length === 0) {
        const cpfDigitsOnly = cpf.replace(/\D/g, '');
        
        const { data: dataDigitsOnly, error: errorDigitsOnly } = await supabase
          .from('pre_matricula')
          .select('*')
          .eq('cpf', cpfDigitsOnly);
          
        if (errorDigitsOnly) {
          throw errorDigitsOnly;
        }
        
        if (dataDigitsOnly && dataDigitsOnly.length > 0) {
          const students = dataDigitsOnly as PreMatricula[];
          setStudentsData(students);
          if (students.length === 1) {
            setStudentData(students[0]);
          }
        } else {
          setNotFound(true);
        }
      } else if (data && data.length > 0) {
        const students = data as PreMatricula[];
        setStudentsData(students);
        if (students.length === 1) {
          setStudentData(students[0]);
        }
      } else {
        setNotFound(true);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na consulta",
        description: "Ocorreu um erro ao consultar os dados. Tente novamente mais tarde."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (student: PreMatricula) => {
    setStudentData(student);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-school-darkGreen text-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Consulta de Pré-matrícula</h1>
            <p className="text-school-lightGreen mt-1">Colégio Zampieri</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="text-sm">Usuário logado</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={signOut}
              className="text-white border-white hover:bg-white hover:text-school-darkGreen bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4 text-school-darkGreen">Buscar Aluno</h2>
            
            <div className="space-y-4">
              <CPFInput
                value={cpf}
                onChange={setCpf}
                error={cpfError}
              />
              
              <Button 
                onClick={handleSearch} 
                className="w-full bg-school-green hover:bg-school-darkGreen"
              >
                Buscar
              </Button>
            </div>
          </div>
          
          {loading && <Loader />}
          
          {notFound && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-4">
              <AlertCircle className="text-school-red h-8 w-8 flex-shrink-0" />
              <p className="font-medium text-red-800">❌ Nenhum aluno encontrado com esse CPF.</p>
            </div>
          )}
          
          {studentsData.length > 1 && !studentData && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-lg font-semibold mb-4 text-school-darkGreen">
                Múltiplos alunos encontrados - Selecione o aluno desejado:
              </h3>
              <div className="space-y-3">
                {studentsData.map((student, index) => (
                  <div 
                    key={student.id || index}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleStudentSelect(student)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-school-darkGreen">{student.nomeAluno}</h4>
                        <p className="text-sm text-gray-600">Série: {student.serie_pretendida}</p>
                        <p className="text-sm text-gray-600">Data de nascimento: {student.dataNascimento}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Criado em: {student.created_at}</p>
                        {student.Status && (
                          <p className="text-sm font-medium text-school-green">Status: {student.Status}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {studentData && <StudentInfo studentData={studentData} />}
        </div>
      </main>
      
      <footer className="bg-gray-100 border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Colégio Zampieri - Sistema de Consulta de Pré-matrícula
        </div>
      </footer>
    </div>
  );
};

export default Index;
