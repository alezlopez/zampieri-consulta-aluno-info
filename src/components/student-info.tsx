
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface StudentInfoProps {
  studentData: PreMatricula;
}

// Define the interface for the student data based on our Supabase schema
export interface PreMatricula {
  id: number;
  nomeAluno: string | null;
  dataNascimento: string | null;
  serie_pretendida: string | null;
  turnoPreferencia: string | null;
  escolaAtual: string | null;
  tipoEscola: string | null;
  repetente: string | null;
  dificuldadeAprendizagem: string | null;
  atendimentoEducacional: string | null;
  dificuldadeAtencao: string | null;
  diagnosticoTranstorno: string | null;
  dificuldadeSocializacao: string | null;
  usoMedicacao: string | null;
  laudoMedico: string | null;
  score: string | null;
  cpf: string | null;
  email: string | null;
  whatsapp: string | null;
  boletim: string | null;
  nomeResponsavel: string | null;
  created_at: string;
  Status: string | null;
  data_entrevista: string | null;
  link_entrevista: string | null;
}

export function StudentInfo({ studentData }: StudentInfoProps) {
  // Helper function to display boolean values as icons
  const BooleanDisplay = ({ value, label }: { value: string | null, label: string }) => {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium">{label}:</span>
        <span>
          {value === "true" || value === "1" || value === "sim" || value === "Sim" ? 
            <span className="text-school-green">✅</span> : 
            <span className="text-school-red">❌</span>
          }
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-school-lightGreen">
          <CardTitle className="text-school-darkGreen">Dados do Aluno</CardTitle>
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
                <p className="text-lg font-semibold">{formatDate(studentData.dataNascimento || '')}</p>
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

            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nome do responsável</h3>
                <p className="text-lg font-semibold">{studentData.nomeResponsavel || 'Não informado'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contato</h3>
                <p className="text-lg font-semibold">{studentData.whatsapp || 'Não informado'}</p>
              </div>
            </div>
            
            {studentData.email && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-lg font-semibold">{studentData.email}</p>
                </div>
              </>
            )}

            {studentData.boletim && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Boletim</h3>
                  <p className="text-lg font-semibold">{studentData.boletim}</p>
                </div>
              </>
            )}

            {studentData.Status && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="text-lg font-semibold">{studentData.Status}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="bg-school-lightGreen">
          <CardTitle className="text-school-darkGreen">Avaliação Pedagógica</CardTitle>
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
        <CardHeader className="bg-school-lightGreen">
          <CardTitle className="text-school-darkGreen">Resultado Interno</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Score calculado:</h3>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">{studentData.score || '0'}</span>
              <AlertCircle className={`h-5 w-5 ${
                studentData.score && parseInt(studentData.score) > 7 ? "text-school-red" : 
                studentData.score && parseInt(studentData.score) > 3 ? "text-school-gold" : "text-school-green"
              }`} />
            </div>
          </div>
        </CardContent>
      </Card>

      {(studentData.data_entrevista || studentData.link_entrevista) && (
        <Card>
          <CardHeader className="bg-school-lightGreen">
            <CardTitle className="text-school-darkGreen">Informações da Entrevista</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {studentData.data_entrevista && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Data da entrevista</h3>
                  <p className="text-lg font-semibold">{formatDate(studentData.data_entrevista)}</p>
                </div>
              )}
              
              {studentData.link_entrevista && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Link da entrevista</h3>
                  <a 
                    href={studentData.link_entrevista} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-school-darkGreen hover:underline"
                  >
                    Acessar link da entrevista
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
