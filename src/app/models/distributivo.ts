import { DocumentoDistributivo } from './documento-distributivo';
import { CargaHoraria } from './carga-horaria';
import { Periodo } from './periodo';

export class Distributivo {

    id: number;
    create_at: string;
    estado: boolean;
    cargas_horarias: CargaHoraria[];
    periodo: Periodo;

    documentos_distributivos: DocumentoDistributivo;

}
