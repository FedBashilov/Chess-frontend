import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  //Сервис авторизации

  //Отслеживаемый объект текущего пользователя
  private currentUserSubject = new BehaviorSubject<User>( new User );
  public currentUser = this.currentUserSubject.asObservable();
  public user: User = new User;

  public API_SERVER = "http://localhost"; //Адрес сервера

  constructor(private httpUser: HttpClient) {
    //Установка текущего пользователя
    let user: User = JSON.parse(localStorage.getItem("current_user"));
    if(user){
      this.currentUserSubject.next(user);
    }
  }

  //Метод для получение текущего JWT токена
  getJWT(){
    return localStorage.getItem("jwt");
  }

  //Метод для входа пользователя
  login(nickname, password): Observable<any>{
    return this.httpUser.post<any>(`${this.API_SERVER}/api/users/login`, {data: { nickname: nickname, password: password }});
  }

  //Метод для установки текущего пользователя
  setCurrentUser(jwt: string){
    localStorage.setItem("jwt", jwt); //Устанавливаем новый JWT
    //Получение и установка информации о текущем пользователе
    this.getUserInfo().subscribe( (user: User) => {
      this.currentUserSubject.next(user);
      localStorage.setItem("current_user",  JSON.stringify(user));
    });
  }

  //Метод для выхода пользователя из аккаунта
  logout(){
    localStorage.removeItem("current_user");
    localStorage.removeItem("jwt");
    this.currentUserSubject.next(new User);
  }

  //Метод для регистрации нового пользователя
  registration(newUser: User): Observable<any>{
    return this.httpUser.post<any>(`${this.API_SERVER}/api/users`, {data: newUser});
  }

  //Метод для получения информации о текущем пользователе
  getUserInfo(): Observable<User>{
    let jwt = this.getJWT(); //Получение JWT токена текущего пользователя
    let headers = new HttpHeaders().set('JWT', `${jwt}`); //Добавление JWT в заголовки запроса
    return this.httpUser.get<User>(`${this.API_SERVER}/api/users`, {headers: headers} );
  }

}
