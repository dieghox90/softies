import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CargaHorariaService } from 'src/app/services/carga-horaria.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CargaHoraria } from 'src/app/models/carga-horaria';
import { Asignatura } from 'src/app/models/asignatura';
import { Paralelo } from 'src/app/models/paralelo';
import { Ciclo } from 'src/app/models/ciclo';
import { Carrera } from 'src/app/models/carrera';
import { PlanificacionAcademica } from 'src/app/models/planificacion-academica';
import { MatriculaService } from 'src/app/services/matricula.service';
import { LocalService } from 'src/app/services/local.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignatura-informacion',
  templateUrl: './asignatura-informacion.component.html',
  styleUrls: ['./asignatura-informacion.component.css']
})
export class AsignaturaInformacionComponent implements OnInit {
  cargaHoraria: CargaHoraria;

  constructor(public authService: AuthService, private router: Router, private localService: LocalService, private matriculaService: MatriculaService, private spinnerService: NgxSpinnerService, private service: CargaHorariaService, private activatedRoute: ActivatedRoute) {
    this.cargaHoraria = new CargaHoraria();
    this.cargaHoraria.asignatura = new Asignatura();
    this.cargaHoraria.paralelo = new Paralelo();
    this.cargaHoraria.asignatura.ciclo = new Ciclo();
    this.cargaHoraria.asignatura.ciclo.carrera = new Carrera();
    this.cargaHoraria.planificacion = new PlanificacionAcademica();
  }
  ngOnInit(): void {
    this.spinnerService.show();
    this.cargaHoraria = new CargaHoraria();
    this.activatedRoute.paramMap.subscribe(params => {
      const id: number = +params.get("id");

      if (id) {
        if (id != 0) {
          this.service.ver(id).subscribe(ch => {
            let entrada: boolean = false;
            this.matriculaService.listarMatriculaByPeriodoAndPareleloAndEstudiante(this.localService.getJsonValue('idP'), ch.paralelo.id, this.authService.usuario.index).subscribe(m => {
              m.forEach(mat => {
                mat.matriculas_asignaturas.forEach(a => {
                  if (ch.asignatura.id == a.asignatura.id) {
                    entrada = true;
                  }
                });

              });
              if (entrada == false) {
                Swal.fire("No Autorizado", "No tienes acceso a este recurso", "error");
                this.router.navigate(['/home']);
              } else {
                this.cargaHoraria = ch;
                if (this.cargaHoraria.planificacion == null) {
                  this.cargaHoraria.planificacion = new PlanificacionAcademica();
                }
              }
            });
          });
        } else {
          this.cargaHoraria.id = null;
        }
      } else {
        this.cargaHoraria.id = null;
      }
    });
    setTimeout(() => {
      this.spinnerService.hide();
    }, 800);
  }

}
