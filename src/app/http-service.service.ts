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
    return this.http.get(this.url+parametros);
  }

  private urlLocal = 'http://localhost:8080/article';

  postArticle(body:any){
    body.published = body.published_at;    
    return this.http.post(this.urlLocal, body);
  }

  deleteArticle(id:any){
    return this.http.delete(this.urlLocal+'/'+id);
  }

  getArticles(){
    return this.http.get(this.urlLocal);
  }

  getArticlesPage(page:any, parametros?:any){
    
    if(undefined == parametros){
      parametros = '';
    }
    return this.http.get(this.urlLocal+'/?pagina='+page+parametros);
  }

}
