
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface StudentInfoProps {
  studentData: PreMatricula;
}

// Define the interface for the student data based on our Supabase schema
export interface PreMatricula {
  id: string;
  nomeAluno: string;
  dataNascimento: string;
  serie_pretendida: string;
  turnoPreferencia: string;
  escolaAtual: string;
  tipoEscola: string;
  repetente: boolean;
  dificuldadeAprendizagem: boolean;
  atendimentoEducacional: boolean;
  dificuldadeAtencao: boolean;
  diagnosticoTranstorno: boolean;
  dificuldadeSocializacao: boolean;
  usoMedicacao: boolean;
  laudoMedico: boolean;
  score: number;
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
  const BooleanDisplay = ({ value, label }: { value: boolean, label: string }) => {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium">{label}:</span>
        <span>
          {value ? 
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
            <BooleanDisplay value={Boolean(studentData.repetente)} label="Repetente" />
            <Separator />
            <BooleanDisplay value={Boolean(studentData.dificuldadeAprendizagem)} label="Dificuldade em leitura/escrita/matemática" />
            <Separator />
            <BooleanDisplay value={Boolean(studentData.atendimentoEducacional)} label="Atendimento educacional" />
            <Separator />
            <BooleanDisplay value={Boolean(studentData.dificuldadeAtencao)} label="Dificuldade de atenção" />
            <Separator />
            <BooleanDisplay value={Boolean(studentData.diagnosticoTranstorno)} label="Diagnóstico ou suspeita de transtorno" />
            <Separator />
            <BooleanDisplay value={Boolean(studentData.dificuldadeSocializacao)} label="Dificuldade de socialização" />
            <Separator />
            <BooleanDisplay value={Boolean(studentData.usoMedicacao)} label="Uso contínuo de medicação" />
            <Separator />
            <BooleanDisplay value={Boolean(studentData.laudoMedico)} label="Laudo médico/educacional" />
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
                Number(studentData.score) > 7 ? "text-school-red" : 
                Number(studentData.score) > 3 ? "text-school-yellow" : "text-school-green"
              }`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
