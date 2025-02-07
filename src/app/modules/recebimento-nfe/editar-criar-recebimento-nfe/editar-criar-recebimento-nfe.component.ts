import { Component } from '@angular/core';
import { GenericHttpService } from '../../../services/generic-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { INotaFiscal } from '../../../helpers/models/INotaFiscal';

@Component({
  selector: 'app-editar-criar-recebimento-nfe',
  standalone: false,

  templateUrl: './editar-criar-recebimento-nfe.component.html',
  styleUrl: './editar-criar-recebimento-nfe.component.scss'
})
export class EditarCriarRecebimentoNfeComponent {

  public form!: FormGroup;
  public file: File | null = null;
  public hash: string | undefined;
  public showLoading: boolean = false;
  public hasImportadaNfe: boolean = false;
  public notaFiscal: INotaFiscal | undefined;

  constructor(private formBuilder: FormBuilder, private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private _service: GenericHttpService<any>,
    private toastr: ToastrService) {
    this.form = this.formBuilder.group({
      opcaoNfe: [{ value: "1", disabled: false }]
    })
  }

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      if (params['hash']) {
        this.hash = params['hash'];
        this.hasImportadaNfe = true;
        this.getNfeByHash()
      }
    })

    this.form.get("opcaoNfe")?.valueChanges.subscribe({
      next: (response) => {
        console.log(response)
      }
    })
  }

  
  get formControl() {
    return this.form.controls;
  }

  getNfeByHash(){
    this._service.get(`NotaFiscal/${this.hash}`).subscribe({
      next: (response: any) => {
        this.notaFiscal = response;

        console.log(this.notaFiscal)
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const selectedFile = target.files[0];

      if (selectedFile.name.endsWith('.xml')) {
        this.file = selectedFile;
      } else {
        this.file = null;
        this.toastr.error('Apenas arquivos .xml são permitidos!');
      }
    }
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const selectedFile = event.dataTransfer.files[0];

      if (selectedFile.name.endsWith('.xml')) {
        this.file = selectedFile;
      } else {
        this.file = null;
        this.toastr.error('Apenas arquivos .xml são permitidos!');
      }
    }
  }
  removeFile() {
    this.file = null;
  }

  createOrEditNfe() {
    if (this.file !== null) {
      this.showLoading = true;
      this._service.postFile("NotaFiscal/upload", this.file).subscribe({
        next: (response: any) => {
          this._router.navigate([`/recebimento-nfe/${response.hashRegistro}`])
          this.showLoading = false;
          this.toastr.success( 'Arquivo importador com sucesso!', 'Sucesso');
        },
        error: (error) => {
          console.error('Erro: ', error);
          this.showLoading = false;
          this.toastr.error( error.error, 'Erro');
        }
      })
    } else {
      this.toastr.error( 'Selecionar um arquivo!', 'Erro');
    }

  }

  goToBack = () => this._router.navigate(['/recebimento-nfe']);

  goNewRecebimentoNfe = () => this._router.navigate(['/recebimento-nfe/novo']);

  formatarData(data: string | null | undefined): string {
    return data ? new Date(data).toLocaleDateString('pt-BR') : '--';
  }

  formatarCNPJ(cnpj: string): string {
    if (!cnpj) return '';
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  }
}
