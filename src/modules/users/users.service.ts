import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private repository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.repository.create({
      ...createUserDto,
      password: hashedPassword,
      role: { connect: { id: createUserDto.roleId } },
    });
  }

  async findAll() {
    return this.repository.findAll({});
  }

  async findOne(id: string) {
    const user = await this.repository.findOne({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.repository.findOne({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return this.repository.update({
      where: { id },
      data: updateUserDto as any,
    });
  }

  async remove(id: string) {
    return this.repository.remove({ id });
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    return this.repository.update({
      where: { id },
      data: { refreshToken },
    });
  }
}
