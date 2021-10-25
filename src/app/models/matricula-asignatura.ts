import { Asignatura } from './asignatura';
import { Matricula } from './matricula';

export class MatriculaAsignatura {
    id: number;
    asignatura: Asignatura;
    matricula: Matricula;
    estado: boolean;

}
