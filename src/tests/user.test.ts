import supertest from 'supertest';
import { app } from '../app';
import { getDummyStudent, loginAdmin } from './helpers';

const api = supertest(app);
const userRoute = '/api/user';

let adminCookie: { Cookie: string };
beforeAll(async () => {
  // jest.setTimeout(20000);
  adminCookie = await loginAdmin(api);
  // Can be moved to its own function
});

// This also needs to remove session from server & test so.
describe('Admin reset password for user', () => {
  test('Resets password with correct id', async () => {
    const user = await getDummyStudent();

    await api
      .post('/api/auth/login')
      .send({ username: user.username, password: user.password })
      .expect(200);

    const changePasswordRequest = await api
      .post(`${userRoute}/${user.id}/reset-password`)
      .set(adminCookie)
      .expect(200);

    // Verify that old password does not work.
    await api
      .post('/api/auth/login')
      .send({ username: user.username, password: user.password })
      .expect(401);

    // Try new password
    await api
      .post('/api/auth/login')
      .send({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        username: user.username,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        password: changePasswordRequest.body.password,
      })
      .expect(200);
  });
});

describe('User (owner of account) resetting password if authenticated', () => {
  test('Correct current password', async () => {
    const user = await getDummyStudent();
    const newPassword = '12345678';

    const oldPasswordRequest = await api
      .post('/api/auth/login')
      .send({ username: user.username, password: user.password })
      .expect(200);

    const userSessionId = oldPasswordRequest.headers['set-cookie'] as string;

    await api
      .post(`${userRoute}/${user.id}/reset-password`)
      .set('Cookie', [userSessionId])
      .send({ currentPassword: user.password, newPassword })
      .expect(200);

    // Verify that old password does not work.
    await api
      .post('/api/auth/login')
      .send({ username: user.username, password: user.password })
      .expect(401);

    // Try new password
    await api
      .post('/api/auth/login')
      .send({
        username: user.username,
        password: newPassword,
      })
      .expect(200);
  });

  test('Incorrect current password', async () => {
    const user = await getDummyStudent();
    const newPassword = '12345678';

    const oldPasswordRequest = await api
      .post('/api/auth/login')
      .send({ username: user.username, password: user.password })
      .expect(200);

    const userSessionId = oldPasswordRequest.headers['set-cookie'] as string;

    const changePasswordRequest = await api
      .post(`${userRoute}/${user.id}/reset-password`)
      .set('Cookie', [userSessionId])
      .send({ currentPassword: 'someotherpassword', newPassword })
      .expect(401);

    expect(changePasswordRequest.body).toEqual({
      error: 'Incorrect current password',
    });

    // Verify that old password still works.
    await api
      .post('/api/auth/login')
      .send({ username: user.username, password: user.password })
      .expect(200);

    // Try new password
    await api
      .post('/api/auth/login')
      .send({
        username: user.username,
        password: newPassword,
      })
      .expect(401);
  });
});

describe('User (non-owner) trying to reset password', () => {
  test('Cannot reset password (using correct password)', async () => {
    const userOwner = await getDummyStudent();
    const otherUser = await getDummyStudent();

    const loginOtherUserRequest = await api
      .post('/api/auth/login')
      .send({ username: otherUser.username, password: otherUser.password })
      .expect(200);

    const otherUserSessionId = loginOtherUserRequest.headers[
      'set-cookie'
    ] as string;

    const changePasswordRequest = await api
      .post(`${userRoute}/${userOwner.id}/reset-password`)
      .set('Cookie', [otherUserSessionId])
      .send({
        currentPassword: userOwner.password,
        newPassword: 'somenewpassword',
      })
      .expect(401);

    expect(changePasswordRequest.body).toEqual({
      error: 'User does not have authority to change password.',
    });
  });
});

describe('User resetting password if un-authenticated', () => {
  test('Gives correct non-revealing json', async () => {
    const user = await getDummyStudent();

    const changePasswordRequest = await api
      .post(`${userRoute}/${user.id}/reset-password`)
      .send({ currentPassword: user.password, newPassword: '000000' })
      .expect(401);

    expect(changePasswordRequest.body).toEqual({
      message: 'Unauthenticed User',
    });
  });
});
