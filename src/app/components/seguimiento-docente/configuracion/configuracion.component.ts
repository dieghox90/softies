import { Component, OnInit } from '@angular/core';
import { ConfiguracionPlanes } from 'src/app/models/configuracion-planes';
import { ConfiguracionPlanesService } from 'src/app/services/configuracion-planes.service';
import { LocalService } from 'src/app/services/local.service';


import Swal from 'sweetalert2';


// --- Declarando JQuery ---
declare var $: any;

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {


  configuracionPlanes: ConfiguracionPlanes;
  configuracionPlanesAux: ConfiguracionPlanes;
  configuracionesPlanes: ConfiguracionPlanes[];
  idP: number;
  nombrePeriodo: string;




  constructor(private localService: LocalService, private service: ConfiguracionPlanesService) {
    this.configuracionPlanes = new ConfiguracionPlanes();
    this.idP = this.localService.getJsonValue('idP');
    this.nombrePeriodo = this.localService.getJsonValue('nomP');

  }

  ngOnInit(): void {
    this.service.listar(this.idP).subscribe(confs => {
      this.configuracionesPlanes = confs;
    });
  }


  guardar() {
    let bandera = false;
    this.configuracionesPlanes.forEach(c => {
      if (c.numero_semana == this.configuracionPlanes.numero_semana) {
        bandera = true;
      }
    });

    if (!bandera) {

      this.configuracionPlanes.periodo_id = this.idP;

      this.service.crear(this.configuracionPlanes).subscribe(c => {
        Swal.fire(
          "Guardado",
          "Configuración Semana <strong>" + c.numero_semana + "</strong> Almacenada con éxito",
          "success"
        );
        this.service.listar(this.idP).subscribe(confs => {
          this.configuracionesPlanes = confs;
        });

        //CERRANDO MODAL
        $('.modal-configuracion').modal('hide');
      });
    } else {
      Swal.fire(
        "Error:",
        "Ya existe una configuración de la semana <strong>" + this.configuracionPlanes.numero_semana + "</strong>",
        "error"
      );
    }
  }

  actualizar() {

    let bandera = false;
    this.configuracionesPlanes.forEach(c => {
      if (c.numero_semana == this.configuracionPlanes.numero_semana) {
        bandera = true;
      }
    });

    if (!bandera) {

      this.configuracionPlanes.periodo_id = this.idP;

      this.service.crear(this.configuracionPlanes).subscribe(c => {
        Swal.fire(
          "Actualización",
          "Configuración Semana <strong>" + c.numero_semana + "</strong> ACTUALIZADA con éxito",
          "success"
        );
        this.service.listar(this.idP).subscribe(confs => {
          this.configuracionesPlanes = confs;
        });

        //CERRANDO MODAL
        $('.modal-configuracion').modal('hide');

        this.configuracionPlanes = new ConfiguracionPlanes();
      });
    } else {
      Swal.fire(
        "Error:",
        "Ya existe una configuración de la semana <strong>" + this.configuracionPlanes.numero_semana + "</strong>",
        "error"
      );
    }
  }

  fijarConfiguracion(c: ConfiguracionPlanes) {
    this.configuracionPlanes = new ConfiguracionPlanes();
    this.configuracionPlanes.id = c.id;
    this.configuracionPlanes.numero_semana = c.numero_semana;
    this.configuracionPlanes.fecha_inicio = c.fecha_inicio;
    this.configuracionPlanes.fecha_fin = c.fecha_fin;
    this.configuracionPlanes.periodo_id = c.periodo_id;
    this.configuracionPlanes.estado = c.estado;
  }


  cancelarEdicion() {
    this.configuracionPlanes = new ConfiguracionPlanes();
  }


  eliminar(configuracion: ConfiguracionPlanes) {
    Swal.fire({
      title: "Confirmación Eliminación",
      html: "Está seguro de eliminar la configuración de la semana " + configuracion.numero_semana,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí"
    }).then(result => {
      if (result.value) {
        this.service.eliminar(configuracion.id).subscribe(() => {
          this.configuracionesPlanes = this.configuracionesPlanes.filter(c => c.id !== configuracion.id);
          Swal.fire('Exito: ', 'Se ha eliminado correctamente', 'success');
        });
      }
    });
  }

}
