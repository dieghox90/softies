import { Component, OnInit, ViewChild } from '@angular/core';
import { Clasificacion } from 'src/app/models/clasificacion';
import { ClasificacionService } from 'src/app/services/clasificacion.service';
import { FormClasificacionComponent } from './form-clasificacion/form-clasificacion.component';

@Component({
  selector: 'app-clasificaciones',
  templateUrl: './clasificaciones.component.html',
  styleUrls: ['./clasificaciones.component.css']
})
export class ClasificacionesComponent implements OnInit {

  @ViewChild(FormClasificacionComponent) modalComponent: FormClasificacionComponent;


  clasificaciones: Clasificacion[];
  clasificacion: Clasificacion;




  constructor(private service: ClasificacionService) {
    this.clasificaciones = [];
    this.clasificacion = new Clasificacion();
  }

  ngOnInit() {
    this.service.listar().subscribe(clas => {
      this.clasificaciones = clas;
    });
  }

  public recibirClasificacionesHijo(clasif: Clasificacion[]) {
    this.clasificaciones = clasif;
  }

  public enviarHijo(c: Clasificacion) {
    this.modalComponent.recibirPadreHijo(c);
  }



}
