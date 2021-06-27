import express from 'express';
import { GroupServiceInstance } from '../../services/GroupService';

export const findAllGroups = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.json(await GroupServiceInstance.getGroups());
  res.locals.method = GroupServiceInstance.getGroups.name;
  next();
}

export const deleteGroupById = async (req: express.Request, res: express.Response) => {
  const groupId = req.body.delete;
  const isGroupDeleted = await GroupServiceInstance.deleteGroup(groupId);

  if (isGroupDeleted) {
    res.sendStatus(200);
    res.locals.method = GroupServiceInstance.deleteGroup.name;
    res.locals.params = { groupId };
  } else {
    res.status(404).json('Group was not found');
  }
}

export const findGroupById = async (req: express.Request, res: express.Response, next: express.NextFunction, groupId: string) => {
  const requestedGroup = await GroupServiceInstance.findGroup(groupId);
  const notFound = groupId && !requestedGroup;

  if (notFound) {
    res.status(404).json('Group was not found');
    return;
  }

  res.locals.group = requestedGroup;
  next();
}

export const provideFoundGroup = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const group = res.locals.group;
  res.json(group);
  res.locals.method = GroupServiceInstance.findGroup.name;
  res.locals.params = { userId: group.dataValues.user_id };
  next();
}

export const addGroup = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { name, permission } = req.body;

  await GroupServiceInstance.addGroup(String(name), permission);
  res.sendStatus(200);
  res.locals.method = GroupServiceInstance.addGroup.name;
  res.locals.params = { name, permission };
  next();
}

export const updateGroup = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { name, permission } = req.body;
  const { id } = req.params;
  await GroupServiceInstance.updateGroup({
    groupId: id,
    name,
    permission,
  });
  res.sendStatus(200);
  res.locals.method = GroupServiceInstance.updateGroup.name;
  res.locals.params = { name, permission };
  next();
}
