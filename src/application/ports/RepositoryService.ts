import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class RepositoryDB<ID, Entity> {
  // TODO:I make base? abstract and not interface
  // TODO:I check if possible to remove it
  abstract create(entity: Entity): Promise<Entity>;

  abstract findOne(id: ID): Promise<Entity>;
}
