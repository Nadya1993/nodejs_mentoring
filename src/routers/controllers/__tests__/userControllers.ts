import request from 'supertest';
import express from 'express';

import * as UserServiceMock from '../../../services/__mocks__/UserServiceMock';
import { userRoutes } from '../..';
import { LIMIT_NOT_PASSED, LOGIN_SUBSTRING_NOT_PASSED, USER_ID_NOT_PASSED, USER_NOT_FOUND } from '../../../locale';

jest.mock('../../../services/UserService', () => UserServiceMock);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', userRoutes);

describe('GET /', () => {
  it('should return list of users', done => {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject(UserServiceMock.userList);
        done();
      })
  })
})

describe('DELETE /', () => {
  it('should return 200 if user_id passed', done => {
    request(app)
      .delete('/')
      .send({ delete: 'user_id' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      })
  })

  it('should return 400 if user_id is not passed', done => {
    request(app)
      .delete('/')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(USER_ID_NOT_PASSED);
        done();
      })
  })

  it('should return 404 if user_id was not found', done => {
    request(app)
      .delete('/')
      .send({ delete: 'invalid_id' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(USER_NOT_FOUND);
        done();
      })
  })
})

describe('GET /search/:id', () => {
  it('should find user by id', done => {
    request(app)
      .get('/search/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject(UserServiceMock.userList[0]);
        done();
      })
  })

  it('should not find user by invalid id', done => {
    request(app)
      .get('/search/invalid_id')
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(USER_NOT_FOUND);
        done();
      })
  })
})

describe('GET /getSuggestionList', () => {
  it('should return 400 if limit is not passed', done => {
    request(app)
      .get('/getSuggestionList')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(LIMIT_NOT_PASSED);
        done();
      })
  })

  it('should return 400 if login substring is not passed', done => {
    request(app)
      .get('/getSuggestionList')
      .query({ limit: 10 })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(LOGIN_SUBSTRING_NOT_PASSED);
        done();
      })
  })

  it('should return suggestion list of users', done => {
    request(app)
      .get('/getSuggestionList')
      .query({ limit: 10, loginSubstring: 'test' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject(UserServiceMock.userList);
        done();
      })
  })
})

describe('PUT /create', () => {
  it('should return 400 if login is not passed', done => {
    request(app)
      .put('/create')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject([{
          path: 'login',
          message: '"login" is required',
        }]);
        done();
      })
  })

  it('should return 400 if password is not passed', done => {
    request(app)
      .put('/create')
      .send({ login: 'test' })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject([{
          path: 'password',
          message: '"password" is required',
        }]);
        done();
      })
  })

  it('should return 400 if password has not a-z', done => {
    request(app)
      .put('/create')
      .send({ login: 'test', password: '111' })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject([{
          path: 'password',
          message: '"password" with value "111" fails to match the required pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{3,10}$/',
        }]);
        done();
      })
  })

  it('should return 400 if password has not A-Z', done => {
    request(app)
      .put('/create')
      .send({ login: 'test', password: 'aaa' })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject([{
          path: 'password',
          message: '"password" with value "aaa" fails to match the required pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{3,10}$/',
        }]);
        done();
      })
  })

  it('should return 400 if password has not 0-9', done => {
    request(app)
      .put('/create')
      .send({ login: 'test', password: 'aaaAAA' })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject([{
          path: 'password',
          message: '"password" with value "aaaAAA" fails to match the required pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{3,10}$/',
        }]);
        done();
      })
  })

  it('should return 400 if password shorter than 3', done => {
    request(app)
      .put('/create')
      .send({ login: 'test', password: 'q1' })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject([{
          path: 'password',
          message: '"password" with value "q1" fails to match the required pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{3,10}$/',
        }]);
        done();
      })
  })

  it('should return 400 if password longer than 10', done => {
    request(app)
      .put('/create')
      .send({ login: 'test', password: 'q1Q123456789' })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject([{
          path: 'password',
          message: '"password" with value "q1Q123456789" fails to match the required pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{3,10}$/',
        }]);
        done();
      })
  })

  it('should return 400 if age is not passed', done => {
    request(app)
      .put('/create')
      .send({ login: 'test', password: 'q1Q12345' })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject([{
          path: 'age',
          message: '"age" is required',
        }]);
        done();
      })
  })

  it('should return 400 if age less than 4', done => {
    request(app)
      .put('/create')
      .send({ login: 'test', password: 'q1Q12345', age: 3 })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject([{
          path: 'age',
          message: '"age" must be greater than or equal to 4',
        }]);
        done();
      })
  })

  it('should return 400 if age bigger than 130', done => {
    request(app)
      .put('/create')
      .send({ login: 'test', password: 'q1Q12345', age: 131 })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject([{
          path: 'age',
          message: '"age" must be less than or equal to 130',
        }]);
        done();
      })
  })

  it('should return 400 if age is not number', done => {
    request(app)
      .put('/create')
      .send({ login: 'test', password: 'q1Q12345', age: 'qqq' })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject([{
          path: 'age',
          message: '"age" must be a number',
        }]);
        done();
      })
  })

  it('should return 200', done => {
    request(app)
      .put('/create')
      .send({ login: 'test', password: 'q1Q12345', age: 20 })
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      })
  })
})

describe('POST /update/:id', () => {
  it('should return 200', done => {
    request(app)
      .post('/update/1')
      .send({ login: 'test', password: 'q1Q12345', age: 20 })
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      })
  })
})
