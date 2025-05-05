
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface StudentInfoProps {
  studentData: PreMatricula;
}

// Define the interface for the student data based on our Supabase schema
export interface PreMatricula {
  id: number; // Changed from string to number to match Supabase
  nomeAluno: string;
  dataNascimento: string;
  serie_pretendida: string;
  turnoPreferencia: string;
  escolaAtual: string;
  tipoEscola: string;
  repetente: string | null; // Changed from boolean to string to match Supabase
  dificuldadeAprendizagem: string | null; // Changed from boolean to string
  atendimentoEducacional: string | null; // Changed from boolean to string
  dificuldadeAtencao: string | null; // Changed from boolean to string
  diagnosticoTranstorno: string | null; // Changed from boolean to string
  dificuldadeSocializacao: string | null; // Changed from boolean to string
  usoMedicacao: string | null; // Changed from boolean to string
  laudoMedico: string | null; // Changed from boolean to string
  score: string | null; // Changed from number to string to match Supabase
  // Additional fields from the database schema
  cpf?: string;
  email?: string;
  whatsapp?: string;
  boletim?: string;
  nomeResponsavel?: string;
  created_at?: string;
}

export function StudentInfo({ studentData }: StudentInfoProps) {
  // Helper function to display boolean values as icons
  const BooleanDisplay = ({ value, label }: { value: string | null, label: string }) => {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium">{label}:</span>
        <span>
          {value === "true" || value === "1" ? 
            <CheckCircle className="h-5 w-5 text-school-red" /> : 
            <XCircle className="h-5 w-5 text-school-green" />
          }
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-school-lightBlue">
          <CardTitle className="text-school-darkBlue">Dados do Aluno</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nome do aluno</h3>
                <p className="text-lg font-semibold">{studentData.nomeAluno}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Data de nascimento</h3>
                <p className="text-lg font-semibold">{formatDate(studentData.dataNascimento)}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Série pretendida</h3>
                <p className="text-lg font-semibold">{studentData.serie_pretendida}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Turno de preferência</h3>
                <p className="text-lg font-semibold">{studentData.turnoPreferencia}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Escola atual</h3>
                <p className="text-lg font-semibold">{studentData.escolaAtual}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tipo de escola</h3>
                <p className="text-lg font-semibold">{studentData.tipoEscola}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="bg-school-lightBlue">
          <CardTitle className="text-school-darkBlue">Avaliação Pedagógica</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-2">
            <BooleanDisplay value={studentData.repetente} label="Repetente" />
            <Separator />
            <BooleanDisplay value={studentData.dificuldadeAprendizagem} label="Dificuldade em leitura/escrita/matemática" />
            <Separator />
            <BooleanDisplay value={studentData.atendimentoEducacional} label="Atendimento educacional" />
            <Separator />
            <BooleanDisplay value={studentData.dificuldadeAtencao} label="Dificuldade de atenção" />
            <Separator />
            <BooleanDisplay value={studentData.diagnosticoTranstorno} label="Diagnóstico ou suspeita de transtorno" />
            <Separator />
            <BooleanDisplay value={studentData.dificuldadeSocializacao} label="Dificuldade de socialização" />
            <Separator />
            <BooleanDisplay value={studentData.usoMedicacao} label="Uso contínuo de medicação" />
            <Separator />
            <BooleanDisplay value={studentData.laudoMedico} label="Laudo médico/educacional" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="bg-school-lightBlue">
          <CardTitle className="text-school-darkBlue">Resultado Interno</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Score calculado:</h3>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">{studentData.score}</span>
              <AlertCircle className={`h-5 w-5 ${
                studentData.score && parseInt(studentData.score) > 7 ? "text-school-red" : 
                studentData.score && parseInt(studentData.score) > 3 ? "text-school-yellow" : "text-school-green"
              }`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
