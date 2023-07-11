import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, FilterOperator, PaginateQuery } from 'nestjs-paginate';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

const key = 'roles';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    await this.roleRepository.save(role);
    await this.cacheManager.del(key);
    return this.findOne(role.id);
  }

  async findAll(query: PaginateQuery) {
    const cache = await this.cacheManager.get(key);
    if (cache) return cache;
    const item = await paginate(query, this.roleRepository, {
      searchableColumns: ['name'],
      sortableColumns: ['name'],
      filterableColumns: {
        id: [FilterOperator.EQ],
      },
    });
    await this.cacheManager.set(key, item);
    return item;
  }

  findOne(id: string) {
    return this.roleRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    await this.roleRepository.update(id, updateRoleDto);
    await this.cacheManager.del(key);
    return this.findOne(id);
  }

  async remove(id: string) {
    const role = await this.findOne(id);
    await this.cacheManager.del(key);
    return this.roleRepository.softRemove(role);
  }
}
