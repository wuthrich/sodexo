import { Component } from '@angular/core';
import { HttpServiceService } from '../http-service.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent {

  constructor(private httpService: HttpServiceService) { }

  noticias : any;
  respuesta : any;
  atras!: HTMLButtonElement;
  adelante!: HTMLButtonElement;
  palabraBusqueda = new FormControl('');
  ordenado: boolean = false;
  parametros: string = '';

  ngOnInit() {

    this.httpService.getArticles().subscribe(
      (response) => { this.respuesta = response; this.noticias = this.respuesta.content;},
      (error) => { console.log(error); });
      
    this.atras = <HTMLButtonElement> document.getElementById("atras");
    this.adelante = <HTMLButtonElement> document.getElementById("adelante");  
    this.atras.disabled = true;

  }

  formatearFecha(fechaEntrada:string){
    var splitted = fechaEntrada.split("T");
    var fecha = splitted[0].split("-");
    var fechaSalida = fecha[2] + "-" + fecha[1] + "-" + fecha[0];

    return fechaSalida;
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

  this.parametros = '';
  var orden:string = '';
  var palabra:string = '';

  if(this.ordenado){
    orden = 'orden=published';
  }
  
  if(this.palabraBusqueda.value != null && this.palabraBusqueda.value != ''){      
    palabra = 'search='+this.palabraBusqueda.value;
  }

  if(orden != '' && palabra != ''){
    this.parametros = '&' + orden + '&' + palabra;
  }else{
    if(palabra != ''){
      this.parametros = '&' + palabra;
    }

    if(orden != ''){
      this.parametros = '&' + orden;
    }
  }

 

    this.httpService.getArticlesPage(0, this.parametros).subscribe(
      (response) => { this.respuesta = response; this.atras.disabled = true; this.noticias = this.respuesta.content;},
      (error) => { console.log(error); });   

}

  borrar(noticia:any, index: number){

    this.httpService.deleteArticle(noticia.id).subscribe(
      (response) => {},
      (error) => { console.log(error); });

      this.noticias.splice(index, 1); 

  }



  paginarAdelante(){

    var siguientePagina:number = this.respuesta.number + 1;

    this.httpService.getArticlesPage(siguientePagina, this.parametros).subscribe(
      (response) => { this.respuesta = response; this.habilitarAtras(); this.noticias = this.respuesta.content;},
      (error) => { console.log(error); });
  }

  habilitarAtras(){
    this.atras.disabled = false;
    if(this.respuesta.last){
      this.adelante.disabled = true;
    }
  }


  paginarAtras(){
    var siguienteAnterior:number = this.respuesta.number - 1;

    this.httpService.getArticlesPage(siguienteAnterior, this.parametros).subscribe(
      (response) => { this.respuesta = response; this.habilitarAdelante(); this.noticias = this.respuesta.content;},
      (error) => { console.log(error); });
  }

  habilitarAdelante(){
    this.adelante.disabled = false;
    if(this.respuesta.first){
      this.atras.disabled = true;
    }
  }

  elementosActuales(){

    // {{elementosActuales(respuesta.number)}} de {{respuesta.totalElements}} noticias 
    if(undefined == this.respuesta){
      return '';  
    }else{

      var actuales:number = 0;
      var salida:string = '';
      if(this.respuesta.last){
        actuales = this.respuesta.totalElements;
      }else{
        actuales = (this.respuesta.number + 1)*10;
      }

      salida = actuales + ' de ' + this.respuesta.totalElements;
      return salida;
    }

  }




}
