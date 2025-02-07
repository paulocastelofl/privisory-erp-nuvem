import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCriarProdutosComponent } from './editar-criar-produtos.component';

describe('EditarCriarProdutosComponent', () => {
  let component: EditarCriarProdutosComponent;
  let fixture: ComponentFixture<EditarCriarProdutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarCriarProdutosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCriarProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
