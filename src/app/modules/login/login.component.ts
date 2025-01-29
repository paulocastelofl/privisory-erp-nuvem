import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { delay } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,

  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  public hassignup: boolean = false;
  public form!: FormGroup;
  public showLoading: boolean = false;

  public showMessage = true;

  constructor(
    private formBuilder: FormBuilder,
    private readonly _router: Router,
    private _serviceAuth: AuthService,
  ) {
    this.form = this.formBuilder.group({
      name: [{ value: null, disabled: false }, [Validators.required]],
      password: [{ value: null, disabled: false }, [Validators.required, Validators.minLength(8)]],
      codenterprise: [{ value: null, disabled: false }, [Validators.required]],
    });
  }

  get formControl() {
    return this.form.controls;
  }

  onClickSignup = () => {
    this.hassignup = !this.hassignup;
  }

  gotLogin() {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.showLoading = true;
    this._serviceAuth.authenticUser('Auth/login', this.form.value)
      .pipe(
        delay(2000),
      )
      .subscribe({
        next: () => {
          this._router.navigate(['/dashboard']);
          this.showLoading = false;
        },
        error: (error) => {
          console.error('Erro: ', error);
          this.showLoading = false;
        }
      })
  }
}
