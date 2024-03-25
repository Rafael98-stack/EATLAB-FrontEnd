export class Reservation {
  id!: string;
  unique_code!: number;
  date: Date;
  persons: number;
  constructor(date: Date, persons: number) {
    this.date = date;
    this.persons = persons;
  }
}
