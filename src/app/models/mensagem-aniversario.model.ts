export type RelacaoMensagem = 'familia' | 'amizade' | 'trabalho' | 'outro';

export interface MensagemAniversario {
  id?: string;
  nome: string;
  titulo?: string;
  mensagem: string;
  relacao: RelacaoMensagem;
  dataEnvio: Date;
  aprovada: boolean;
}
