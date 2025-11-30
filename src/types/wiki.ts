export interface WikiTopicRel {
  topico: string;
  id: number;
}

export interface WikiConcept {
  topico: number;       
  conceito: string;
  autor_id: string;
  status: "approved" | "pending" | "rejected";     
  definicao: string;    
  id: number;        
  created_at: string;   
  updated_at: string;
  topico_rel: WikiTopicRel;
}