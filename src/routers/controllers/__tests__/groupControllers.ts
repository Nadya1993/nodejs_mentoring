import request from 'supertest';
import express from 'express';

import * as GroupServiceMock from '../../../services/__mocks__/GroupServiceMock';
import { groupRoutes } from '../..';
import { GROUP_ID_NOT_PASSED, GROUP_NOT_FOUND } from '../../../locale';

jest.mock('../../../services/GroupService', () => GroupServiceMock);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', groupRoutes);

describe('GET /', () => {
  it('should return list of groups', done => {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject(GroupServiceMock.groupList);
        done();
      })
  })
})

describe('DELETE /', () => {
  it('should return 200 if group_id passed', done => {
    request(app)
      .delete('/')
      .send({ delete: 'group_id' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      })
  })

  it('should return 400 if group_id is not passed', done => {
    request(app)
      .delete('/')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(GROUP_ID_NOT_PASSED);
        done();
      })
  })

  it('should return 404 if group_id was not found', done => {
    request(app)
      .delete('/')
      .send({ delete: 'invalid_id' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(GROUP_NOT_FOUND);
        done();
      })
  })
})

describe('GET /search/:id', () => {
  it('should find group by id', done => {
    request(app)
      .get('/search/group_id')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject(GroupServiceMock.groupList[0]);
        done();
      })
  })

  it('should not find group by invalid id', done => {
    request(app)
      .get('/search/invalid_id')
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(GROUP_NOT_FOUND);
        done();
      })
  })
})

describe('PUT /create', () => {
  it('should return 400 if name is not passed', done => {
    request(app)
      .put('/create')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject([{
          path: 'name',
          message: '"name" is required',
        }]);
        done();
      })
  })

  it('should return 400 if permission is not passed', done => {
    request(app)
      .put('/create')
      .send({ name: 'test' })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject([{
          path: 'permission',
          message: '"permission" is required',
        }]);
        done();
      })
  })

  it('should return 400 if permission is not array', done => {
    request(app)
      .put('/create')
      .send({ name: 'test', permission: 'qqq' })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject([{
          path: 'permission',
          message: '"permission" must be an array',
        }]);
        done();
      })
  })

  it('should return 400 if permission is not array of strings', done => {
    request(app)
      .put('/create')
      .send({ name: 'test', permission: [1, 2] })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject([{
          path: 'permission',
          message: '"permission[0]" must be a string',
        }]);
        done();
      })
  })

  it('should return 200', done => {
    request(app)
      .put('/create')
      .send({ name: 'test', permission: ['READ'] })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      })
  })
})

describe('POST /update/:id', () => {
  it('should return 200', done => {
    request(app)
      .post('/update/group_id')
      .send({ name: 'test', permission: ['READ'] })
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      })
  })
})
