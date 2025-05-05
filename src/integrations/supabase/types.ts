export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      financeiro: {
        Row: {
          created_at: string
          id: number
          nome_usuario: string | null
          whatsapp_usuario: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          nome_usuario?: string | null
          whatsapp_usuario?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          nome_usuario?: string | null
          whatsapp_usuario?: string | null
        }
        Relationships: []
      }
      pre_matricula: {
        Row: {
          atendimentoEducacional: string | null
          boletim: string | null
          cpf: string | null
          created_at: string
          data_entrevista: string | null
          dataNascimento: string | null
          diagnosticoTranstorno: string | null
          dificuldadeAprendizagem: string | null
          dificuldadeAtencao: string | null
          dificuldadeSocializacao: string | null
          email: string | null
          escolaAtual: string | null
          id: number
          laudoMedico: string | null
          link_entrevista: string | null
          nomeAluno: string | null
          nomeResponsavel: string | null
          repetente: string | null
          score: string | null
          serie_pretendida: string | null
          Status: string | null
          tipoEscola: string | null
          turnoPreferencia: string | null
          usoMedicacao: string | null
          whatsapp: string | null
        }
        Insert: {
          atendimentoEducacional?: string | null
          boletim?: string | null
          cpf?: string | null
          created_at: string
          data_entrevista?: string | null
          dataNascimento?: string | null
          diagnosticoTranstorno?: string | null
          dificuldadeAprendizagem?: string | null
          dificuldadeAtencao?: string | null
          dificuldadeSocializacao?: string | null
          email?: string | null
          escolaAtual?: string | null
          id?: number
          laudoMedico?: string | null
          link_entrevista?: string | null
          nomeAluno?: string | null
          nomeResponsavel?: string | null
          repetente?: string | null
          score?: string | null
          serie_pretendida?: string | null
          Status?: string | null
          tipoEscola?: string | null
          turnoPreferencia?: string | null
          usoMedicacao?: string | null
          whatsapp?: string | null
        }
        Update: {
          atendimentoEducacional?: string | null
          boletim?: string | null
          cpf?: string | null
          created_at?: string
          data_entrevista?: string | null
          dataNascimento?: string | null
          diagnosticoTranstorno?: string | null
          dificuldadeAprendizagem?: string | null
          dificuldadeAtencao?: string | null
          dificuldadeSocializacao?: string | null
          email?: string | null
          escolaAtual?: string | null
          id?: number
          laudoMedico?: string | null
          link_entrevista?: string | null
          nomeAluno?: string | null
          nomeResponsavel?: string | null
          repetente?: string | null
          score?: string | null
          serie_pretendida?: string | null
          Status?: string | null
          tipoEscola?: string | null
          turnoPreferencia?: string | null
          usoMedicacao?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      quero_conhecer_escola: {
        Row: {
          created_at: string
          id: number
          usuario_nome: string | null
          usuario_whatsapp: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          usuario_nome?: string | null
          usuario_whatsapp?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          usuario_nome?: string | null
          usuario_whatsapp?: string | null
        }
        Relationships: []
      }
      student_dificults: {
        Row: {
          created_at: string
          dificult_area: string | null
          id: number
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          dificult_area?: string | null
          id?: number
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          dificult_area?: string | null
          id?: number
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_dificults_whatsapp_fkey"
            columns: ["whatsapp"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["whatsapp"]
          },
        ]
      }
      student_titles: {
        Row: {
          created_at: string
          id: number
          title: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          title?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          title?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_titles_whatsapp_fkey"
            columns: ["whatsapp"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["whatsapp"]
          },
        ]
      }
      students: {
        Row: {
          assinatura_status: string | null
          cancelado_em: string | null
          cancelar_em: string | null
          coins: number | null
          created_at: string | null
          current_mission: string | null
          current_trill: string | null
          email: string | null
          hits: number | null
          id: string
          idade: number | null
          last_payament: string | null
          level: string | null
          mission_amout: number | null
          nome: string | null
          premium: boolean | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          test_amout: number | null
          trial: boolean | null
          trial_ends_at: string | null
          whatsapp: string | null
          xp: number | null
        }
        Insert: {
          assinatura_status?: string | null
          cancelado_em?: string | null
          cancelar_em?: string | null
          coins?: number | null
          created_at?: string | null
          current_mission?: string | null
          current_trill?: string | null
          email?: string | null
          hits?: number | null
          id?: string
          idade?: number | null
          last_payament?: string | null
          level?: string | null
          mission_amout?: number | null
          nome?: string | null
          premium?: boolean | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          test_amout?: number | null
          trial?: boolean | null
          trial_ends_at?: string | null
          whatsapp?: string | null
          xp?: number | null
        }
        Update: {
          assinatura_status?: string | null
          cancelado_em?: string | null
          cancelar_em?: string | null
          coins?: number | null
          created_at?: string | null
          current_mission?: string | null
          current_trill?: string | null
          email?: string | null
          hits?: number | null
          id?: string
          idade?: number | null
          last_payament?: string | null
          level?: string | null
          mission_amout?: number | null
          nome?: string | null
          premium?: boolean | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          test_amout?: number | null
          trial?: boolean | null
          trial_ends_at?: string | null
          whatsapp?: string | null
          xp?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
