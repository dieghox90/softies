import { Component, OnInit } from '@angular/core';
import { PeriodoService } from 'src/app/services/periodo.service';
import { Periodo } from 'src/app/models/periodo';
import { MatriculaService } from 'src/app/services/matricula.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-periodos',
  templateUrl: './periodos.component.html',
  styleUrls: ['./periodos.component.css']
})
export class PeriodosComponent implements OnInit {

  titulo: string = "PERIODOS LECTIVOS";
  periodos: Periodo[];
  constructor(private spinnerService: NgxSpinnerService, private service: PeriodoService, private matriculaService: MatriculaService) { }

  ngOnInit() {
    this.spinnerService.show();
    this.service.listarShort().subscribe(periodos => {
      this.periodos = periodos;
      this.periodos.forEach(p => {
        this.matriculaService.totalMatriculados(p.id).subscribe(total => {
          p.total_matriculas = total;
        })
      });
      this.spinnerService.hide();
    });

  }

}
