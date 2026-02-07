-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.approval_requests (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  workflow_id uuid,
  contract_id uuid,
  requester_id uuid,
  requested_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'pending'::text,
  data_payload jsonb,
  CONSTRAINT approval_requests_pkey PRIMARY KEY (id),
  CONSTRAINT approval_requests_workflow_id_fkey FOREIGN KEY (workflow_id) REFERENCES public.approval_workflows(id),
  CONSTRAINT approval_requests_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id),
  CONSTRAINT approval_requests_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.users(id)
);
CREATE TABLE public.approval_steps (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  request_id uuid,
  step_order integer NOT NULL,
  approver_role_id uuid,
  approver_id uuid,
  status text DEFAULT 'pending'::text,
  comment text,
  responded_at timestamp with time zone,
  CONSTRAINT approval_steps_pkey PRIMARY KEY (id),
  CONSTRAINT approval_steps_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.approval_requests(id),
  CONSTRAINT approval_steps_approver_role_id_fkey FOREIGN KEY (approver_role_id) REFERENCES public.roles(id),
  CONSTRAINT approval_steps_approver_id_fkey FOREIGN KEY (approver_id) REFERENCES public.users(id)
);
CREATE TABLE public.approval_workflows (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  action_type text NOT NULL UNIQUE,
  description text,
  CONSTRAINT approval_workflows_pkey PRIMARY KEY (id)
);
CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL,
  old_data jsonb,
  new_data jsonb,
  changed_by uuid,
  changed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT audit_logs_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES auth.users(id)
);
CREATE TABLE public.contract_attachments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  contract_id uuid,
  file_type text NOT NULL,
  file_url text NOT NULL,
  uploaded_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contract_attachments_pkey PRIMARY KEY (id),
  CONSTRAINT contract_attachments_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id)
);
CREATE TABLE public.contract_stage_history (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  contract_id uuid,
  stage_from USER-DEFINED,
  stage_to USER-DEFINED NOT NULL,
  transitioned_by uuid,
  transitioned_at timestamp with time zone DEFAULT now(),
  notes text,
  metadata jsonb,
  CONSTRAINT contract_stage_history_pkey PRIMARY KEY (id),
  CONSTRAINT contract_stage_history_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id),
  CONSTRAINT contract_stage_history_transitioned_by_fkey FOREIGN KEY (transitioned_by) REFERENCES public.users(id)
);
CREATE TABLE public.contract_terms (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  contract_id uuid,
  term_code text NOT NULL,
  term_content text NOT NULL,
  is_mandatory boolean DEFAULT true,
  CONSTRAINT contract_terms_pkey PRIMARY KEY (id),
  CONSTRAINT contract_terms_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id)
);
CREATE TABLE public.contract_valuations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  contract_id uuid,
  market_value numeric,
  proposed_loan_value numeric,
  final_loan_value numeric,
  valued_by uuid,
  valued_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contract_valuations_pkey PRIMARY KEY (id),
  CONSTRAINT contract_valuations_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id),
  CONSTRAINT contract_valuations_valued_by_fkey FOREIGN KEY (valued_by) REFERENCES public.users(id)
);
CREATE TABLE public.contracts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  contract_number text NOT NULL UNIQUE,
  customer_id uuid,
  vehicle_id uuid,
  stage USER-DEFINED DEFAULT 'reception'::contract_stage,
  loan_amount numeric,
  interest_rate numeric,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contracts_pkey PRIMARY KEY (id),
  CONSTRAINT contracts_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
  CONSTRAINT contracts_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id),
  CONSTRAINT contracts_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);
CREATE TABLE public.customer_documents (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  customer_id uuid,
  document_type text NOT NULL,
  file_url text NOT NULL,
  uploaded_at timestamp with time zone DEFAULT now(),
  CONSTRAINT customer_documents_pkey PRIMARY KEY (id),
  CONSTRAINT customer_documents_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id)
);
CREATE TABLE public.customers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  full_name text NOT NULL,
  identity_card text NOT NULL UNIQUE,
  phone_number text NOT NULL,
  address text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT customers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.disbursements (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  contract_id uuid,
  amount numeric NOT NULL,
  payment_method text NOT NULL,
  transaction_reference text,
  disbursed_by uuid,
  disbursed_at timestamp with time zone DEFAULT now(),
  approved_by uuid,
  CONSTRAINT disbursements_pkey PRIMARY KEY (id),
  CONSTRAINT disbursements_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id),
  CONSTRAINT disbursements_disbursed_by_fkey FOREIGN KEY (disbursed_by) REFERENCES public.users(id),
  CONSTRAINT disbursements_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id)
);
CREATE TABLE public.inspection_checklists (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  vehicle_type_id uuid,
  name text NOT NULL,
  description text,
  CONSTRAINT inspection_checklists_pkey PRIMARY KEY (id),
  CONSTRAINT inspection_checklists_vehicle_type_id_fkey FOREIGN KEY (vehicle_type_id) REFERENCES public.vehicle_types(id)
);
CREATE TABLE public.inspection_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  inspection_id uuid,
  item_name text NOT NULL,
  status text NOT NULL,
  notes text,
  CONSTRAINT inspection_items_pkey PRIMARY KEY (id),
  CONSTRAINT inspection_items_inspection_id_fkey FOREIGN KEY (inspection_id) REFERENCES public.inspections(id)
);
CREATE TABLE public.inspection_photos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  inspection_id uuid,
  photo_url text NOT NULL,
  description text,
  uploaded_at timestamp with time zone DEFAULT now(),
  CONSTRAINT inspection_photos_pkey PRIMARY KEY (id),
  CONSTRAINT inspection_photos_inspection_id_fkey FOREIGN KEY (inspection_id) REFERENCES public.inspections(id)
);
CREATE TABLE public.inspections (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  contract_id uuid,
  checklist_id uuid,
  inspector_id uuid,
  inspection_date timestamp with time zone DEFAULT now(),
  overall_condition text,
  notes text,
  CONSTRAINT inspections_pkey PRIMARY KEY (id),
  CONSTRAINT inspections_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id),
  CONSTRAINT inspections_checklist_id_fkey FOREIGN KEY (checklist_id) REFERENCES public.inspection_checklists(id),
  CONSTRAINT inspections_inspector_id_fkey FOREIGN KEY (inspector_id) REFERENCES public.users(id)
);
CREATE TABLE public.interest_calculations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  contract_id uuid,
  calculation_date date NOT NULL,
  principal_amount numeric NOT NULL,
  days_elapsed integer NOT NULL,
  interest_rate numeric NOT NULL,
  interest_amount numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT interest_calculations_pkey PRIMARY KEY (id),
  CONSTRAINT interest_calculations_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id)
);
CREATE TABLE public.interest_rate_configs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  min_amount numeric,
  max_amount numeric,
  rate_percentage numeric NOT NULL,
  effective_date date DEFAULT CURRENT_DATE,
  CONSTRAINT interest_rate_configs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.payment_allocations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  payment_id uuid,
  allocated_to text NOT NULL,
  amount numeric NOT NULL,
  CONSTRAINT payment_allocations_pkey PRIMARY KEY (id),
  CONSTRAINT payment_allocations_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  contract_id uuid,
  amount_paid numeric NOT NULL,
  payment_date timestamp with time zone DEFAULT now(),
  payment_method text NOT NULL,
  received_by uuid,
  notes text,
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id),
  CONSTRAINT payments_received_by_fkey FOREIGN KEY (received_by) REFERENCES public.users(id)
);
CREATE TABLE public.permissions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  code text NOT NULL UNIQUE,
  description text,
  CONSTRAINT permissions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.qr_codes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  contract_id uuid,
  qr_type USER-DEFINED NOT NULL,
  qr_data text NOT NULL,
  generated_by uuid,
  generated_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  is_active boolean DEFAULT true,
  CONSTRAINT qr_codes_pkey PRIMARY KEY (id),
  CONSTRAINT qr_codes_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id),
  CONSTRAINT qr_codes_generated_by_fkey FOREIGN KEY (generated_by) REFERENCES public.users(id)
);
CREATE TABLE public.qr_scans (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  qr_code_id uuid,
  scanned_by uuid,
  scanned_at timestamp with time zone DEFAULT now(),
  location_lat numeric,
  location_long numeric,
  is_successful boolean DEFAULT false,
  failure_reason text,
  CONSTRAINT qr_scans_pkey PRIMARY KEY (id),
  CONSTRAINT qr_scans_qr_code_id_fkey FOREIGN KEY (qr_code_id) REFERENCES public.qr_codes(id),
  CONSTRAINT qr_scans_scanned_by_fkey FOREIGN KEY (scanned_by) REFERENCES public.users(id)
);
CREATE TABLE public.role_permissions (
  role_id uuid NOT NULL,
  permission_id uuid NOT NULL,
  CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id),
  CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id),
  CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id)
);
CREATE TABLE public.roles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name USER-DEFINED NOT NULL UNIQUE,
  description text,
  CONSTRAINT roles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.stage_requirements (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  from_stage USER-DEFINED NOT NULL,
  to_stage USER-DEFINED NOT NULL,
  requirement_code text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  CONSTRAINT stage_requirements_pkey PRIMARY KEY (id)
);
CREATE TABLE public.storage_locations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text,
  capacity integer,
  type text,
  CONSTRAINT storage_locations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.storage_slots (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  location_id uuid,
  slot_code text NOT NULL,
  is_occupied boolean DEFAULT false,
  vehicle_id uuid,
  CONSTRAINT storage_slots_pkey PRIMARY KEY (id),
  CONSTRAINT storage_slots_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.storage_locations(id),
  CONSTRAINT storage_slots_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);
CREATE TABLE public.system_settings (
  key text NOT NULL,
  value text NOT NULL,
  description text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT system_settings_pkey PRIMARY KEY (key)
);
CREATE TABLE public.user_roles (
  user_id uuid NOT NULL,
  role_id uuid NOT NULL,
  assigned_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id),
  CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  full_name text,
  phone_number text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  email text,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.vehicle_brands (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  vehicle_type_id uuid,
  CONSTRAINT vehicle_brands_pkey PRIMARY KEY (id),
  CONSTRAINT vehicle_brands_vehicle_type_id_fkey FOREIGN KEY (vehicle_type_id) REFERENCES public.vehicle_types(id)
);
CREATE TABLE public.vehicle_documents (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  vehicle_id uuid,
  document_type text NOT NULL,
  file_url text NOT NULL,
  uploaded_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vehicle_documents_pkey PRIMARY KEY (id),
  CONSTRAINT vehicle_documents_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);
CREATE TABLE public.vehicle_models (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  brand_id uuid,
  name text NOT NULL,
  year integer,
  CONSTRAINT vehicle_models_pkey PRIMARY KEY (id),
  CONSTRAINT vehicle_models_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.vehicle_brands(id)
);
CREATE TABLE public.vehicle_storage_history (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  vehicle_id uuid,
  location_id uuid,
  slot_id uuid,
  action text NOT NULL,
  performed_by uuid,
  performed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vehicle_storage_history_pkey PRIMARY KEY (id),
  CONSTRAINT vehicle_storage_history_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id),
  CONSTRAINT vehicle_storage_history_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.storage_locations(id),
  CONSTRAINT vehicle_storage_history_slot_id_fkey FOREIGN KEY (slot_id) REFERENCES public.storage_slots(id),
  CONSTRAINT vehicle_storage_history_performed_by_fkey FOREIGN KEY (performed_by) REFERENCES public.users(id)
);
CREATE TABLE public.vehicle_types (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  CONSTRAINT vehicle_types_pkey PRIMARY KEY (id)
);
CREATE TABLE public.vehicles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  owner_id uuid,
  model_id uuid,
  license_plate text NOT NULL UNIQUE,
  vin_number text,
  engine_number text,
  color text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vehicles_pkey PRIMARY KEY (id),
  CONSTRAINT vehicles_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.customers(id),
  CONSTRAINT vehicles_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.vehicle_models(id)
);