
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmInterview = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('pre_matricula')
        .update({ Status: 'Entrevista Realizada' })
        .eq('id', studentData.id);

      if (error) {
        throw error;
      }
      
      toast({
        title: "Sucesso",
        description: "Status atualizado para 'Entrevista Realizada'!",
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar o status. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                  <Button
                    onClick={() => window.open(studentData.boletim, '_blank')}
                    variant="outline"
                    className="mt-2"
                  >
                    Visualizar
                  </Button>
                </div>
              </>
            )}

            <Separator />
            
            <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary">
              <h3 className="text-sm font-medium text-primary mb-2">Status da Matrícula</h3>
              <p className="text-xl font-bold text-primary">{studentData.Status || 'Pendente'}</p>
            </div>

            <Separator />
            
            <div className="flex justify-center">
              <Button 
                onClick={handleConfirmInterview}
                disabled={isLoading}
                className="bg-school-darkGreen hover:bg-school-darkGreen/90 text-white px-8 py-2"
              >
                {isLoading ? 'Enviando...' : 'Confirmar Entrevista'}
              </Button>
            </div>
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
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Laudo médico/educacional:</span>
              <div className="flex items-center gap-2">
                <span>
                  {studentData.laudoMedico ? 
                    <span className="text-school-green">✅</span> : 
                    <span className="text-school-red">❌</span>
                  }
                </span>
                {studentData.laudoMedico && (
                  <Button
                    onClick={() => window.open(studentData.laudoMedico, '_blank')}
                    variant="outline"
                    size="sm"
                  >
                    Visualizar
                  </Button>
                )}
              </div>
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
