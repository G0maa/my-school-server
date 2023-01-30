import fs from 'fs';
import supertest from 'supertest';
import { app } from '../app';
import { getDummySubject, loginAdmin } from './helpers';

const api = supertest(app);
const subjectsMaterialRoute = '/api/subjectsMaterial';

let adminCookie: { Cookie: string };
let subjectId: string;
beforeAll(async () => {
  adminCookie = await loginAdmin(api);

  subjectId = (await getDummySubject()).subjectId;
});

describe('CRUD Subjects Materials', () => {
  test('Upload & Download new subject material', async () => {
    // Probbably a good idea to refactor to a helper function.
    const filePath = 'src/tests/test.txt';
    await fs.promises.writeFile(filePath, 'Hello Jest\n');

    const oneSubjectMaterialRecord = await api
      .post(`${subjectsMaterialRoute}/${subjectId}`)
      .set(adminCookie)
      .set('Content-Type', 'multipart/form-data')
      .field('fileName', 'jest test')
      .attach('pdf', filePath)
      .expect(200);

    // Are there a way to check contents of the file
    const res = await api
      .get(
        `${subjectsMaterialRoute}/${subjectId}/${oneSubjectMaterialRecord.body.serial}`
      )
      .set(adminCookie)
      .expect(200);
    expect(res.headers['content-length']).toEqual('11');
    console.log('res', res);
  });
});
