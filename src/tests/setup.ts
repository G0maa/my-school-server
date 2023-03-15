import { initServer } from '../app';

export default async () => {
  // #Continue
  // const api = supertest(app);
  await initServer();
};
