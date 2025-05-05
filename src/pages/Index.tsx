
import { useState } from "react";
import { CPFInput } from "@/components/cpf-input";
import { StudentInfo, PreMatricula } from "@/components/student-info";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [cpf, setCpf] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState<PreMatricula | null>(null);
  const [notFound, setNotFound] = useState(false);

  const validateCPF = (cpf: string) => {
    // Simplified CPF validation - just checking if it has the right format
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf);
  };

  const handleSearch = async () => {
    // Reset states
    setStudentData(null);
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
      
      console.log("Searching for formatted CPF:", formattedCPF);
      
      // Use Supabase client with the formatted CPF
      const { data, error } = await supabase
        .from('pre_matricula')
        .select('*')
        .eq('cpf', formattedCPF);
      
      if (error) {
        throw error;
      }
      
      console.log("Query result:", data);
      
      // If no results with formatted CPF, try with digits only as fallback
      if (data && data.length === 0) {
        console.log("No results with formatted CPF, trying with digits only");
        const cpfDigitsOnly = cpf.replace(/\D/g, '');
        
        const { data: dataDigitsOnly, error: errorDigitsOnly } = await supabase
          .from('pre_matricula')
          .select('*')
          .eq('cpf', cpfDigitsOnly);
          
        if (errorDigitsOnly) {
          throw errorDigitsOnly;
        }
        
        console.log("Query result with digits only:", dataDigitsOnly);
        
        if (dataDigitsOnly && dataDigitsOnly.length > 0) {
          setStudentData(dataDigitsOnly[0] as PreMatricula);
        } else {
          setNotFound(true);
        }
      } else if (data && data.length > 0) {
        setStudentData(data[0] as PreMatricula);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast({
        variant: "destructive",
        title: "Erro na consulta",
        description: "Ocorreu um erro ao consultar os dados. Tente novamente mais tarde."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-school-darkBlue text-white p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">Consulta de Pré-matrícula</h1>
          <p className="text-school-lightBlue mt-1">Colégio Zampieri</p>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4 text-school-darkBlue">Buscar Aluno</h2>
            
            <div className="space-y-4">
              <CPFInput
                value={cpf}
                onChange={setCpf}
                error={cpfError}
              />
              
              <Button 
                onClick={handleSearch} 
                className="w-full bg-school-blue hover:bg-school-darkBlue"
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

