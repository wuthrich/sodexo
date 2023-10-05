import { Component } from '@angular/core';
import { HttpServiceService } from '../http-service.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent {

  constructor(private httpService: HttpServiceService) { }

  noticias : any;
  respuesta : any;
  ordenado: boolean = false;
  palabraBusqueda = new FormControl('');
  atras!: HTMLButtonElement;
  adelante!: HTMLButtonElement;

  ngOnInit() {    

    this.httpService.getPrimerasNoticias().subscribe(
      (response) => { this.respuesta = response; this.formatearFecha(this.respuesta.results);},
      (error) => { console.log(error); });

      this.atras = <HTMLButtonElement> document.getElementById("atras");
      this.adelante = <HTMLButtonElement> document.getElementById("adelante");  
      this.atras.disabled = true;

  }

  ingresarAfavoritos(articulo:any){

    
    var icono = document.getElementById(articulo.id)??new HTMLElement();

    this.httpService.postArticle(articulo).subscribe(
      (response) => { icono.className = "bi bi-star-fill";},
      (error) => { console.log(error); });

  }

  formatearFecha(nodo: any){    
    
    const newArr:any[] = []; 
    nodo.forEach((item: any) => {
      var splitted = item.published_at.split("T");
      var fecha = splitted[0].split("-");
      item.fecha = fecha[2] + "-" + fecha[1] + "-" + fecha[0];
      newArr.push(item)
    })

    this.noticias = newArr;

    if(null!=this.respuesta.next){
      var off = this.respuesta.next.split("offset=");
      var off2 = off[1].split("&");
      this.respuesta.offset = off2[0];
    }else{
      this.respuesta.offset = this.respuesta.count;
    }
    
  }

  paginarAdelante(){
    if(this.respuesta.next!=null)
    this.httpService.getNoticias(this.respuesta.next).subscribe(
      (response) => { this.respuesta = response; this.formatearFecha(this.respuesta.results); this.habilitarAtras();},
      (error) => { console.log(error); });
  }

  habilitarAtras(){
    this.atras.disabled = false;
    if(this.respuesta.next == null){
      this.adelante.disabled = true;
    }
  }

  paginarAtras(){
    if(this.respuesta.previous!=null)
    this.httpService.getNoticias(this.respuesta.previous).subscribe(
      (response) => { this.respuesta = response; this.formatearFecha(this.respuesta.results); this.habilitarAdelante();},
      (error) => { console.log(error); });
  }

  habilitarAdelante(){
    this.adelante.disabled = false;
    if(this.respuesta.previous == null){
      this.atras.disabled = true;
    }
  }

  ordenar(){

      var icono = document.getElementById("ordenarFecha")??new HTMLElement();
     
        if(this.ordenado){
          this.ordenado = false;
          icono.className = "bi bi-arrow-down";
        }else{
          this.ordenado = true;
          icono.className = "bi bi-arrow-up";
        }
       
      this.busqueda();  
  }

  busqueda(){

    var parametros:string = '';
    var orden:string = '';
    var palabra:string = '';

    if(this.ordenado){
      orden = 'ordering=published_at';
    }
    
    if(this.palabraBusqueda.value != null && this.palabraBusqueda.value != ''){      
      palabra = 'search='+this.palabraBusqueda.value;
    }

    if(orden != '' && palabra != ''){
      parametros = '?' + orden + '&' + palabra;
    }else{
      if(palabra != ''){
        parametros = '?' + palabra;
      }

      if(orden != ''){
        parametros = '?' + orden;
      }
    }

    this.httpService.getBusquedaNoticias(parametros).subscribe(
      (response) => { this.respuesta = response; this.formatearFecha(this.respuesta.results);this.adelante.disabled = false;this.atras.disabled = true;},
      (error) => { console.log(error); });   
 
  }


}
