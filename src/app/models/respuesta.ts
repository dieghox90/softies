import { Pregunta } from './pregunta';

export class Respuesta {
    id: number;
    texto: string;
    estado: boolean;
    correcto: boolean;
    pregunta: Pregunta;
    evaluador_id: number;
    evaluado_id: number;
    criterio_id: number;
    subcriterio_id: number;
    evaluacion_id: number;
    asignatura_id: number;
    paralelo_id: number;
}
