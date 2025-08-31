export interface Vacancy {
  vacancy_id: number;
  event_name: string;
  start_date: string;
  payment: string;
  job_type_name: string;
  specific_job_type?: string | null;
  image_url?: string | null;
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