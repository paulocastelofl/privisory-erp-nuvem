import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { GenericHttpService } from '../../../services/generic-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IUsuario } from '../../../helpers/models/IUsusario';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

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
  public showLoading: boolean = false;

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
      Ativo: [{ value: true, disabled: false }],
      LoginUsuario: [{ value: null, disabled: false }, [Validators.required]],
      Senha: [{ value: null, disabled: false }, [Validators.required, Validators.minLength(8)]],
      ConfirmarSenha: [{ value: null, disabled: false }, [Validators.required, Validators.minLength(8), this.passwordMatchValidator]],
      Telefone: [{ value: null, disabled: false }],
      Rg: [{ value: null, disabled: false }],
      Cpf: [{ value: null, disabled: false }],
      Observacoes: [{ value: null, disabled: false }],

      SalarioMensal: [{ value: null, disabled: false }],
      ComissaoVendas: [{ value: null, disabled: false }],
      PercentualLimiteDesconto: [{ value: null, disabled: false }],
      Endereco: [{ value: null, disabled: false }],

      UsuarioMaster: [{ value: false, disabled: false }],
      EhVendedor: [{ value: false, disabled: false }],
      EhEntregador: [{ value: false, disabled: false }],
      EhTecnico: [{ value: false, disabled: false }],
      UsaPdvComoUtilitario: [{ value: false, disabled: false }],
      EhComandaEletronica: [{ value: false, disabled: false }]
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

  removeUsuario() {
    const swalComBotoesBootstrap = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    swalComBotoesBootstrap.fire({
      title: "Você tem certeza?",
      text: "Essa ação não poderá ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      reverseButtons: true
    }).then((resultado) => {
      if (resultado.isConfirmed) {

        this._service.delete(`Usuarios`, this.usuario?.idUsuario ?? 0).subscribe({
          next: () => {
            this._router.navigate(['/usuarios']);
            this.toastr.success('Registro excluído!', 'Sucesso');
          },
          error: (error) => {
            this.toastr.error('Falha ao excluir registro!', 'Erro');
          }
        })
      }
    });
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
    this.form.get('ConfirmarSenha')?.clearValidators();
    this.form.get('ConfirmarSenha')?.updateValueAndValidity();

    this.form.patchValue({
      IdUsuario: this.usuario?.idUsuario,
      Nome: this.usuario?.nome,
      LoginUsuario: this.usuario?.loginUsuario,
      Ativo: this.usuario?.ativo,
      Telefone: this.usuario?.telefone,
      Rg: this.usuario?.rg,
      Cpf: this.usuario?.cpf,
      Observacoes: this.usuario?.observacoes,
      SalarioMensal: this.usuario?.salarioMensal,
      ComissaoVendas: this.usuario?.comissaoVendas,
      PercentualLimiteDesconto: this.usuario?.percentualLimiteDesconto,
      Endereco: this.usuario?.endereco,

      UsuarioMaster: this.usuario?.usuarioMaster,
      EhVendedor: this.usuario?.ehVendedor,
      EhEntregador: this.usuario?.ehEntregador,
      EhTecnico: this.usuario?.ehTecnico,
      UsaPdvComoUtilitario: this.usuario?.usaPdvComoUtilitario,
      EhComandaEletronica: this.usuario?.ehComandaEletronica
    });
  }

  createOrEdtitUsuario() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.showLoading = true;

    if (this.hash) {

      const formData = {
        ...this.form.value,
        Ativo: this.form.get('Ativo')?.value ? 1 : 0,
        UsuarioMaster: this.form.get('UsuarioMaster')?.value ? 1 : 0,
        EhVendedor: this.form.get('EhVendedor')?.value ? 1 : 0,
        EhEntregador: this.form.get('EhEntregador')?.value ? 1 : 0,
        EhTecnico: this.form.get('EhTecnico')?.value ? 1 : 0,
        UsaPdvComoUtilitario: this.form.get('UsaPdvComoUtilitario')?.value ? 1 : 0,
        EhComandaEletronica: this.form.get('EhComandaEletronica')?.value ? 1 : 0,
      };

      this._service.put(`Usuarios`, formData).subscribe({
        next: () => {
          this.toastr.success('Registro atualizado!', 'Sucesso' );
          this.showLoading = false;
        },
        error: (error) => {
          this.toastr.error('Falha ao atualizar registro!', 'Erro');
          console.error('Erro: ', error);
          this.showLoading = false;
        }
      });
    } else {

      const formData = {
        ...this.form.value,
        Ativo: this.form.get('Ativo')?.value ? 1 : 0,
        UsuarioMaster: this.form.get('UsuarioMaster')?.value ? 1 : 0,
        EhVendedor: this.form.get('EhVendedor')?.value ? 1 : 0,
        EhEntregador: this.form.get('EhEntregador')?.value ? 1 : 0,
        EhTecnico: this.form.get('EhTecnico')?.value ? 1 : 0,
        UsaPdvComoUtilitario: this.form.get('UsaPdvComoUtilitario')?.value ? 1 : 0,
        EhComandaEletronica: this.form.get('EhComandaEletronica')?.value ? 1 : 0,
      };

      const { IdUsuario, ...parms } = formData;

      // Implementar criação ou edição de usuário
      this._service.post('Usuarios', parms).subscribe({
        next: (response) => {
          this._router.navigate([`/usuarios/${response.hashUsuario}`]);
          this.toastr.success('Registro cadastrado!', 'Sucesso');
          this.showLoading = false;
        },
        error: (error) => {
          this.toastr.error( error.error,'Erro');
          console.error('Erro: ', error);
          this.showLoading = false;
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

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const confirmPassword = control.value;
    const parentForm = control.parent;
    if (!parentForm) {
      return null;
    }
    const password = parentForm.get('Senha')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  goToBack = () => this._router.navigate(['/usuarios']);

  goNewUsuario = () => this._router.navigate(['/usuarios/novo']);
}
