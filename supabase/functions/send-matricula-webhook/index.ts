import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

// CORS headers for web app requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StudentData {
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
}

interface WebhookPayload {
  studentData: StudentData;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentData }: WebhookPayload = await req.json();

    console.log('Sending webhook for student matricula:', {
      studentId: studentData.id,
      studentName: studentData.nomeAluno,
      status: studentData.Status,
      desconto: studentData.desconto
    });

    // Prepare webhook payload
    const webhookPayload = {
      event: 'matricula_confirmada',
      timestamp: new Date().toISOString(),
      data: {
        aluno: {
          id: studentData.id,
          nome: studentData.nomeAluno,
          dataNascimento: studentData.dataNascimento,
          cpf: studentData.cpf,
          email: studentData.email,
          whatsapp: studentData.whatsapp
        },
        responsavel: {
          nome: studentData.nomeResponsavel
        },
        matricula: {
          serie_pretendida: studentData.serie_pretendida,
          turnoPreferencia: studentData.turnoPreferencia,
          escolaAtual: studentData.escolaAtual,
          tipoEscola: studentData.tipoEscola,
          status: studentData.Status,
          desconto: studentData.desconto ? `${studentData.desconto}%` : null,
          dataConfirmacao: new Date().toISOString()
        },
        avaliacaoPedagogica: {
          repetente: studentData.repetente,
          dificuldadeAprendizagem: studentData.dificuldadeAprendizagem,
          atendimentoEducacional: studentData.atendimentoEducacional,
          dificuldadeAtencao: studentData.dificuldadeAtencao,
          diagnosticoTranstorno: studentData.diagnosticoTranstorno,
          dificuldadeSocializacao: studentData.dificuldadeSocializacao,
          usoMedicacao: studentData.usoMedicacao
        },
        documentos: {
          boletim: studentData.boletim,
          laudoMedico: studentData.laudoMedico
        },
        entrevista: {
          data: studentData.data_entrevista,
          link: studentData.link_entrevista
        }
      }
    };

    // Here you would normally send to your webhook endpoint
    // For now, we'll just log it and simulate success
    console.log('Webhook payload prepared:', JSON.stringify(webhookPayload, null, 2));

    // Example webhook call (uncomment and modify with your actual webhook URL):
    /*
    const webhookUrl = Deno.env.get('WEBHOOK_URL');
    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Colégio-Zampieri-Webhook/1.0'
        },
        body: JSON.stringify(webhookPayload)
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status: ${response.status}`);
      }

      console.log('Webhook sent successfully');
    }
    */

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully',
        webhookPayload 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});