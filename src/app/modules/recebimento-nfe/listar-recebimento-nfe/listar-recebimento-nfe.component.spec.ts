import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarRecebimentoNfeComponent } from './listar-recebimento-nfe.component';

describe('ListarRecebimentoNfeComponent', () => {
  let component: ListarRecebimentoNfeComponent;
  let fixture: ComponentFixture<ListarRecebimentoNfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarRecebimentoNfeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarRecebimentoNfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
