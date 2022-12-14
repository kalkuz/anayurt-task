export interface Person {
  ID: number;
  FullName: string;
}

export interface Attendant extends Person {
  Department: string;
  NumProcesses: number;
}
