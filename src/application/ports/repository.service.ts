import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class RepositoryDB<ID, Entity> {
  // TODO:I make base? abstract and not interface
  abstract create(entity: Entity): Promise<Entity>;

  abstract findOne(id: ID): Promise<Entity>;
}
