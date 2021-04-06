export class User{  //Класс-модель пользователя
  public id: number = null; //id пользователя
  public nickname: string = ""; //Никнейм
  public password: string = ""; //Пароль

  constructor(nickname?, password?){
    this.nickname = nickname;
    this.password = password;
  }
}
