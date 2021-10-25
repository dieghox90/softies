import { Evaluacion } from './evaluacion';
import { Evaluado } from './evaluado';

export class Evaluador {

    id: number;
    id_evaluador: number;
    nombre_evaluador: string;
    create_at: string;
    evaluados: Evaluado[];
    evaluacion: Evaluacion;


}
