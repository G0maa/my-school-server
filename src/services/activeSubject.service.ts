/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import ActiveSubject from '../models/activeSubject';
import { ZActiveSubject } from '../validator/activeSubject.validator';

// #17 very WET CRUD operations.
const getActiveSubjects = async () => {
  const query = await ActiveSubject.findAll();
  return query;
};

// Lots of variations in this one.
// To-Do
// /api/activeSubjects/:id?query=teacher i.e. all classes & subjects for this teacher id
// /api/activeSubjects/:id?query=studyClass i.e. all subjects & teachers for this class
// /api/activeSubjects/:id?query=subject i.e. all classes & teachers for this subject
const getActiveSubject = async (serial: string) => {
  const query = await ActiveSubject.findOne({
    where: { serial },
  });
  return query;
};

// To-Do: This needs to be throughly tested.
const createActiveSubject = async (zActiveSubject: ZActiveSubject) => {
  const activeSubject = await ActiveSubject.create(zActiveSubject);
  return activeSubject;
};

// Not-tested
const deleteActiveSubject = async (serial: string) => {
  const activeSubject = await ActiveSubject.destroy({
    where: { serial },
  });
  return activeSubject;
};

export {
  getActiveSubject,
  getActiveSubjects,
  createActiveSubject,
  deleteActiveSubject,
};
