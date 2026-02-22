export interface Servicio {
    id: number;
    codigo: string;
    nombre: string;
    montoBase: number;
    unidadBase: string;
    montoVariable: number;
    unidadVariable: string;
    montoVariable2: number;
    unidadVariable2: string;
    montoPorcentaje: number;
    porcentaje: number;
    observaciones: string;
    esTitulo: boolean;
}

export interface Categoria {
    id: number;
    tipo: string;
    servicios: Servicio[];
    otros?: string;
}

export interface Nota {
    id: number;
    contenido: string;
    orden: number;
}
