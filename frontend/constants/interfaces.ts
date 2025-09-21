export type Id = number | string;
export interface IdLabel<V extends Id = number> { id: V; label: string; }
export interface Paginated<T> { count: number; next?: string | null; previous?: string | null; results: T[]; }

export interface Vacancy {
  vacancy_id: number;
  event_name: string;
  start_date: string;
  payment: string;
  job_type_name: string;
  specific_job_type?: string | null;
  event_image_public_id?: string | null;
  event_image_url?: string | null;
  quantity?: number;            
  quantity_offers?: number;    
  quantity_shifts?: number;
  shift_ids?: number[];
}

export interface VacancySummary {
  id: number;
  roleName: string;
  shiftIds: number[];
  quantity?: number;
  quantityOffers?: number;
}

export interface Candidate {
  id: number;            
  employeeId: number;
  fullName: string;
  avatarUrl?: string | null;
  createdAt: string;
  shiftId: number;
}

export interface Shift {
  id: string;
  dia: string;
  turnos: {
    id: number;
    horario: string;
    paga: string;
  }[];
}

export interface Job {
  title: string;
  description: string;
  role: string;
  date: string;
  time: string;
  requirements: string[];
  salary: string;
  deadline: string;
  mapImage: string;
  rating: number;
  event_image_url: string;
  event_image_public_id: string;
}

export interface Organizer {
  name: string;
  reviews: number;
  rating: number;
  jexTime: string;
}

export interface Requirement {
  description: string;
}

export type Offer = {
  id: number;
  salary: string;
  role: string;
  date: string;
  startTime: string;
  endTime: string;
  company: string;
  eventImage: any;
  expirationDate: string;
  expirationTime: string;
  location: string;
  requirements: string[];
  comments: string;
};