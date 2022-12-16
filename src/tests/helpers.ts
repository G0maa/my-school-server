import supertest from 'supertest';

const adminCreds = {
  username: 'A0001',
  password: '000000',
};

export const loginAdmin = async (api: supertest.SuperTest<supertest.Test>) => {
  const response = await api
    .post('/api/auth/login')
    .send(adminCreds)
    .expect(200);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.headers['set-cookie'];
};
