import { Periodo } from './periodo';
import { Paralelo } from './paralelo';
import { Estudiante } from './estudiante';
import { MatriculaAsignatura } from './matricula-asignatura';

export class Matricula {
    id: number;
    numero: string;
    create_at: string;
    periodo_lectivo: Periodo;
    paralelo: Paralelo;
    estudiante: Estudiante;
    matriculas_asignaturas: MatriculaAsignatura[];
    numero_matricula: number;
    perdida_gratuidad: boolean;
    tipo_matricula: string;
}
