import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository, UserWithRole } from './users.repository';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private repository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.repository.create({
      ...createUserDto,
      password: hashedPassword,
      role: { connect: { id: createUserDto.roleId } },
    });
  }

  async findAll(): Promise<User[]> {
    return this.repository.findAll({});
  }

  async findOne(id: string): Promise<UserWithRole> {
    const user = await this.repository.findOne({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<UserWithRole | null> {
    return this.repository.findOne({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return this.repository.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string): Promise<User> {
    return this.repository.remove({ id });
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<User> {
    return this.repository.update({
      where: { id },
      data: { refreshToken },
    });
  }
}
