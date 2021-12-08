export interface Course {
  _id?: string;
  code: string;
  name: string;
}

export interface Technology {
  _id: string;
  name: string;
  description: string;
  difficulty: number;
  courses: Course[];
}
