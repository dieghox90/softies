import { Direccion } from './direccion';
import { CargaHoraria } from './carga-horaria';
import { Usuario } from './usuario';
import { Evaluacion } from './evaluacion';
import { Criterio } from './criterio';

export class Docente {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
    correo: string;
    titulo: string;
    estado: boolean;
    direccion: Direccion;
    cargas_horarias: CargaHoraria[];

    usuario: Usuario;

    // --- Esto no esta mapeado -- //
    evaluaciones: Evaluacion[];
    criterios: Criterio[];




}
