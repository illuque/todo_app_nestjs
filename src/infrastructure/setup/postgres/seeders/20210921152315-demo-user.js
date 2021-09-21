'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const salt = bcrypt.genSaltSync();

    return queryInterface.bulkInsert('Users', [
      {
        id: 'iago',
        name: 'Iago',
        password: bcrypt.hashSync('test_pass_iago', salt),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'alejandro',
        name: 'Alejandro',
        password: bcrypt.hashSync('test_pass_alejandro', salt),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
