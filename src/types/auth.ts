export enum SexoEnum {
  MASCULINO = "masc",
  FEMININO = "fem",
}

export enum NivelTeaEnum {
  NIVEL_1 = "nivel_1",
  NIVEL_2 = "nivel_2",
  NIVEL_3 = "nivel_3",
}

export type PacientePost = {
  nome_completo: string;
  data_de_nascimento: string;
  cpf: string;
  sexo: SexoEnum;
  nivel_tea: NivelTeaEnum;
};

export type TerapeutaPost = {
  nome_completo: string;
  documento?: string;
};

export type User = {
  id: string;              // uuid
  username: string;
  email: string;
  hashed_password: string;
  is_patient: boolean;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  created_at: string;      // or Date if you parse it before storing
  updated_at: string;      // same here
};