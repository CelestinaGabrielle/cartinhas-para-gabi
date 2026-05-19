import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, from, map, throwError, timeout } from 'rxjs';

import { firebaseConfigPreenchido } from '../../environments/environment';
import { MensagemAniversario } from '../models/mensagem-aniversario.model';

const COLLECTION_NAME = 'mensagens';

@Injectable({
  providedIn: 'root',
})
export class MensagensService {
  private readonly firestore = inject(Firestore);

  salvarMensagem(
    mensagem: Omit<MensagemAniversario, 'id' | 'dataEnvio' | 'aprovada'>,
  ): Observable<void> {
    if (!firebaseConfigPreenchido()) {
      return throwError(
        () =>
          new Error(
            'Firebase nao configurado. Preencha o firebaseConfig em src/environments/environment.ts.',
          ),
      );
    }

    const novaMensagem: MensagemAniversario = {
      ...mensagem,
      titulo: mensagem.titulo?.trim() || undefined,
      dataEnvio: new Date(),
      // Novas cartinhas entram pendentes para moderacao manual no Firebase Console.
      aprovada: false,
    };

    const mensagensRef = collection(this.firestore, COLLECTION_NAME);
    return from(addDoc(mensagensRef, novaMensagem)).pipe(
      timeout(15000),
      map(() => undefined),
    );
  }

  listarMensagensAprovadas(): Observable<MensagemAniversario[]> {
    if (!firebaseConfigPreenchido()) {
      return throwError(
        () =>
          new Error(
            'Firebase nao configurado. Preencha o firebaseConfig em src/environments/environment.ts.',
          ),
      );
    }

    const mensagensRef = collection(this.firestore, COLLECTION_NAME);
    const consulta = query(mensagensRef, where('aprovada', '==', true));

    return collectionData(consulta, { idField: 'id' }).pipe(
      map((mensagens) => this.normalizarMensagens(mensagens as MensagemAniversario[])),
    );
  }

  listarTodasMensagens(): Observable<MensagemAniversario[]> {
    if (!firebaseConfigPreenchido()) {
      return throwError(
        () =>
          new Error(
            'Firebase nao configurado. Preencha o firebaseConfig em src/environments/environment.ts.',
          ),
      );
    }

    const mensagensRef = collection(this.firestore, COLLECTION_NAME);
    const consulta = query(mensagensRef, orderBy('dataEnvio', 'desc'));

    return collectionData(consulta, { idField: 'id' }).pipe(
      map((mensagens) => this.normalizarMensagens(mensagens as MensagemAniversario[])),
    );
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
