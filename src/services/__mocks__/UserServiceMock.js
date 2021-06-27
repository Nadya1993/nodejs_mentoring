const userList = [{
  dataValues: {
    login: 'login1',
    password: 'password1',
    age: 27,
    user_id: '1',
  },
},
{
  dataValues: {
    login: 'login2',
    password: 'password2',
    age: 29,
    user_id: '2',
  },
}];

module.exports = {
  userList,
  UserServiceInstance: {
    getUsers: jest.fn(() => userList),
    deleteUser: jest.fn((userId) => userId === 'user_id'),
    findUser: jest.fn((userId) => {
      if (userId !== '1') return;
      return userList[0];
    }),
    getSuggestionList: jest.fn(() => userList),
    addUser: jest.fn(),
    updateUser: jest.fn(),
  },
};
