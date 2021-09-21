import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class RepositoryDB<ID, Entity> {
  abstract create(entity: Entity): Promise<Entity>;

  abstract findOne(id: ID): Promise<Entity>;
}
