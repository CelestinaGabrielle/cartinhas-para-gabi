import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, catchError, map, of, startWith } from 'rxjs';

import {
  MensagemAniversario,
  RelacaoMensagem,
} from '../../models/mensagem-aniversario.model';
import { MensagensService } from '../../services/mensagens.service';

interface MuralState {
  mensagens: MensagemAniversario[];
  carregando: boolean;
  erro: boolean;
}

@Component({
  selector: 'app-mural-cartinhas',
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './mural-cartinhas.component.html',
  styleUrl: './mural-cartinhas.component.scss',
})
export class MuralCartinhasComponent {
  private readonly mensagensService = inject(MensagensService);
  private readonly cartinhasAbertas = new Set<string>();

  readonly state$: Observable<MuralState> = this.mensagensService
    .listarMensagensAprovadas()
    .pipe(
      map((mensagens) => ({ mensagens, carregando: false, erro: false })),
      startWith({ mensagens: [], carregando: true, erro: false }),
      catchError((error) => {
        console.error('Erro ao carregar mural:', error);
        return of({ mensagens: [], carregando: false, erro: true });
      }),
    );

  relacaoLabel(relacao: RelacaoMensagem): string {
    const labels: Record<RelacaoMensagem, string> = {
      familia: 'Familia',
      amizade: 'Amizade',
      trabalho: 'Trabalho',
      outro: 'Outro',
    };

    return labels[relacao];
  }

  cartinhaKey(cartinha: MensagemAniversario): string {
    return cartinha.id || cartinha.dataEnvio.toISOString();
  }

  mensagemLonga(mensagem: string): boolean {
    return mensagem.length > 420 || mensagem.split(/\r?\n/).length > 8;
  }

  cartinhaExpandida(cartinha: MensagemAniversario): boolean {
    return this.cartinhasAbertas.has(this.cartinhaKey(cartinha));
  }

  alternarCartinha(cartinha: MensagemAniversario): void {
    const key = this.cartinhaKey(cartinha);

    if (this.cartinhasAbertas.has(key)) {
      this.cartinhasAbertas.delete(key);
      return;
    }

    this.cartinhasAbertas.add(key);
  }
}
