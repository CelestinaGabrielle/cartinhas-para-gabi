import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, defer, from, map, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { MensagemAniversario } from '../models/mensagem-aniversario.model';

const STORAGE_KEY = 'cartinhas-para-a-gabi.mensagens';
const COLLECTION_NAME = 'mensagensAniversario';

@Injectable({
  providedIn: 'root',
})
export class MensagensService {
  private readonly firestore = inject(Firestore, { optional: true });
  private readonly firestoreAtivo = environment.firebase.enabled && !!this.firestore;

  salvarMensagem(
    mensagem: Omit<MensagemAniversario, 'id' | 'dataEnvio' | 'aprovada'>,
  ): Observable<void> {
    const novaMensagem: MensagemAniversario = {
      ...mensagem,
      titulo: mensagem.titulo?.trim() || undefined,
      dataEnvio: new Date(),
      aprovada: false,
    };

    if (this.firestoreAtivo && this.firestore) {
      const mensagensRef = collection(this.firestore, COLLECTION_NAME);
      return from(addDoc(mensagensRef, novaMensagem)).pipe(map(() => undefined));
    }

    return defer(() => {
      const mensagens = this.lerMensagensLocais();
      mensagens.unshift({
        ...novaMensagem,
        id: crypto.randomUUID(),
        // No fallback local, deixamos aprovada como true para o mural do MVP ter dados visiveis.
        aprovada: true,
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mensagens));

      return of(undefined);
    });
  }

  listarMensagensAprovadas(): Observable<MensagemAniversario[]> {
    if (this.firestoreAtivo && this.firestore) {
      const mensagensRef = collection(this.firestore, COLLECTION_NAME);
      const consulta = query(mensagensRef, where('aprovada', '==', true));

      return collectionData(consulta, { idField: 'id' }).pipe(
        map((mensagens) => this.normalizarMensagens(mensagens as MensagemAniversario[])),
      );
    }

    return of(this.lerMensagensLocais().filter((mensagem) => mensagem.aprovada));
  }

  listarTodasMensagens(): Observable<MensagemAniversario[]> {
    if (this.firestoreAtivo && this.firestore) {
      const mensagensRef = collection(this.firestore, COLLECTION_NAME);

      return collectionData(mensagensRef, { idField: 'id' }).pipe(
        map((mensagens) => this.normalizarMensagens(mensagens as MensagemAniversario[])),
      );
    }

    return of(this.lerMensagensLocais());
  }

  private lerMensagensLocais(): MensagemAniversario[] {
    const mensagensSalvas = localStorage.getItem(STORAGE_KEY);

    if (!mensagensSalvas) {
      return [];
    }

    try {
      return this.normalizarMensagens(JSON.parse(mensagensSalvas));
    } catch {
      return [];
    }
  }

  private normalizarMensagens(mensagens: MensagemAniversario[]): MensagemAniversario[] {
    return mensagens
      .map((mensagem) => ({
        ...mensagem,
        dataEnvio: this.converterParaDate(mensagem.dataEnvio),
      }))
      .sort((a, b) => b.dataEnvio.getTime() - a.dataEnvio.getTime());
  }

  private converterParaDate(valor: unknown): Date {
    if (valor instanceof Date) {
      return valor;
    }

    if (valor && typeof valor === 'object' && 'toDate' in valor) {
      return (valor as { toDate: () => Date }).toDate();
    }

    return new Date(String(valor));
  }
}
