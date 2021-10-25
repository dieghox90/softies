import { Component, OnInit, ViewChild, ElementRef, Inject, ɵConsole } from '@angular/core';
import { Carrera } from 'src/app/models/carrera';
import { CargaHoraria } from 'src/app/models/carga-horaria';
import { Ciclo } from 'src/app/models/ciclo';
import { Paralelo } from 'src/app/models/paralelo';
import { PeriodoService } from 'src/app/services/periodo.service';
import { Periodo } from 'src/app/models/periodo';
import { Asignatura } from 'src/app/models/asignatura';
import { DocenteService } from 'src/app/services/docente.service';
import { Docente } from 'src/app/models/docente';
import { ModalAsignacionComponent } from './modal-asignacion/modal-asignacion.component';
import { Distributivo } from 'src/app/models/distributivo';
import { DistributivoService } from 'src/app/services/distributivo.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalService } from 'src/app/services/local.service';


@Component({
  selector: 'app-carga-horaria',
  templateUrl: './carga-horaria.component.html',
  styleUrls: ['./carga-horaria.component.css']
})
export class CargaHorariaComponent implements OnInit {

  carreras: Carrera[];
  carrera: Carrera;
  ciclo: Ciclo;
  paralelo: Paralelo;
  asignaturas: Asignatura[];

  docentes: Docente[];
  docente: Docente;

  distributivo: Distributivo;
  periodos: Periodo[];
  periodo: Periodo;
  eliminar: number[] = [];

  cargassHorariasAux: CargaHoraria[];

  idP = this.localService.getJsonValue('idP');

  @ViewChild(ModalAsignacionComponent) modalComponent: ModalAsignacionComponent;


  constructor(private localService: LocalService, private spinnerService: NgxSpinnerService, private serviceDistributivo: DistributivoService, private serviceDocente: DocenteService, private servicioPeriodo: PeriodoService) {
    this.carrera = new Carrera();
    this.ciclo = new Ciclo();
    this.paralelo = new Paralelo();
    this.distributivo = new Distributivo();
    this.periodo = new Periodo();
    this.docente = new Docente();
    this.docente.cargas_horarias = [];
    this.cargassHorariasAux = [];
    this.docentes = [];
    this.distributivo.cargas_horarias = [];
  }



  ngOnInit() {
    if (this.idP != null) {
      this.spinnerService.show();
      this.servicioPeriodo.ver(this.idP).subscribe(p => {
        this.periodo = p;
      });
      this.cargarDocentes(this.idP);
    }

  }


  public cargarDocentes(idP: number): void {

    this.serviceDistributivo.verByPeriodo(idP).subscribe(dist => {
      if (dist == null) {
        this.distributivo = new Distributivo();
        this.serviceDocente.listar().subscribe(docentes => {
          this.docentes = docentes;
          this.docentes.forEach(d => {
            d.cargas_horarias = [];
          });
        });

      } else {
        this.distributivo = new Distributivo();
        this.distributivo = dist;
        this.serviceDocente.listar().subscribe(docentes => {
          this.docentes = docentes;

          //encerar cargas horarias
          this.docentes.forEach(d => {
            d.cargas_horarias = [];
          });

          this.distributivo.cargas_horarias.forEach(ch => {
            this.docentes.forEach(d => {
              if (ch.docente.id == d.id) {
                d.cargas_horarias.push(ch);
              }
            });
          });

        });

      }

      this.spinnerService.hide();
    });



  }


  public eliminarAsignatura(carga: CargaHoraria, docente: Docente): void {
    this.spinnerService.show();
    this.docentes.forEach(doc => {
      if (doc.id == docente.id) {
        this.docente = doc;
      }
    });

    this.docente.cargas_horarias.forEach((ch, i) => {
      if (ch.asignatura.nombre == carga.asignatura.nombre) {
        if (ch.paralelo.nombre == carga.paralelo.nombre) {

          this.docente.cargas_horarias.splice(i, 1);
        }
      }
    });
    this.spinnerService.hide();
  }


  //enviar al Hijo
  public fijarDocentePeriod(docente: Docente) {

    this.docente = docente;
    if (this.distributivo.id == null) { //este puse ahora
      docente.cargas_horarias = [];
    }
    this.cargassHorariasAux = docente.cargas_horarias;

    this.modalComponent.fijarDocentePeriodoPadre(docente);

  }

  //recibir del hijo
  public recibirCargaModal(cargH: CargaHoraria[]) {


    //// verificar los eliminados que vienen del modal //////
    /*
    var iguales: number[] = [];
    this.cargassHorariasAux.forEach((aux, i) => {
      cargH.forEach((param, j) => {
        if (aux.asignatura.nombre == param.asignatura.nombre) {
          if (aux.paralelo.nombre == param.paralelo.nombre) {
            iguales.push(i);
          }
        }
      });
    });

    iguales.forEach(ind => {
      this.cargassHorariasAux.forEach((c, i) => {
        if (iguales.indexOf(i) == -1) {//-1 significa que no contiene ese indice

          if (this.eliminar.indexOf(i) == -1) { //para no repetir los indices en eliminar
            this.eliminar.push(i);
          }
        }
      });
    });




    let cargelim: CargaHoraria[] = [];

    this.cargassHorariasAux.forEach((as, i) => {
      this.eliminar.forEach(e => {
        if (e == i) {
          cargelim.push(as);

        }
      });
    });


    for (let i = 0; i < this.cargassHorariasAux.length; i++) {

      for (let j = 0; j < cargelim.length; j++) {
        if (this.cargassHorariasAux[i].asignatura.nombre == cargelim[j].asignatura.nombre) {
          this.cargassHorariasAux.splice(i, 1);
        }
      }
    }

*/

    /////// FIN ELIMINACION //////////



    cargH.forEach(ch => {
      ch.docente.id = this.docente.id;
      //ch.paralelo.ciclo = new Ciclo();

      ch.docente.cargas_horarias.forEach(chd => {
        chd.paralelo.ciclo.paralelos = [];
        chd.paralelo.ciclo.carrera = new Carrera();

      })

    });



  }



  public guardar(docente: Docente): void {

    this.spinnerService.show();
    this.distributivo.documento = "";
    this.distributivo.periodo = this.periodo;
    this.distributivo.cargas_horarias = docente.cargas_horarias;
    /*
        this.distributivo.cargas_horarias.forEach(ch => {
          ch.docente.cargas_horarias = [];
          ch.paralelo.ciclo = new Ciclo();
        });
    */

    this.serviceDistributivo.crear(this.distributivo).subscribe(dist => {
      if (dist.id) {
        this.serviceDistributivo.verByPeriodo(this.periodo.id).forEach(disDB => {
          this.distributivo = disDB;

          let cargas: CargaHoraria[] = [];

          this.distributivo.cargas_horarias.forEach(c => {
            if (c.docente.id == this.docente.id) {
              cargas.push(c)
            }
          });


          this.docentes.forEach(d => {
            if (d.id == this.docente.id) {
              if (cargas.length > 0) {
                d.cargas_horarias = [];
                d.cargas_horarias = cargas;
              }
            }
          });

        });
      }

      this.spinnerService.hide();



      Swal.fire(
        "Guardado exitoso ",
        "Carga Horaria de " + this.docente.nombre + " " + this.docente.apellido + " <strong>Asignada</strong> con exito",
        "success"
      );
    });

  }


  public editar(docente: Docente): void {

    this.spinnerService.show();

    this.distributivo.cargas_horarias = docente.cargas_horarias;


    docente.cargas_horarias = [];
    this.distributivo.cargas_horarias.forEach(ch => {
      ch.docente = docente;
    });

    console.log(this.distributivo);


    this.serviceDistributivo.editar(this.distributivo).subscribe(dist => {
      let cargas: CargaHoraria[] = [];


      dist.cargas_horarias.forEach(c => {
        if (c.docente.id == this.docente.id) {
          cargas.push(c)
        }
      });


      this.docentes.forEach(d => {
        if (d.id == this.docente.id) {
          if (cargas.length > 0) {
            d.cargas_horarias = cargas;
          }
        }
      });


      this.spinnerService.hide();
      Swal.fire(
        "Guardado exitoso ",
        "Carga Horaria de " + this.docente.nombre + " " + this.docente.apellido + " <strong>Asignada</strong> con exito",
        "success"
      );

    });







  }


}
