import { fa, faker } from "@faker-js/faker";
import { hashPassword } from "../utils/hash.js";

class MockUser {
  constructor() {
    this.first_name = faker.person.firstName();
    this.last_name = faker.person.lastName();
    this.email = this.#getRandomEmail();
    // this.password = hashPassword("password123");
    this.password = "password123";
    this.role = faker.helpers.arrayElement(["user", "admin"]);
    this.pets = [];
  }

  get() {
    return {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      password: this.password,
      role: this.role,
      pets: this.pets,
    };
  }

  #getRandomEmail() {
    const firstInitial = this.first_name.charAt(0).toLowerCase();
    const lastName = this.last_name.toLowerCase();
    const randomNumber = Math.floor(Math.random() * 30) + 70;
    return `${firstInitial}${lastName}${randomNumber}@example.com`;
  }

}

export const generateUsers = (count = 10) => {
  const users = [];
  if (count > 1000) count = 1000; // Limit the maximum number of users to 1000
  for (let i = 0; i < count; i++) {
    const user = new MockUser();
    users.push(user.get());
  }
  return users;
};

