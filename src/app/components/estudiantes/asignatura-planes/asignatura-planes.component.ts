import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { PlanSemanalService } from 'src/app/services/plan-semanal.service';
import { CargaHorariaService } from 'src/app/services/carga-horaria.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CargaHoraria } from 'src/app/models/carga-horaria';
import { PlanSemanal } from 'src/app/models/plan-semanal';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { LocalService } from 'src/app/services/local.service';
import { MatriculaService } from 'src/app/services/matricula.service';

@Component({
  selector: 'app-asignatura-planes',
  templateUrl: './asignatura-planes.component.html',
  styleUrls: ['./asignatura-planes.component.css']
})
export class AsignaturaPlanesComponent implements OnInit {

  cargaHoraria: CargaHoraria;
  progreso: number = 0;
  tipoArchivo: string = "";
  planSemanal: PlanSemanal;


  constructor(public authService: AuthService, private router: Router,
    private localService: LocalService,
    private matriculaService: MatriculaService,
    private spinnerService: NgxSpinnerService,
    private service: CargaHorariaService, private activatedRoute: ActivatedRoute) { }

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
                if (this.cargaHoraria.planificacion) {
                  this.cargaHoraria.planificacion.planes_semanales.sort((a, b) => a.numero_semana - b.numero_semana);
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
