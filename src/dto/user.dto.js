import { TimestampsEntity } from "./common.dto.js";

export const UserResponseListDTO = (usersArray) => {
  return usersArray.map((user) => new UserResponseDTO(user));
};

export class UserDTO extends TimestampsEntity {
  constructor(user) {
    super(user);
    this.id = user._id || user.id || null;
    this.first_name = user.first_name || null;
    this.last_name = user.last_name || null;
    this.email = user.email || null;
    this.password = user.password || null;
    this.role = user.role || null;
    this.last_connection = user.last_connection || null;
    this.pets = user.pets || [];
  }
}

export class UserResponseDTO extends UserDTO {
  constructor(user) {
    super(user);
    delete this.password; // Exclude password from response
  }
}

export class UserCreateDTO extends UserDTO {
  constructor(user) {
    super(user);
    delete this.id;
  }
}

export class UserUpdateDTO {
  constructor(user) {
    if (user.id !== undefined || user._id !== undefined) this.id = user._id || user.id || null;
    if (user.first_name !== undefined) this.first_name = user.first_name;
    if (user.last_name !== undefined) this.last_name = user.last_name;
    if (user.email !== undefined) this.email = user.email;
    if (user.password !== undefined) this.password = user.password;
    if (user.role !== undefined) this.role = user.role;
    if (user.last_connection !== undefined) this.last_connection = user.last_connection;
    if (user.pets !== undefined) this.pets = user.pets;
  }
}
