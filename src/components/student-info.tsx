
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
  desconto: string | null;
  codigo_aluno: string | null;
  possui_terapeuta_ocupacional: string | null;
  nome_terapeuta_ocupacional: string | null;
  Rg_terapeuta_ocupacional: string | null;
  telefone_terapeuta_ocupacional: string | null;
  link_contrato: string | null;
  obs_entrevista: string | null;
  data_reavaliacao: string | null;
}

export function StudentInfo({ studentData }: StudentInfoProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<string>("");
  const [showObservationsDialog, setShowObservationsDialog] = useState(false);
  const [observations, setObservations] = useState<string>("");

  const getUIControls = () => {
    const status = studentData.Status;
    
    if (status === 'Avaliação Agendada') {
      return {
        showDropdown: true,
        showConfirmButton: true,
        showPendentButton: true,
        requireDiscount: true
      };
    } else if (status === 'Reavaliação por Pendencias - Agendamento Confirmado' || 
               status === 'Reavaliação por Pendencias  - Agendamento Confirmado') {
      return {
        showDropdown: false,
        showConfirmButton: true,
        showPendentButton: false,
        requireDiscount: false
      };
    } else {
      return {
        showDropdown: false,
        showConfirmButton: false,
        showPendentButton: false,
        requireDiscount: false
      };
    }
  };

  const handleConfirmInterview = async () => {
    const uiControls = getUIControls();
    
    if (uiControls.requireDiscount && !selectedDiscount) {
      toast({
        title: "Erro",
        description: "Por favor, selecione o desconto",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const newStatus = 'Entrevista Realizada - Matrícula Pendente';
      const successMessage = "Status atualizado para 'Entrevista Realizada - Matrícula Pendente'";

      const updateData: any = { 
        Status: newStatus
      };

      // Só adiciona desconto se for obrigatório
      if (uiControls.requireDiscount && selectedDiscount) {
        updateData.desconto = selectedDiscount;
      }

      const { error } = await supabase
        .from('pre_matricula')
        .update(updateData)
        .eq('id', studentData.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Sucesso",
        description: successMessage,
      });

      // Atualizar o estado local para refletir a mudança
      studentData.Status = newStatus;
      if (selectedDiscount) {
        studentData.desconto = selectedDiscount;
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDiscountOptions = () => {
    const serie = studentData.serie_pretendida;
    
    if (!serie) return ['5', '15', '35'];
    
    const serieNormalized = serie.toLowerCase();
    
    // Se a série pretendida for pré
    if (serieNormalized.includes('pré') || serieNormalized.includes('pre')) {
      return ['5', '30', '60'];
    }
    
    // Se a série pretendida for 1º ano, 2º ano, 3º ano, 6º ano, 1º Médio e 2º Médio
    if (serieNormalized.includes('1º ano') || serieNormalized.includes('2º ano') || 
        serieNormalized.includes('3º ano') || serieNormalized.includes('6º ano') ||
        serieNormalized.includes('1º médio') || serieNormalized.includes('2º médio')) {
      return ['5', '15', '35', '40'];
    }
    
    // Se a série pretendida for 4º ano
    if (serieNormalized.includes('4º ano')) {
      return ['5', '15', '35'];
    }
    
    // Se a série pretendida for 5º ano, 8º ano e 3º Médio
    if (serieNormalized.includes('5º ano') || serieNormalized.includes('8º ano') || 
        serieNormalized.includes('3º médio')) {
      return ['5', '15', '35', '40', '50'];
    }
    
    // Default caso não se encaixe em nenhuma regra específica
    return ['5', '15', '35'];
  };

  const handlePendingWithObservations = async () => {
    if (!observations.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira as observações",
        variant: "destructive",
      });
      return;
    }

    const uiControls = getUIControls();
    if (uiControls.requireDiscount && !selectedDiscount) {
      toast({
        title: "Erro",
        description: "Por favor, selecione o desconto na mensalidade",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const newStatus = 'Entrevista Realizada - Pendente';
      const successMessage = "Status atualizado para 'Entrevista Realizada - Pendente'";

      const updateData: any = {
        Status: newStatus,
        obs_entrevista: observations
      };

      // Só adiciona desconto se for obrigatório
      if (uiControls.requireDiscount && selectedDiscount) {
        updateData.desconto = selectedDiscount;
      }

      const { error } = await supabase
        .from('pre_matricula')
        .update(updateData)
        .eq('id', studentData.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Sucesso",
        description: successMessage,
      });

      // Atualizar o estado local para refletir a mudança
      studentData.Status = newStatus;
      studentData.obs_entrevista = observations;
      if (selectedDiscount) {
        studentData.desconto = selectedDiscount;
      }
      
      // Fechar o dialog e limpar observações
      setShowObservationsDialog(false);
      setObservations("");
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    return 'Confirmar Entrevista';
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
        <CardHeader className="bg-primary/10">
          <CardTitle className="text-primary">Status da Matrícula</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xl sm:text-2xl font-bold text-primary">{studentData.Status || 'Pendente'}</p>
            {(() => {
              const uiControls = getUIControls();
              const isButtonDisabled = uiControls.requireDiscount && !selectedDiscount;
              
              return (uiControls.showConfirmButton || uiControls.showPendentButton) && (
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full sm:w-auto">
                  {uiControls.showDropdown && (
                    <div className="flex flex-col w-full sm:w-auto">
                      <label className="text-sm font-medium text-gray-500 mb-2">Desconto na mensalidade</label>
                      <Select value={selectedDiscount} onValueChange={setSelectedDiscount}>
                        <SelectTrigger className="w-full sm:w-40">
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {getDiscountOptions().map((discount) => (
                            <SelectItem key={discount} value={discount}>
                              {discount}%
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {uiControls.showConfirmButton && (
                      <Button 
                        onClick={handleConfirmInterview}
                        disabled={isLoading || isButtonDisabled}
                        className="bg-school-darkGreen hover:bg-school-darkGreen/90 text-white w-full sm:w-auto px-4 sm:px-8 py-2"
                      >
                        {isLoading ? 'Enviando...' : getButtonText()}
                      </Button>
                    )}
                    {uiControls.showPendentButton && (
                      <Button 
                        onClick={() => setShowObservationsDialog(true)}
                        disabled={isLoading || isButtonDisabled}
                        variant="destructive"
                        className="w-full sm:w-auto px-4 sm:px-8 py-2"
                      >
                        Pendente
                      </Button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </CardContent>
      </Card>

      {(studentData.Status === 'Reavaliação por Pendencias - Agendamento Confirmado' || 
        studentData.Status === 'Reavaliação por Pendencias  - Agendamento Confirmado') && 
        studentData.data_reavaliacao && (
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">Data de Reavaliação</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-lg font-semibold text-blue-800">{formatDate(studentData.data_reavaliacao)}</p>
          </CardContent>
        </Card>
      )}

      {studentData.Status === 'Entrevista Realizada - Pendente' && studentData.obs_entrevista && (
        <Card>
          <CardHeader className="bg-yellow-50">
            <CardTitle className="text-yellow-800">Observações da Entrevista</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-800 whitespace-pre-wrap">{studentData.obs_entrevista}</p>
          </CardContent>
        </Card>
      )}

      {(studentData.Status === 'Avaliação Agendada' || studentData.data_entrevista || studentData.link_entrevista) && (
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
                  <Button
                    onClick={() => window.open(studentData.link_entrevista, '_blank')}
                    variant="outline"
                    className="mt-2 w-full sm:w-auto"
                  >
                    Acessar Link
                  </Button>
                </div>
              )}
              
              {studentData.Status === 'Avaliação Agendada' && !studentData.data_entrevista && !studentData.link_entrevista && (
                <div className="text-center py-4">
                  <p className="text-gray-500">Informações da entrevista serão exibidas quando disponíveis</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="bg-school-lightGreen">
          <CardTitle className="text-school-darkGreen">Dados do Aluno</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
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
                    className="mt-2 w-full sm:w-auto"
                  >
                    Visualizar
                  </Button>
                </div>
              </>
            )}

            {studentData.desconto && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Desconto aplicado</h3>
                  <p className="text-lg font-semibold text-green-600">{studentData.desconto}%</p>
                </div>
              </>
            )}

            {studentData.codigo_aluno && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Código do aluno</h3>
                  <p className="text-lg font-semibold">{studentData.codigo_aluno}</p>
                </div>
              </>
            )}

            {studentData.link_contrato && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contrato</h3>
                  <Button
                    onClick={() => window.open(studentData.link_contrato, '_blank')}
                    variant="outline"
                    className="mt-2 w-full sm:w-auto"
                  >
                    Visualizar contrato
                  </Button>
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
      


      {(studentData.possui_terapeuta_ocupacional === 'sim' || studentData.possui_terapeuta_ocupacional === 'Sim' || studentData.possui_terapeuta_ocupacional === 'true') && (
        <Card>
          <CardHeader className="bg-school-lightGreen">
            <CardTitle className="text-school-darkGreen">Informações do Terapeuta Ocupacional</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {studentData.nome_terapeuta_ocupacional && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nome do terapeuta</h3>
                  <p className="text-lg font-semibold">{studentData.nome_terapeuta_ocupacional}</p>
                </div>
              )}
              
              {studentData.Rg_terapeuta_ocupacional && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">RG do terapeuta</h3>
                    <p className="text-lg font-semibold">{studentData.Rg_terapeuta_ocupacional}</p>
                  </div>
                </>
              )}

              {studentData.telefone_terapeuta_ocupacional && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Telefone do terapeuta</h3>
                    <p className="text-lg font-semibold">{studentData.telefone_terapeuta_ocupacional}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}


      <Dialog open={showObservationsDialog} onOpenChange={setShowObservationsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Observações da Entrevista</DialogTitle>
            <DialogDescription>
              Adicione observações sobre a entrevista. O status será alterado para "Entrevista Realizada - Pendente".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Digite suas observações aqui..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowObservationsDialog(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handlePendingWithObservations}
              disabled={isLoading || !observations.trim()}
              variant="destructive"
            >
              {isLoading ? 'Salvando...' : 'Confirmar Pendente'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
