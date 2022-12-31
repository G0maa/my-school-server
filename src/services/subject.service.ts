import Subject from '../models/subject';
import { ZSubject, ZSubjectQuery } from '../validator/subject.validator';

const getSubjects = async (searchQuery: ZSubjectQuery) => {
  const query = await Subject.findAll({
    where: { ...searchQuery },
  });
  return query;
};

const getSubject = async (subjectId: string) => {
  const query = await Subject.findOne({
    where: { subjectId },
  });
  return query;
};

const createSubject = async (zSubject: ZSubject) => {
  const subject = await Subject.create(zSubject);
  return subject;
};

const deleteSubject = async (subjectId: string) => {
  const subject = await Subject.destroy({
    where: { subjectId },
  });
  return subject;
};

export { getSubject, getSubjects, createSubject, deleteSubject };
