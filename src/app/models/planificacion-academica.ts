import { PlanSemanal } from './plan-semanal';

export class PlanificacionAcademica {

    id: number;
    guia: string;
    ruta_guia: string;
    silabo: string;
    ruta_silabo: string;
    periodo_id: number;
    asignatura_id: number;
    ciclo_id: number;
    nombre_asignatura: string;
    nombre_paralelo: string;
    create_at: string;
    planes_semanales: PlanSemanal[];
}
