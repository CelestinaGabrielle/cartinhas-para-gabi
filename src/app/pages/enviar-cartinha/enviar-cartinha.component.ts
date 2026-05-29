import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { RelacaoMensagem } from '../../models/mensagem-aniversario.model';
import { MensagensService } from '../../services/mensagens.service';

@Component({
  selector: 'app-enviar-cartinha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './enviar-cartinha.component.html',
  styleUrl: './enviar-cartinha.component.scss',
})
export class EnviarCartinhaComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly mensagensService = inject(MensagensService);
  private readonly router = inject(Router);
  readonly tamanhoMaximoTitulo = 60;

  readonly relacoes: { label: string; value: RelacaoMensagem }[] = [
    { label: 'Familia', value: 'familia' },
    { label: 'Amizade', value: 'amizade' },
    { label: 'Trabalho', value: 'trabalho' },
    { label: 'Outro', value: 'outro' },
  ];

  readonly form = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    titulo: ['', Validators.maxLength(this.tamanhoMaximoTitulo)],
    relacao: ['amizade' as RelacaoMensagem, Validators.required],
    mensagem: ['', [Validators.required, Validators.minLength(12)]],
    aceite: [false, Validators.requiredTrue],
  });

  carregando = false;
  erro = '';

  enviar(): void {
    if (this.carregando) {
      return;
    }

    this.erro = '';
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.carregando = true;
    this.form.disable({ emitEvent: false });

    const { aceite, ...mensagem } = this.form.getRawValue();
    const mensagemLimpa = {
      ...mensagem,
      nome: mensagem.nome.trim(),
      titulo: mensagem.titulo.trim(),
      mensagem: mensagem.mensagem.trim(),
    };

    this.mensagensService
      .salvarMensagem(mensagemLimpa)
      .subscribe({
        next: () => this.router.navigateByUrl('/obrigada'),
        error: (error) => {
          console.error('Erro ao salvar cartinha:', error);
          this.carregando = false;
          this.form.enable({ emitEvent: false });
          this.erro =
            'Nao consegui guardar sua cartinha agora. Tente novamente em alguns instantes.';
        },
      });
  }

  campoInvalido(campo: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[campo];
    return control.invalid && (control.dirty || control.touched);
  }
}
