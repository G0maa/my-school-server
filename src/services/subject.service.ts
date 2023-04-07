import Subject from '../models/subject';
import { getPagination, querifyStringFields } from '../utils/helpers';
import { ZSubject, ZSubjectFind } from '../validator/subject.validator';

const getSubjects = async (searchQuery: ZSubjectFind['query']) => {
  // searchQuery is opriginally in req.query
  // searchQuery: {name: 'test', studyYear: '1', page: 1, size: 10}
  // querified: {name: { [Op.like]: '%test%' }, studyYear: '1', page: 1, size: 10}
  // paginated: {limit: 10, offset: 0}

  // The way the functions are, forces a certain order,
  // which is I dislike, queryifing wihtout getting rid of page & size,
  // makes sequelize complain about unknown attributes.
  const { offset, limit, rest } = getPagination(searchQuery);

  // Note: searchQuery after being querified, still has page & size.
  const querified = querifyStringFields(rest, ZSubjectFind.shape.query);

  const query = await Subject.findAndCountAll({
    where: querified,
    offset,
    limit,
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

const updateSubject = async (zSubject: ZSubject) => {
  const subject = await Subject.findOne({
    where: {
      subjectId: zSubject.subjectId,
    },
  });

  if (!subject) return;

  subject.set({ ...zSubject });

  await subject.save();
  return subject;
};

const deleteSubject = async (subjectId: string) => {
  const subject = await Subject.destroy({
    where: { subjectId },
  });
  return subject;
};

export { getSubject, getSubjects, createSubject, updateSubject, deleteSubject };
