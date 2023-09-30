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

  ngOnInit() {    

    this.httpService.getPrimerasNoticias().subscribe(
      (response) => { this.respuesta = response; this.formatearFecha(this.respuesta.results);},
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

    var off = this.respuesta.next.split("offset=");
    var off2 = off[1].split("&");
    this.respuesta.offset = off2[0];
  }

  paginarAdelante(){
    if(this.respuesta.next!=null)
    this.httpService.getNoticias(this.respuesta.next).subscribe(
      (response) => { this.respuesta = response; this.formatearFecha(this.respuesta.results);},
      (error) => { console.log(error); });
  }

  paginarAtras(){
    if(this.respuesta.previous!=null)
    this.httpService.getNoticias(this.respuesta.previous).subscribe(
      (response) => { this.respuesta = response; this.formatearFecha(this.respuesta.results);},
      (error) => { console.log(error); });
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
      (response) => { this.respuesta = response; this.formatearFecha(this.respuesta.results);},
      (error) => { console.log(error); });   
 
  }


}
