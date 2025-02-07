import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCriarRecebimentoNfeComponent } from './editar-criar-recebimento-nfe.component';

describe('EditarCriarRecebimentoNfeComponent', () => {
  let component: EditarCriarRecebimentoNfeComponent;
  let fixture: ComponentFixture<EditarCriarRecebimentoNfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarCriarRecebimentoNfeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCriarRecebimentoNfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
