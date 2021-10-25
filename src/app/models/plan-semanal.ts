import { PlanificacionAcademica } from './planificacion-academica';

export class PlanSemanal {
    id: number;
    numero_semana: number;
    plan: string;
    fecha_inicio: string;
    fecha_fin: string;
    create_at: string;
    planificacion: PlanificacionAcademica;
    fecha_modificacion: string;
    ruta: string;
    observaciones: string;
    creado_manual: boolean;
    estado: boolean;
}
