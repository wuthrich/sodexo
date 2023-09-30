import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http: HttpClient) { }

  private url = 'https://api.spaceflightnewsapi.net/v4/articles/';

  getPrimerasNoticias() {
    return this.http.get(this.url);
  }

  getNoticias(url : string) {
    return this.http.get(url);
  }

  getBusquedaNoticias(parametros:string) {     
    console.log(this.url+parametros);
    return this.http.get(this.url+parametros);
   
  }

}
