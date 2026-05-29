export type RelacaoMensagem = 'familia' | 'amizade' | 'trabalho' | 'outro';
export type StatusModeracao = 'pending' | 'approved';

export interface MensagemAniversario {
  id?: string;
  nome: string;
  titulo?: string;
  mensagem: string;
  relacao: RelacaoMensagem;
  dataEnvio: Date;
  /**
   * Campo legado salvo no Firestore.
   * false = pending, true = approved.
   */
  aprovada: boolean;
}
