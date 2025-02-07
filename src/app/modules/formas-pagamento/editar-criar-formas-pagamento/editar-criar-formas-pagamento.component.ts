import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GenericHttpService } from '../../../services/generic-http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-criar-formas-pagamento',
  standalone: false,

  templateUrl: './editar-criar-formas-pagamento.component.html',
  styleUrl: './editar-criar-formas-pagamento.component.scss'
})
export class EditarCriarFormasPagamentoComponent {

  public form!: FormGroup;
  public hash: string | undefined;
  public formaPagemento: any | undefined;
  public title: string = 'Novo';
  public showLoading: boolean = false;
  public hasPermitirParcelar: boolean = false;
  public hasUsaMenuDigital: boolean = false;
  public hasGeraQRCodePix: boolean = false;

  public formasDePagamento: any[] = [
    { value: "01", label: "01 - Dinheiro" },
    { value: "02", label: "02 - Cheque" },
    { value: "03", label: "03 - Cartão de Crédito" },
    { value: "04", label: "04 - Cartão de Débito" },
    { value: "05", label: "05 - Crédito Loja" },
    { value: "10", label: "10 - Vale Alimentação" },
    { value: "11", label: "11 - Vale Refeição" },
    { value: "12", label: "12 - Vale Presente" },
    { value: "13", label: "13 - Vale Combustível" },
    { value: "15", label: "15 - Boleto Bancário" },
    { value: "16", label: "16 - Depósito Bancário" },
    { value: "17", label: "17 - Pagamento Instantâneo (PIX)" },
    { value: "18", label: "18 - Transferência bancária, Carteira Digital" },
    { value: "19", label: "19 - Programa de Fidelidade, Cashback, Crédito Virtual" },
    { value: "90", label: "90 - Sem Pagamento" },
    { value: "99", label: "99 - Outros" }
  ];

  public tipoPinPad: any[] = [
    { value: "v", label: "Virtual" },
    { value: "f", label: "Físico" }
  ];

  public tipoMenuDigital = [
    { value: "nu", label: "Não Utiliza" },
    { value: "po", label: "Pagamento Online" },
    { value: "pe", label: "Pagamento na Entrega" }
  ];

  public tipoGeraQRCodePix = [
    { value: "MP", label: "Mercado Pago" }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private _service: GenericHttpService<any>,
    private toastr: ToastrService,
  ) {
    this.form = this.formBuilder.group({
      IdFormaPagamento: [{ value: null, disabled: false }],
      Descricao: [{ value: null, disabled: false }, [Validators.required]],
      Ordem: [{ value: null, disabled: false }],
      MeioPagamentoCFe: [{ value: null, disabled: false }, [Validators.required]],
      ValorTaxa: [{ value: 0.00, disabled: false }],
      TipoPinPad: [{ value: null, disabled: false }],

      EhSempreZeradoPdv: [{ value: null, disabled: false }],
      EhCheque: [{ value: null, disabled: false }],
      EhLancaQuitada: [{ value: true, disabled: false }],
      EhPermiteTroco: [{ value: null, disabled: false }],
      EhBoleto: [{ value: null, disabled: false }],
      EhExigePessoa: [{ value: null, disabled: false }],
      EhAtiva: [{ value: true, disabled: false }],
      EhAbrirGavetaDinheiro: [{ value: null, disabled: false }],

      PermitirParcelar: [{ value: false, disabled: false }],
      QtdParcelas: [{ value: null, disabled: false }],
      ValoresTaxa: this.formBuilder.array([]),

      UsaMenuDigital: [{ value: false, disabled: false }],
      TipoPagamentoMenuDigital: [{ value: null, disabled: false }],
      ObservacaoMenuDigital: [{ value: null, disabled: false }],

      GeraQRCodePix: [{ value: false, disabled: false }],
      PlataformaPagamentoPIX: [{ value: null, disabled: false }],
      AccessTokenPIX: [{ value: null, disabled: false }]
    });
  }

  ngOnInit() {

    this._activatedRoute.params.subscribe(params => {
      if (params['hash']) {
        this.hash = params['hash'];
        this.title = 'Editar';
        this.getFormaPagamentoByHash()
      }
    })

    this.formControl['PermitirParcelar'].valueChanges.subscribe({
      next: (response) => response ? this.hasPermitirParcelar = true : this.hasPermitirParcelar = false
    });

    this.formControl['UsaMenuDigital'].valueChanges.subscribe({
      next: (response) => response ? this.hasUsaMenuDigital = true : this.hasUsaMenuDigital = false
    });

    this.formControl['GeraQRCodePix'].valueChanges.subscribe({
      next: (response) => response ? this.hasGeraQRCodePix = true : this.hasGeraQRCodePix = false
    });

    this.formControl['QtdParcelas'].valueChanges.subscribe({
      next: (response) => {
        if (response > 0 && response !== null && response !== undefined && this.hasPermitirParcelar) {
          this.formValoresTaxa.clear();
          for (let i = 0; i < response; i++) {
            this.addValorTaxa();
          }
        } else {
          this.formValoresTaxa.clear();
        }
      }
    })
  }

  get formControl() {
    return this.form.controls;
  }

  get formValoresTaxa() {
    return this.form.controls["ValoresTaxa"] as FormArray;
  }

  addValorTaxa() {
    const valoresTaxaForm = this.formBuilder.group({
      Taxa: [{ value: 0.00, disabled: false }, [Validators.required]],
    });

    this.formValoresTaxa.push(valoresTaxaForm);
  }

  removeValorTaxa(i: number) {
    this.formValoresTaxa.removeAt(i);
    this.formControl['QtdParcelas'].setValue(this.formValoresTaxa.length);
  }
  createOrEditFormaPagamento() {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const hasPermitirParcelar = this.formControl['PermitirParcelar'].value;
    let Formapagamentotaxas: any[] = [];
    if (hasPermitirParcelar) {
      const qtdParcelas = this.formControl['QtdParcelas'].value;
      if (qtdParcelas > 0) {
        this.formValoresTaxa.controls.forEach((item: AbstractControl<any, any>, index) => {
          Formapagamentotaxas.push({
            NumeroParcela: (index + 1),
            ValorTaxa: item.value.Taxa
          })
        })
      }
    }

    let formData = {
      Descricao: this.formControl['Descricao'].value,
      Ordem: this.formControl['Ordem'].value,
      TipoFiscal: this.formControl['MeioPagamentoCFe'].value,
      ValorTaxaMensal: this.formControl['ValorTaxa'].value,
      TipoPinpad: this.formControl['TipoPinPad'].value,

      SempreZeradaNoPdv: this.formControl['EhSempreZeradoPdv'].value ? 1 : 0,
      EhCheque: this.formControl['EhCheque'].value ? 1 : 0,
      LancaFinanceiroQuitado: this.formControl['EhLancaQuitada'].value ? 1 : 0,
      PermiteVoltarTroco: this.formControl['EhPermiteTroco'].value ? 1 : 0,
      ExigePessoa: this.formControl['EhExigePessoa'].value ? 1 : 0,
      EhBoleto: this.formControl['EhBoleto'].value ? 1 : 0,
      Ativa: this.formControl['EhAtiva'].value ? 1 : 0,
      AbrirGavetaDeDinheiro: this.formControl['EhAbrirGavetaDinheiro'].value ? 1 : 0,
      Formapagamentotaxas: Formapagamentotaxas,
      UsaNoMenuDigital: this.formControl['UsaMenuDigital'].value ? 1 : 0,
      MenuDigitalFormaPagamentoTipo: this.formControl['TipoPagamentoMenuDigital'].value,
      MenuDigitalObservacao: this.formControl['ObservacaoMenuDigital'].value,
      GeraQrcode: this.formControl['GeraQRCodePix'].value ? 1 : 0,
      PlataformaPagamento: this.formControl['PlataformaPagamentoPIX'].value,
      // AccessTokenPIX: [{ value: null, disabled: false }]
    }

    this.showLoading = true;

    if (this.hash) {
      this._service.put(`FormaPagamento`, { IdFormaPagamento: this.formControl["IdFormaPagamento"].value, ...formData }).subscribe({
        next: () => {
          this.toastr.success('Registro atualizado!', 'Sucesso');
          this.showLoading = false;
        },
        error: (error) => {
          this.toastr.error('Falha ao atualizar registro!', 'Erro');
          console.error('Erro: ', error);
          this.showLoading = false;
        }
      });

    } else {

      this._service.post('FormaPagamento', formData).subscribe({
        next: (response) => {
          this._router.navigate([`/formas-pagamento/${response.idFormaPagamento}`]);
          this.toastr.success('Registro cadastrado!', 'Sucesso');
          this.showLoading = false;
        },
        error: (error) => {
          this.toastr.error(error.error, 'Erro');
          console.error('Erro: ', error);
          this.showLoading = false;
        }
      });
    }
  }

  getFormaPagamentoByHash() {
    this._service.get(`FormaPagamento/${this.hash}`)
      .subscribe({
        next: (response: any) => {
          this.formaPagemento = response;
          this.setValues();
        },
        error: (error) => {
          console.error('Erro: ', error);
        }
      })
  }

  setValues() {
    this.formControl['IdFormaPagamento'].setValue(this.formaPagemento.idFormaPagamento);
    this.formControl['Descricao'].setValue(this.formaPagemento.descricao);
    this.formControl['Ordem'].setValue(this.formaPagemento.ordem);

    this.formControl['MeioPagamentoCFe'].setValue(this.formaPagemento.tipoFiscal);
    this.formControl['ValorTaxa'].setValue(this.formaPagemento.valorTaxaMensal);
    this.formControl['TipoPinPad'].setValue(this.formaPagemento.tipoPinpad);

    this.formControl["EhSempreZeradoPdv"].setValue(this.formaPagemento.sempreZeradaNoPdv === 1);
    this.formControl["EhCheque"].setValue(this.formaPagemento.ehCheque === 1);
    this.formControl["EhLancaQuitada"].setValue(this.formaPagemento.lancaFinanceiroQuitado === 1);
    this.formControl["EhPermiteTroco"].setValue(this.formaPagemento.permiteVoltarTroco === 1);
    this.formControl["EhExigePessoa"].setValue(this.formaPagemento.exigePessoa === 1);
    this.formControl["EhBoleto"].setValue(this.formaPagemento.ehBoleto === 1);
    this.formControl["EhAtiva"].setValue(this.formaPagemento.ativa === 1);
    this.formControl["EhAbrirGavetaDinheiro"].setValue(this.formaPagemento.abrirGavetaDeDinheiro === 1);

    if (this.formaPagemento.formapagamentotaxas.length > 0) {
      this.formControl["PermitirParcelar"].setValue(true);
      this.formControl["QtdParcelas"].setValue(this.formaPagemento.formapagamentotaxas.length);
      this.formValoresTaxa.controls.forEach((item, index) => {
        item.get('Taxa')!.setValue(this.formaPagemento.formapagamentotaxas[index].valorTaxa);
      })
    }

    this.formControl['UsaMenuDigital'].setValue(this.formaPagemento.usaNoMenuDigital === 1);
    this.formControl['TipoPagamentoMenuDigital'].setValue(this.formaPagemento.menuDigitalFormaPagamentoTipo);
    this.formControl['ObservacaoMenuDigital'].setValue(this.formaPagemento.menuDigitalObservacao);

    this.formControl['GeraQRCodePix'].setValue(this.formaPagemento.geraQrcode === 1);
    this.formControl['PlataformaPagamentoPIX'].setValue(this.formaPagemento.plataformaPagamento);
    this.formControl['AccessTokenPIX'].setValue("");
  }

  goToBack = () => this._router.navigate(['/formas-pagamento']);

  goNewFormaPagemento = () => this._router.navigate(['/formas-pagamento/novo']);

  removeFormaPagamento() {
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

        this._service.delete(`FormaPagamento`, this.formaPagemento?.idFormaPagamento ?? 0).subscribe({
          next: () => {
            this._router.navigate(['/formas-pagamento']);
            this.toastr.success('Registro excluído!', 'Sucesso');
          },
          error: (error) => {
            this.toastr.error('Falha ao excluir registro!', 'Erro');
          }
        })
      }
    });
  }

}
