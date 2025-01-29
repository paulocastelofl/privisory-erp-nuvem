import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenericHttpService } from '../../../services/generic-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IUsuario } from '../../../helpers/models/IUsusario';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuarios',
  standalone: false,

  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {

  public form!: FormGroup;
  public hash: string | undefined;
  public usuario: IUsuario | undefined;
  public title: string = 'Novo';

  constructor(
    private formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private _service: GenericHttpService<any>,
    private toastr: ToastrService,
  ) {
    this.form = this.formBuilder.group({
      IdUsuario: [{ value: null, disabled: false }],
      Nome: [{ value: null, disabled: false }, [Validators.required]],
      LoginUsuario: [{ value: null, disabled: false }, [Validators.required]],
      Senha: [{ value: null, disabled: false }, [Validators.required, Validators.minLength(8)]],
      Telefone: [{ value: null, disabled: false }],
      Rg: [{ value: null, disabled: false }],
      Cpf: [{ value: null, disabled: false }],
      Observacoes: [{ value: null, disabled: false }]
    });
  }

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      if (params['hash']) {
        this.hash = params['hash'];
        this.title = 'Editar';
        this.getUsuarioByHash()
      }
    })
    
  }

  getUsuarioByHash() {
    this._service.get(`Usuarios/${this.hash}`)
      .subscribe({
        next: (response: IUsuario) => {
          this.usuario = response;
          this.setValues();
        },
        error: (error) => {
          console.error('Erro: ', error);
        }
      })
  }

  setValues() {
    this.form.get('Senha')?.clearValidators();
    this.form.get('Senha')?.updateValueAndValidity();

    this.form.patchValue({
      IdUsuario: this.usuario?.idUsuario,
      Nome: this.usuario?.nome,
      LoginUsuario: this.usuario?.loginUsuario,
      Telefone: this.usuario?.telefone,
      Rg: this.usuario?.rg,
      Cpf: this.usuario?.cpf,
      Observacoes: this.usuario?.observacoes
    });
  }

  createOrEdtitUsuario() {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.hash) {
      this._service.put(`Usuarios`, {...this.form.value }).subscribe({
        next: () => {
          this.toastr.success('Sucesso', 'Registro atualizado!');
        },
        error: (error) => {
          this.toastr.error('Erro', 'Falha ao atualizar registro!');
          console.error('Erro: ', error);
        }
      });
    } else {

      const { IdUsuario, ...parms } = this.form.value;
      // Implementar criação ou edição de usuário
      this._service.post('Usuarios', parms).subscribe({
        next: (response) => {
          this._router.navigate([`/usuarios/${response.hashUsuario}`]);
          this.toastr.success('Sucesso', 'Registro cadastrado!');
        },
        error: (error) => {
          this.toastr.error('Erro', 'Falha ao cadastrar registro!');
          console.error('Erro: ', error);
        }
      });
    }

  }

  isFieldRequired(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    if (!control) {
      return false;
    }
    const validators = control.validator ? control.validator({} as any) : null;
    return !!validators?.['required'];
  }

  goToBack = () => this._router.navigate(['/usuarios']);

  goNewUsuario = () => this._router.navigate(['/usuarios/novo']); 
}
