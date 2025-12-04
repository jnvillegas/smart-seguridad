// Types para el módulo de Tesorería - Clientes

export type TaxCategory =
  | 'sin_informar'
  | 'responsable_inscripto'
  | 'no_alcanzado'
  | 'monotributo'
  | 'exento'
  | 'consumidor_final';

export type DocumentType = 'DNI' | 'CUIT' | 'CUIL' | 'PASAPORTE';

export type PersonType = 'fisica' | 'juridica';

export type IIBBType = 
  | 'convenio_multilateral' 
  | 'sujeto_no_categorizado' 
  | 'contribuyente_local';

export type Gender = 'masculino' | 'femenino' | 'otro';

export interface Client {
  id: number;
  nombre: string;
  apellido: string;
  documento: string;
  tipo_documento: DocumentType;
  tipo_persona: PersonType;
  nombre_fantasia: string | null;
  codigo_interno: string;
  es_cliente: boolean;
  es_proveedor: boolean;
  categoria_fiscal: TaxCategory;
  persona_tipo_iibb: IIBBType | null;
  nro_ingresos_brutos: string | null;
  gran_contribuyente: boolean;
  domicilio: string;
  barrio: string | null;
  localidad: string;
  telefono: string | null;
  celular: string | null;
  email: string | null;
  contacto: string | null;
  fecha_nacimiento: string | null;
  edad: number | null;
  estado_civil: string | null;
  genero: Gender | null;
  cuenta_contable_id: number | null;
  observaciones: string | null;
  saldo: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  full_name: string;
}

export interface ClientTax {
  id: number;
  client_id: number;
  tax_id: number;
  fecha_actualizacion: string;
  alcuota: string;
  observaciones: string | null;
  created_at: string;
  updated_at: string;
  tax?: Tax;
}

export interface Tax {
  id: number;
  nombre: string;
  codigo: string;
  tipo: string | null;
  porcentaje_default: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClientCertificate {
  id: number;
  client_id: number;
  tipo_certificado: 'IVA' | 'IIBB';
  numero: string;
  fecha_vencimiento: string;
  alertado: boolean;
  created_at: string;
  updated_at: string;
  vigente: boolean;
  days_until_expiration: number;
}

export interface CurrentAccountMovement {
  id: number;
  client_id: number;
  fecha: string;
  concepto: string;
  detalle: string | null;
  debe: string;
  haber: string;
  saldo: string;
  documento_tipo: string | null;
  documento_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface ClientBalance {
  saldo_actual: number;
  total_debe: number;
  total_haber: number;
  ultimos_movimientos: CurrentAccountMovement[];
  cantidad_movimientos: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// ← AL FINAL DEL ARCHIVO, AGREGA:

export interface Receipt {
  id: number;
  client_id: number;
  numero_recibo: string;
  fecha_recibo: string;
  estado: 'pendiente' | 'pagado' | 'cancelado';
  subtotal: string;
  impuesto: string;
  total: string;
  referencia?: string;
  concepto?: string;
  observaciones?: string;
  metodo_pago: 'efectivo' | 'cheque' | 'transferencia' | 'tarjeta' | 'otro';
  created_at: string;
  updated_at: string;
  
  // Relaciones
  client?: Client;
  items?: ReceiptItem[];
}

export interface ReceiptItem {
  id?: number;
  receipt_id?: number;
  descripcion: string;
  cantidad: number;
  precio_unitario: string;
  subtotal: string;
}

export interface ReceiptFormData {
  client_id: number;
  fecha_recibo: string;
  estado: 'pendiente' | 'pagado' | 'cancelado';
  metodo_pago: 'efectivo' | 'cheque' | 'transferencia' | 'tarjeta' | 'otro';
  referencia?: string;
  concepto?: string;
  observaciones?: string;
  impuesto?: string;
  items: ReceiptItem[];
}

// ========================================
// BANCOS - Entidades Bancarias y Cuentas
// ========================================

export interface BankEntity {
  id: number;
  nombre: string;
  codigo_bcra: string | null;
  cuit: string | null;
  telefono: string | null;
  email: string | null;
  web: string | null;
  direccion: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
  
  // Relaciones
  accounts?: BankAccount[];
}

export type TipoCuenta = 'caja_ahorro' | 'cuenta_corriente' | 'cuenta_sueldo';
export type Moneda = 'ARS' | 'USD' | 'EUR';

export interface BankAccount {
  id: number;
  bank_entity_id: number;
  numero_cuenta: string;
  cbu: string;
  alias: string | null;
  tipo_cuenta: TipoCuenta;
  moneda: Moneda;
  saldo_inicial: string;
  saldo_actual: string;
  fecha_apertura: string | null;
  activa: boolean;
  observaciones: string | null;
  created_at: string;
  updated_at: string;
  
  // Relaciones
  bankEntity?: BankEntity;
  full_name?: string;
}

export interface BankEntityFormData {
  nombre: string;
  codigo_bcra?: string;
  cuit?: string;
  telefono?: string;
  email?: string;
  web?: string;
  direccion?: string;
  activo?: boolean;
}

export interface BankAccountFormData {
  bank_entity_id: number;
  numero_cuenta: string;
  cbu: string;
  alias?: string;
  tipo_cuenta: TipoCuenta;
  moneda: Moneda;
  saldo_inicial: string;
  fecha_apertura?: string;
  activa?: boolean;
  observaciones?: string;
}

// ==========================================
// ÓRDENES DE PAGO (PAYMENT ORDERS)
// ==========================================

export type PaymentOrderStatus = 'en_proceso' | 'cerrada' | 'anulada';

export type PaymentType = 
  | 'efectivo'
  | 'cheque_propio'
  | 'cheque_terceros'
  | 'transferencia'
  | 'tarjeta'
  | 'nota_credito'
  | 'nota_credito_interna'
  | 'compensacion';

export interface PaymentOrderValue {
  id?: number;
  payment_order_id?: number;
  payment_type: PaymentType;
  amount: number;
  currency: string;
  exchange_rate: number;
  check_number?: string;
  check_date?: string;
  bank_entity_id?: number;
  bank_account_id?: number;
  reference?: string;
  bank_entity?: BankEntity;
  bank_account?: BankAccount;
  payment_type_label?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentOrderWithholding {
  id?: number;
  payment_order_id?: number;
  tax_id: number;
  percentage: number;
  amount: number;
  aliquot: number;
  payment_commitment?: string;
  certificate_number?: string;
  tax?: Tax;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentOrder {
  id: number;
  supplier_id: number;
  user_id: number;
  branch_office_id?: number;
  cash_register_id?: number;
  cost_center_id?: number;
  number: string;
  date: string;
  concept: string;
  detail?: string;
  status: PaymentOrderStatus;
  is_advance: boolean;
  currency: string;
  exchange_rate: number;
  exchange_rate_date?: string;
  subtotal: number;
  total_withholdings: number;
  total: number;
  amount_paid: number;
  balance: number;
  supplier?: Client;
  user?: User;
  values?: PaymentOrderValue[];
  withholdings?: PaymentOrderWithholding[];
  status_label?: string;
  status_color?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface PaymentOrderFormData {
  supplier_id: number;
  branch_office_id?: number;
  cash_register_id?: number;
  cost_center_id?: number;
  date: string;
  concept: string;
  detail?: string;
  is_advance: boolean;
  currency: string;
  exchange_rate: number;
  exchange_rate_date?: string;
  values: PaymentOrderValue[];
  withholdings: PaymentOrderWithholding[];
}

// Tipo auxiliar para Tax (impuestos)
export interface Tax {
  id: number;
  name: string;
  code: string;
  type: 'retencion' | 'percepcion';
  percentage: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CashRegister {
  id: number;
  name: string;
}

export interface CostCenter {
  id: number;
  code: string;
  name: string;
}

export interface CashWithdrawalItem {
  id?: number;
  cash_withdrawal_id?: number;
  concept: string;
  observation?: string;
  amount: number;
  created_at?: string;
  updated_at?: string;
}

export type CashWithdrawalStatus = 'en_proceso' | 'cerrado' | 'anulado';

export interface CashWithdrawal {
  id: number;
  number: string;
  date: string;
  recipient: string;
  reason: string;
  detail?: string;
  cash_register_id?: number;
  cost_center_id?: number;
  currency: string;
  total: string | number;
  status: CashWithdrawalStatus;
  observations?: string;
  created_at: string;
  updated_at: string;

  items?: CashWithdrawalItem[];
  cash_register?: CashRegister;
  cost_center?: CostCenter;
  user?: {
    id: number;
    name: string;
  };
}

/**
 * Paginado genérico (lo usan index.tsx)
 */
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
// ===============================
// EGRESOS DE CAJA
// ===============================

export interface CashRegister {
  id: number;
  name: string;
}

export interface CostCenter {
  id: number;
  code: string;
  name: string;
}

export interface CashWithdrawalItem {
  id?: number;
  cash_withdrawal_id?: number;
  concept: string;
  observation?: string;
  amount: number;
  created_at?: string;
  updated_at?: string;
}

export type CashWithdrawalStatus = 'en_proceso' | 'cerrado' | 'anulado';

export interface CashWithdrawal {
  id: number;
  number: string;
  date: string;
  recipient: string;
  reason: string;
  detail?: string;
  cash_register_id?: number;
  cost_center_id?: number;
  currency: string;
  total: string | number;
  status: CashWithdrawalStatus;
  observations?: string;
  created_at: string;
  updated_at: string;

  items?: CashWithdrawalItem[];
  cash_register?: CashRegister;
  cost_center?: CostCenter;
  user?: {
    id: number;
    name: string;
  };
}

// Paginado genérico (lo usan varios index)
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
