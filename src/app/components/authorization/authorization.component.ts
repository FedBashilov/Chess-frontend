import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {
  public isRegistered: boolean = true;  //Для того, какую форму показывать пользователю
  public loginForm: FormGroup;  //Форма входа
  public loginErrorMessage: string = "";  //Сообщения об ошибке формы входа
  public registrationForm: FormGroup; //Форма регистрации
  public registrationErrorMessage: string = ""; //Сообщения об ошибке формы регистрации

  //Отслеживаемый текущий пользователь
  private subscriptionUser: Subscription;
  public currentUser: User = new User;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    //Подписка на текущего пользователя
    this.subscriptionUser = this.authService.currentUser.subscribe(currentUser => {
      this.currentUser = currentUser;
    });
  }

  ngOnInit(): void {
    //Инициализация форм
    this.initForms();
  }

  ngOnDestroy(){
    //Отписка от отслеживания
    this.subscriptionUser.unsubscribe();
  }

  //Метод для инициализации форм
  initForms(){
    this.loginForm = this.fb.group({
      nickname: ['', [
        Validators.required,
        Validators.minLength(2)
      ]
      ],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]
      ],
    });

    this.registrationForm = this.fb.group({
      nickname: ['', [
        Validators.required,
        Validators.minLength(2)
      ]
      ],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]
      ],
    });
  }

  // Метод для контролирования валидации
  isControlInvalid(controlName: string, form: FormGroup): boolean {
    const control = form.controls[controlName];
    const result = control.invalid && control.touched;
    return result;
  }

  //Метод для входа пользователя
  onSubmitLogin() {
    const controls = this.loginForm.controls;
    if (this.loginForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }

    this.authService.login(this.loginForm.value.nickname, this.loginForm.value.password).subscribe( (response: any) =>{
      if(response.jwt){
        this.authService.setCurrentUser(response.jwt);
       // this.showOrHideForm();
        this.loginErrorMessage = "";
      } else {
        this.loginErrorMessage = response;
      }

    });
  }

  //Метод для регистрации пользователя
  onSubmitRegistration() {
    const controls = this.registrationForm.controls;
    if (this.registrationForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }
    let newUser: User = new User(
      this.registrationForm.value.nickname,
      this.registrationForm.value.password
    );

    this.authService.registration(newUser).subscribe( (response: any) =>{

      if(response.jwt){
        this.authService.setCurrentUser(response.jwt);
        // this.showOrHideForm();
        this.registrationErrorMessage = "";
      } else {
        this.registrationErrorMessage = response;
      }
    });
  }

}
