export class Restaurant {
  id!: string;
  logo: string;
  title: string;
  description: string;
  rating!: number;
  telephone_contact: string;
  seat: number;
  address: string;
  city: string;
  availability!: string;

  constructor(
    logo: string,
    title: string,
    description: string,
    telephone_contact: string,
    seat: number,
    addres: string,
    city: string
  ) {
    this.logo = logo;
    this.title = title;
    this.description = description;
    this.telephone_contact = telephone_contact;
    this.seat = seat;
    this.address = addres;
    this.city = city;
  }
}
