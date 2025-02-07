import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarFormasPagamentoComponent } from './listar-formas-pagamento.component';

describe('ListarFormasPagamentoComponent', () => {
  let component: ListarFormasPagamentoComponent;
  let fixture: ComponentFixture<ListarFormasPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarFormasPagamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarFormasPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
