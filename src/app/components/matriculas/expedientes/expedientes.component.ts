import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { Estudiante } from 'src/app/models/estudiante';

@Component({
  selector: 'app-expedientes',
  templateUrl: './expedientes.component.html',
  styleUrls: ['./expedientes.component.css']
})
export class ExpedientesComponent implements OnInit {


  cedula: string = "";
  estudiante: Estudiante;
  mensaje = "";

  cedulaError: boolean = false;

  constructor(private serviceEstudiante: EstudianteService, private spinnerService: NgxSpinnerService) {
    this.estudiante = new Estudiante();
    this.mensaje = "No ha realizado ninguna búsqueda";
  }

  ngOnInit() {
  }


  buscarCedula(): void {

    if (this.cedula == "") {

      this.cedulaError = true;

    } else {
      this.spinnerService.show();
      this.cedulaError = false;
      this.serviceEstudiante.buscarEstudiante(this.cedula).subscribe(est => {
        this.estudiante = est;
        if (this.estudiante == null) {
          this.mensaje = "No existe un estudiante con esa cédula";
        }
      });


      this.spinnerService.hide();
    }
  }


}
