import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProduto, IProdutoFoto } from '../../../helpers/models/IProdutos';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericHttpService } from '../../../services/generic-http.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { IProdutoUnidade } from '../../../helpers/models/ProdutoUnidade';
import { forkJoin, map } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface UploadedFile {
  name: string;
  file: File;
  preview?: string;
}

@Component({
  selector: 'app-editar-criar-produtos',
  standalone: false,
  templateUrl: './editar-criar-produtos.component.html',
  styleUrl: './editar-criar-produtos.component.scss'
})
export class EditarCriarProdutosComponent {

  protected readonly apiUrlBucket = `${environment.api.url_images_bucket}`;
  public form!: FormGroup;
  public hash: string | undefined;
  public produto: IProduto | undefined;
  public produtoUnidades: IProdutoUnidade[] = [];
  public title: string = 'Cadastro de';
  public showLoading: boolean = false;
  public showLoadingUpload: boolean = false;
  public tabsSelected: any | undefined;
  public tabs = [
    { id: "#DadosGerais", nome: "Dados Gerais" },
    { id: "#DadosComplementares", nome: "Dados Complementares" },
    { id: "#Complementos", nome: "Complementos" },
    { id: "#Variações", nome: "Variações" },
    { id: "#Fiscal", nome: "Fiscal" },
    { id: "#LojaVirtual", nome: "LojaVirtual" },
    { id: "#FotosArquivos", nome: "Fotos Arquivos" },
    { id: "#Lojas", nome: "Lojas" }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private _service: GenericHttpService<any>,
    private toastr: ToastrService,
  ) {
    this.form = this.formBuilder.group({
      IdProduto: [{ value: null, disabled: false }],
      NomeProduto: [{ value: null, disabled: false }, [Validators.required]],

      CodigoInterno: [{ value: null, disabled: false }],
      CodigoBarras: [{ value: null, disabled: false }],
      UnidadeTributavel: [{ value: null, disabled: false }],
      Ncm: [{ value: null, disabled: false }],

      PrecoCusto: [{ value: null, disabled: false }],
      PercentualMargemLucro: [{ value: null, disabled: false }],
      PrecoVenda: [{ value: null, disabled: false }, [Validators.required]],
      Ativo: [{ value: true, disabled: false }],
    });
  }

  ngOnInit() {
    this.tabsSelected = this.tabs[0];
    this._activatedRoute.params.subscribe(params => {
      if (params['hash']) {
        this.hash = params['hash'];
        this.title = 'Editar';
        this.getProdutoByHash()
      }
    });

    // Atualiza o PrecoVenda ao modificar o PercentualMargemLucro
    this.form.get('PercentualMargemLucro')?.valueChanges.subscribe((percentualMargem) => {
      let precoCusto = this.form.get('PrecoCusto')?.value;
      if (precoCusto !== null && percentualMargem !== null) {
        let precoVenda = precoCusto * (1 + percentualMargem / 100);
        this.form.get('PrecoVenda')?.setValue(precoVenda, { emitEvent: false });
      }
    });

    // Atualiza o PrecoCusto ao modificar o PrecoVenda
    this.form.get('PrecoVenda')?.valueChanges.subscribe((precoVenda) => {
      let percentualMargem = this.form.get('PercentualMargemLucro')?.value;
      if (percentualMargem !== null && precoVenda !== null) {
        let precoCusto = precoVenda / (1 + percentualMargem / 100);
        this.form.get('PrecoCusto')?.setValue(precoCusto, { emitEvent: false });
      }
    });

    // Atualiza o PrecoVenda ao modificar o PrecoCusto
    this.form.get('PrecoCusto')?.valueChanges.subscribe((precoCusto) => {
      let percentualMargem = this.form.get('PercentualMargemLucro')?.value;
      if (percentualMargem !== null && precoCusto !== null) {
        let precoVenda = precoCusto * (1 + percentualMargem / 100);
        this.form.get('PrecoVenda')?.setValue(precoVenda, { emitEvent: false });
      }
    });


    this.getProdutoUnidade();
  }

  getProdutoByHash() {
    this._service.get(`Produto/${this.hash}`)
      .subscribe({
        next: (response: IProduto) => {
          this.produto = response;

          const folder = `Empresa/${this.produto?.idEmpresa}/Produto/${this.produto?.idProduto}`;
          this.produto.produtofotos?.forEach((response) => {
            response.nomeArquivo = `${this.apiUrlBucket}/${folder}/${response.nomeArquivo}`;
          })

          this.setValues();
        },
        error: (error) => {
          console.error('Erro: ', error);
        }
      })
  }

  setValues() {
    this.form.patchValue({
      IdProduto: this.produto?.idProduto,
      NomeProduto: this.produto?.nomeProduto,

      CodigoInterno: this.produto?.codigoInterno,
      CodigoBarras: this.produto?.codigoBarras,
      UnidadeTributavel: this.produto?.unidadeTributavel,
      Ncm: this.produto?.ncm,

      PrecoCusto: this.produto?.precoCusto,
      PercentualMargemLucro: this.produto?.percentualMargemLucro,
      PrecoVenda: this.produto?.precoVenda,
      Ativo: this.produto?.ativo === 1,
    });
  }

  createOrEdtitProduto() {
    if (this.files.length > 0) {
      this.toastr.error('Upload de imagens pendentes', 'Erro');
      return;
    }

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.get('PrecoVenda')?.value <= 0) {
      this.toastr.error('Preço Venda com valor R$ 0,00', 'Erro');
      return;
    }

    this.showLoading = true;

    if (this.hash) {

      const formData = {
        ...this.form.value,
        Ativo: this.form.get('Ativo')?.value ? 1 : 0
      };

      this._service.put(`Produto`, formData).subscribe({
        next: () => {
          this.toastr.success('Registro atualizado!', 'Sucesso');
          this.showLoading = false;;
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
      };

      const { IdProduto, ...parms } = formData;

      this._service.post('Produto', parms).subscribe({
        next: (response) => {
          this._router.navigate([`/produtos/${response.hashProduto}`]);
          this.toastr.success('Registro cadastrado!', 'Sucesso');
          this.showLoading = false;
        },
        error: (error) => {
          this.toastr.error('Erro', error.error);
          console.error('Erro: ', error);
          this.showLoading = false;
        }
      });
    }
  }

  sendFiles() {
    if (this.files.length > 0) {
      this.showLoadingUpload = true;

      const uploadObservables = this.files.map(file => {
        const formData = new FormData();
        formData.append('File', file.file);
        const folder = `Empresa/${this.produto?.idEmpresa}/Produto/${this.produto?.idProduto}`;

        return this._service.postFileFormData(`FileAws?Bucket=n3images&Folder=${folder}`, formData)
          .pipe(
            map((response: any) => ({
              response,
              fileSize: file.file.size
            }))
          );
      });

      forkJoin(uploadObservables).subscribe({
        next: (responses: any[]) => {
          responses.forEach(({ response, fileSize }) => {
            this.createProdutoFoto({
              idProduto: this.produto?.idProduto,
              nomeArquivo: this.getFileNameFromPath(response.filename),
              tamanhoArquivo: this.formatFileSize(fileSize),
              s3: 1
            });
          });

          this.files = [];
          this.showLoadingUpload = false;
          this.toastr.success('Upload realizado com sucesso!', 'Sucesso');
        },
        error: (error) => {
          console.error('Erro: ', error);
          this.showLoadingUpload = false;
          this.toastr.error(error.error, 'Erro');
        }
      });
    } else {
      this.toastr.error('Selecione pelo menos um arquivo!', 'Erro');
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  uploadFiles() {
    this.sendFiles();
  }

  createProdutoFoto(params: any) {
    this._service.post(`Produto/ProdutoFoto`, params).subscribe({
      next: (response) => {
        const folder = `Empresa/${this.produto?.idEmpresa}/Produto/${this.produto?.idProduto}`;
        response.nomeArquivo = `${this.apiUrlBucket}/${folder}/${response.nomeArquivo}`
        this.produto?.produtofotos?.push(response);
      },
      error: (error) => {
        console.error('Erro: ', error);
      }
    })
  }

  removeProduto() {
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

        this._service.delete(`Produto`, this.produto?.idProduto ?? 0).subscribe({
          next: () => {
            this._router.navigate(['/produtos']);
            this.toastr.success('Registro excluído!', 'Sucesso');
          },
          error: (error) => {
            this.toastr.error('Falha ao excluir registro!', 'Erro');
          }
        })
      }
    });
  }

  getProdutoUnidade() {
    this._service.get(`Produto/ProdutoUnidade`)
      .subscribe({
        next: (response: any) => {
          this.produtoUnidades = response;
          console.log()
        },
        error: (error) => {
          console.error('Erro: ', error);
        }
      })
  }

  selectTab(tab: any) {
    this.tabsSelected = tab;
  }

  goToBack = () => this._router.navigate(['/produtos']);

  goNewProduto = () => this._router.navigate(['/produtos/novo']);

  /*----------------------------------------------*/

  files: UploadedFile[] = [];

  getFileNameFromPath(path: string): string {
    const lastSlashIndex = path.lastIndexOf("/");
    const queryIndex = path.indexOf("?", lastSlashIndex);
    const filePath = queryIndex !== -1 ? path.substring(0, queryIndex) : path;

    return filePath.substring(lastSlashIndex + 1);
  }

  onFileSelected(event: any) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (event.target.files.length > 0) {
      let validFiles: any = Array.from(event.target.files).filter((file: any) => {
        return allowedTypes.includes(file.type);
      });

      if (validFiles.length === 0) {
        this.toastr.error('Apenas JPG, JPEG, PNG e WEBP são permitidos.', 'Erro');
        return;
      }

      this.addFiles(validFiles);
    }
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.addFiles(event.dataTransfer.files);
    }
  }

  private addFiles(fileList: FileList) {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const fileObj: UploadedFile = { name: file.name, file };

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          fileObj.preview = e.target.result;
        };
        reader.readAsDataURL(file);
      }

      this.files.push(fileObj);
    }
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }

  removeProdutoFoto(produtoFoto: IProdutoFoto) {

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
        this._service.delete(`Produto/DeleteProdutoFoto`, produtoFoto.idProdutoFoto ?? 0).subscribe({
          next: () => {
            if (this.produto) {
              this.produto.produtofotos = this.produto.produtofotos?.filter(
                pf => pf.idProdutoFoto !== produtoFoto.idProdutoFoto
              ) ?? undefined;
            }
            this.toastr.success('Imagem excluída!', 'Sucesso');
          },
          error: (error) => {
            this.toastr.error('Falha ao excluir imagem!', 'Erro');
          }
        })
      }
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  getCalculateMargem() {

  }
}
