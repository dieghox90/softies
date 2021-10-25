import { Docente } from './docente';
import { Paralelo } from './paralelo';
import { Distributivo } from './distributivo';
import { Asignatura } from './asignatura';
import { Ciclo } from './ciclo';
import { PlanificacionAcademica } from './planificacion-academica';

export class CargaHoraria {

    id: number;
    docente: Docente;
    paralelo: Paralelo;
    distributivo: Distributivo;
    asignatura: Asignatura;
    planificacion: PlanificacionAcademica;


}
