import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCriarFormasPagamentoComponent } from './editar-criar-formas-pagamento.component';

describe('EditarCriarFormasPagamentoComponent', () => {
  let component: EditarCriarFormasPagamentoComponent;
  let fixture: ComponentFixture<EditarCriarFormasPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarCriarFormasPagamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCriarFormasPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
