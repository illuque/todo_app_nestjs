import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserDB } from '../../../infrastructure/repositories/user/UserDB';
import { TodoDB } from '../../../infrastructure/repositories/todo/TodoDB';
import { Sequelize } from 'sequelize-typescript';
import * as supertest from 'supertest';
import { AppModule } from '../../../ioc/AppModule';
import * as bcrypt from 'bcrypt';
import { Reflector } from '@nestjs/core';
import { AuthGuardWithExceptions } from '../../../infrastructure/auth/AuthGuard';

let app: INestApplication;

let user1: UserDB;
let user2: UserDB;
let todoFromUser1: TodoDB;
let todoFromUser2: TodoDB;

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [
      AppModule,
      // Use the e2e_test database to run the tests
      SequelizeModule.forRoot({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'test',
        password: 'test',
        database: 'todo_app_test',
        models: [UserDB, TodoDB],
        synchronize: true,
        autoLoadModels: true,
      }),
    ],
  }).compile();

  app = module.createNestApplication();

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuardWithExceptions(reflector));

  await app.init();

  // mock bcrypt.compareSync to bypass password encryption
  jest.mock('bcrypt');
  (bcrypt.compareSync as jest.Mock) = jest.fn().mockReturnValue(true);

  await createUser1();
  await createUser2();

  await createTodoUser1();
  await createTodoUser2();
});

afterEach(async () => {
  await UserDB.destroy({ where: Sequelize.literal('true') });
  await TodoDB.destroy({ where: Sequelize.literal('true') });
});

afterAll(async () => {
  await app.close();
});

describe('GET /todos', () => {
  it('should return Todos owned by user', async () => {
    //
    // User 1
    //
    const bodyLoginUser1 = await loginUser(user1.id, user1.password);
    const bodyTodosUser1 = await getUserTodos(bodyLoginUser1.access_token);

    expect(bodyTodosUser1).toEqual([
      {
        id: todoFromUser1.id,
        name: todoFromUser1.name,
        date: todoFromUser1.date.toJSON(),
        picture: todoFromUser1.picture,
        subTasks: todoFromUser1.subTasks,
      },
    ]);

    //
    // User 2
    //
    const bodyLoginUser2 = await loginUser(user2.id, user2.password);
    const bodyTodosUser2 = await getUserTodos(bodyLoginUser2.access_token);

    expect(bodyTodosUser2).toEqual([
      {
        id: todoFromUser2.id,
        name: todoFromUser2.name,
        date: todoFromUser2.date.toJSON(),
        picture: todoFromUser2.picture,
        subTasks: todoFromUser2.subTasks,
      },
    ]);
  });
});

async function createUser1() {
  user1 = new UserDB();
  user1.id = 'iago';
  user1.name = 'iago';
  user1.password = 'pwd_iago';
  await user1.save();
}

async function createUser2() {
  user2 = new UserDB();
  user2.id = 'leti';
  user2.name = 'leti';
  user2.password = 'pwd_leti';
  await user2.save();
}

async function createTodoUser1() {
  todoFromUser1 = new TodoDB();
  todoFromUser1.name = `this is user1's`;
  todoFromUser1.date = new Date('2021-09-24');
  todoFromUser1.picture = null;
  todoFromUser1.subTasks = [];
  todoFromUser1.createdBy = user1.id;
  await todoFromUser1.save();
}

async function createTodoUser2() {
  todoFromUser2 = new TodoDB();
  todoFromUser2.name = `this is user2's`;
  todoFromUser2.date = new Date('2021-09-23');
  todoFromUser2.picture = null;
  todoFromUser2.subTasks = [];
  todoFromUser2.createdBy = user2.id;
  await todoFromUser2.save();
}

async function loginUser(userId, password) {
  const { body: bodyLogin } = await supertest
    .agent(app.getHttpServer())
    .post('/login')
    .set('Accept', 'application/json')
    .send({
      userId: userId,
      password: password,
    })
    .expect(201);

  expect(bodyLogin).toEqual({ access_token: expect.any(String) });
  return bodyLogin;
}

async function getUserTodos(token) {
  const { body: bodyTodos } = await supertest
    .agent(app.getHttpServer())
    .get('/todos')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send({})
    .expect(200);
  return bodyTodos;
}
