export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar?: string;
  status: 'active' | 'inactive';
  last_access?: string;
}

export interface PublicServant {
  id: string;
  nombres: string;
  primer_apellido: string;
  segundo_apellido?: string;
  curp: string;
  rfc_con_homoclave: string;
  genero: 'M' | 'F';
  institucion_dependencia: string;
  puesto_cargo: string;
  tipo_area: string;
  nivel_responsabilidad: string;
  tipo_procedimiento: string[];
  superior_inmediato?: string;
  observaciones?: string;
  fecha_ingreso: string;
  fecha_egreso?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface ProcurementContract {
  id: string;
  numero_procedimiento: string;
  titulo_contratacion: string;
  descripcion: string;
  tipo_contratacion: 'adquisiciones' | 'arrendamientos' | 'servicios' | 'obra_publica';
  tipo_procedimiento: 'invitacion_tres' | 'adjudicacion_directa' | 'licitacion_publica';
  forma_procedimiento: 'presencial' | 'electronica' | 'mixta';
  codigo_expediente: string;
  titulo_expediente: string;
  institucion_dependencia: string;
  unidad_compradora: string;
  unidad_responsable: string;
  moneda: string;
  precio_total: number;
  fecha_inicio: string;
  fecha_fin?: string;
  status: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled';
  servidores_publicos: string[];
  documentos: Document[];
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  filename_download: string;
  filename_disk: string;
  title: string;
  type: string;
  filesize: number;
  uploaded_by: string;
  uploaded_on: string;
  storage: string;
}

export interface DashboardStats {
  total_servidores: number;
  total_contrataciones: number;
  total_expedientes: number;
  contrataciones_activas: number;
  servidores_activos: number;
  expedientes_pendientes: number;
  monto_total_contrataciones: number;
  promedio_duracion_procedimientos: number;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  current?: boolean;
  children?: NavigationItem[];
}

export interface FilterOptions {
  search?: string;
  status?: string;
  institution?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}