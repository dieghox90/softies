import { Matricula } from './matricula';
import { Distributivo } from './distributivo';

export class Periodo {
    id: number;
    periodo_academico: string;
    fecha_inicio: string;
    fecha_fin: string;
    create_at: string;
    matriculas: Matricula[];
    distributivo: Distributivo;
    total_matriculas: number;

}
