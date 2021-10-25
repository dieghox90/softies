import { Component, OnInit } from '@angular/core';
import { SolicitudMatricula } from 'src/app/models/solicitud-matricula';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { LocalService } from 'src/app/services/local.service';
import { AuthService } from 'src/app/services/auth.service';
import { Estudiante } from 'src/app/models/estudiante';
import { IfStmt } from '@angular/compiler';
import { Carrera } from 'src/app/models/carrera';
import { CarreraService } from 'src/app/services/carrera.service';
import Swal from 'sweetalert2';
import { SolicitudMatriculaService } from 'src/app/services/solicitud-matricula.service';
import { HttpEventType } from '@angular/common/http';
import { Ciclo } from 'src/app/models/ciclo';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-form-solicitud',
  templateUrl: './form-solicitud.component.html',
  styleUrls: ['./form-solicitud.component.css']
})
export class FormSolicitudComponent implements OnInit {


  solicitud: SolicitudMatricula;
  estudiante: Estudiante;
  idp: number;
  periodo: string;
  carrera: Carrera;
  solicitudes: SolicitudMatricula[];
  ciclo: Ciclo;

  public archivoSeleccionado: File;
  progreso: number = 0;
  tipoArchivo: string = "";

  errores: string[];

  constructor(private serviceSolicitud: SolicitudMatriculaService, public authService: AuthService, private serviceCarrea: CarreraService, private serviceEstudiante: EstudianteService, private localService: LocalService) {
    this.solicitud = new SolicitudMatricula();
    this.idp = this.localService.getJsonValue('idP');
    this.periodo = this.localService.getJsonValue('nomP');
    this.carrera = new Carrera();
    this.carrera.ciclos = [];
    this.solicitudes = [];
    this.ciclo = new Ciclo();
    this.errores = [];
  }

  ngOnInit() {
    this.serviceSolicitud.listarById(this.authService.usuario.index).subscribe(s => {
      this.solicitudes = s;

    });

    this.serviceEstudiante.ver(this.authService.usuario.index).subscribe(e => {
      this.estudiante = e;
      if (this.estudiante != null) {
        this.solicitud.estudiante = this.estudiante.apellido + " " + this.estudiante.nombre;
        this.solicitud.estudiante_id = this.estudiante.id;
        this.solicitud.cedula = this.estudiante.cedula;
        this.solicitud.correo = this.estudiante.correo;

        // ------ Para ver la matricula ------
        let id = 0;
        this.serviceEstudiante.buscarEstudiante(this.estudiante.cedula).subscribe(est => {
          this.estudiante = est;
          if (this.estudiante.matriculas.length > 0) {
            if (this.estudiante.matriculas.length == 1) {
              id = this.estudiante.matriculas[0].periodo_lectivo.id;
            } else {
              for (let i = 0; i < this.estudiante.matriculas.length; i++) {
                let fecha1 = new Date(this.estudiante.matriculas[i].periodo_lectivo.fecha_fin);
                for (let j = 1; j < this.estudiante.matriculas.length; j++) {
                  let fecha2 = new Date(this.estudiante.matriculas[j].periodo_lectivo.fecha_fin);


                  if (fecha1 > fecha2) {

                    id = this.estudiante.matriculas[i].periodo_lectivo.id;
                  } else {
                    id = this.estudiante.matriculas[j].periodo_lectivo.id;
                  }
                }
              }
            }
          }

          //ultima matricula
          this.estudiante.matriculas = this.estudiante.matriculas.filter(ma => ma.periodo_lectivo.id === id);
          if (this.estudiante.matriculas.length > 0) {

            //alert('matricula anterior');
            this.estudiante.matriculas.forEach(mat => {
              this.solicitud.carrera = mat.paralelo.ciclo.carrera.nombre;
              this.solicitud.carrera_id = mat.paralelo.ciclo.carrera.id
            });

            // Cargamos los ciclos y la carrera //
            this.serviceCarrea.ver(this.solicitud.carrera_id).subscribe(c => {
              this.carrera = c;
              let ciclos: Ciclo[] = [];
              let next: number;


              this.carrera.ciclos.forEach(c => {
                this.estudiante.matriculas.forEach(m => {
                  if (c.peso == m.paralelo.ciclo.peso) {
                    ciclos.push(c);
                    next = c.peso;
                    next++;
                  }

                  if (c.peso == next) {
                    ciclos.push(c);
                  }
                });
              });

              this.carrera.ciclos = [];
              this.carrera.ciclos = ciclos;

            });
          } else {
            if (this.solicitud.carrera_id != null) {
              this.serviceCarrea.ver(this.solicitud.carrera_id).subscribe(c => {
                this.carrera = c;
              });
            }
            if (this.estudiante.carrera_id != null) {

              this.serviceCarrea.ver(this.estudiante.carrera_id).subscribe(ca => {
                this.carrera = ca;
                this.solicitud.carrera = this.carrera.nombre;
                this.solicitud.carrera_id = this.carrera.id
                let ciclos: Ciclo[] = [];
                this.carrera.ciclos.forEach(c => {
                  if (c.peso == 1) {
                    ciclos.push(c);
                  }
                });
                this.carrera.ciclos = [];
                this.carrera.ciclos = ciclos;

              });
            }

          }

        });
      }

    });

  }



  seleccionarArchivo(event, tipoArchivo: string) {
    this.tipoArchivo = tipoArchivo;
    this.archivoSeleccionado = event.target.files[0];
    let fileSize = event.target.files[0].size / 1024;
    if (fileSize < 10000) {
      this.progreso = 0;
      this.archivoSeleccionado.name;
      let entradaRar: boolean = this.archivoSeleccionado.name.indexOf('rar') < 0;
      let entradaZip: boolean = this.archivoSeleccionado.type.indexOf('zip') < 0;

      let bandera: boolean = false;

      if (entradaRar) {
        bandera = true;
        if (!entradaZip) {
          bandera = false;
        }
      }


      if (entradaZip) {
        bandera = true;
        if (!entradaRar) {
          bandera = false;
        }
      }

      if (bandera) {
        Swal.fire('Error tipo de archivo: ', 'Debe elegir un archivo comprimido en extensión .zip o .rar', 'error');
        this.archivoSeleccionado = null;
      }

    } else {
      Swal.fire('Error tamaño archivo: ', 'El tamaño máximo permitido es de 10 MB', 'error');
      this.archivoSeleccionado = null;
    }



  }


  guardar(): void {

    this.solicitud.ciclo = this.ciclo.nombre;
    this.solicitud.ciclo_id = this.ciclo.id;

    if (!this.archivoSeleccionado) {
      Swal.fire('Error Upload: ', 'Debe seleccionar un archivo', 'error');
    } else if (this.ciclo.id == null) {
      Swal.fire('Error: ', 'Debe seleccionar un ciclo', 'error');
    } else {

      let bandera: boolean = false;

      this.solicitudes.forEach(s => {
        if (this.solicitud.ciclo_id == s.ciclo_id) {
          bandera = true;
        }
      });

      if (bandera) {
        Swal.fire('Error: ', 'Ya tiene una solicitud enviada para el ciclo: ' + this.solicitud.ciclo, 'error');
      } else {
        Swal.fire({
          title: "Confirmación",
          html: "Una vez enviada su documentación <strong>no podrá corregirla </strong>, hasta que la secretaria le envíe correcciones si es que fuera el caso.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Enviar"
        }).then(result => {
          if (result.value) {
            this.solicitud.periodo = this.periodo;
            this.solicitud.periodo_id = this.idp;
            this.solicitud.tipo = "En revisión";

            this.serviceSolicitud.crear(this.solicitud).subscribe(s => {
              let soli: SolicitudMatricula = new SolicitudMatricula();
              soli = s;

              if (soli != null) {
                this.serviceSolicitud.subirArchivo(this.archivoSeleccionado, soli.id, "En revisión")
                  .subscribe(event => {
                    if (event.type === HttpEventType.UploadProgress) {
                      this.progreso = Math.round((event.loaded / event.total) * 100);
                    } else if (event.type === HttpEventType.Response) {
                      let response: any = event.body;
                      this.solicitud = new SolicitudMatricula();
                      this.solicitud = response.solicitud as SolicitudMatricula;
                      Swal.fire('Exito', response.mensaje, 'success');
                      this.progreso = 0;

                      this.serviceSolicitud.listarById(this.authService.usuario.index).subscribe(s => {
                        this.solicitudes = s;
                      });
                    }
                  },
                    err => {
                      this.errores = err.error.errors as string[];
                      Swal.fire('Error', `Problema: ${err.error.mensaje}`, 'error');
                      this.serviceSolicitud.eliminar(soli.id).subscribe(e => {
                        Swal.fire('Error', `Posible problema de su internet, Solicitud Eliminada`, 'error'); 
                      });
                    });

              }
            });
          }
        });
      }
    }

    // ----- Fin subida de archivo ---------

  }


  corregirArchivo(soli: SolicitudMatricula): void {

    if (!this.archivoSeleccionado) {
      Swal.fire('Error Subida: ', 'Debe seleccionar un archivo', 'error');
    } else {

      Swal.fire({
        title: "Confirmación",
        html: "Una vez enviada su documentación <strong>no podrá corregirla </strong>, hasta que la secretaria le envíe correcciones si es que fuera el caso.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Enviar"
      }).then(result => {
        if (result.value) {
          this.serviceSolicitud.subirArchivo(this.archivoSeleccionado, soli.id, "Corregido")
            .subscribe(event => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progreso = Math.round((event.loaded / event.total) * 100);
              } else if (event.type === HttpEventType.Response) {

                let response: any = event.body;
                Swal.fire('Exito', response.mensaje, 'success');
                this.serviceSolicitud.listarById(this.authService.usuario.index).subscribe(s => {
                  this.solicitudes = s;
                  //this.progreso = 0;
                });
              }
            },
              err => {
                this.errores = err.error.errors as string[];
                Swal.fire('Error', `Problema: ${err.error.mensaje}`, 'error');
              });



        }
      });
    }

  }


}
