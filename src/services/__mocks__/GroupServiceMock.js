const groupList = [
  {
    dataValues: {
      name: 'ADMIN',
      permission: '{READ,WRITE,DELETE,SHARE,UPLOAD_FILES}',
      group_id: 'group_id',
      users: [],
    },
  },
  {
    dataValues: {
      name: 'test',
      permission: "[ 'READ' ]",
      group_id: '2',
      users: [],
    },
  },
];

module.exports = {
  groupList,
  GroupServiceInstance: {
    getGroups: jest.fn(() => groupList),
    deleteGroup: jest.fn((groupId) => groupId === 'group_id'),
    findGroup: jest.fn((groupId) => {
      if (groupId !== 'group_id') return;
      return groupList[0];
    }),
    addGroup: jest.fn(),
    updateGroup: jest.fn(),
  },
};
