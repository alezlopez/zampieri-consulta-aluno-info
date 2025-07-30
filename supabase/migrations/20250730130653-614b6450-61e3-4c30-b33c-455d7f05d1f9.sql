-- Adicionar coluna desconto na tabela pre_matricula
ALTER TABLE public.pre_matricula 
ADD COLUMN IF NOT EXISTS desconto text;