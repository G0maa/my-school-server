/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import ActiveSubject from '../models/activeSubject';
import { getPagination, querifyStringFields } from '../utils/helpers';
import {
  ZActiveSubject,
  ZActiveSubjectDelete,
  ZActiveSubjectFind,
  ZActiveSubjectGet,
} from '../validator/activeSubject.validator';

// Searching not tested
const getActiveSubjects = async (searchQuery: ZActiveSubjectFind['query']) => {
  const { offset, limit, rest } = getPagination(searchQuery);

  const querified = querifyStringFields(rest, ZActiveSubjectFind.shape.query);

  const query = await ActiveSubject.findAndCountAll({
    where: querified,
    offset,
    limit,
  });
  return query;
};

const getActiveSubject = async (
  serial: ZActiveSubjectGet['params']['serial']
) => {
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

const updateActiveSubject = async (zActiveSubject: ZActiveSubject) => {
  const activeSubject = await ActiveSubject.findOne({
    where: { serial: zActiveSubject.serial },
  });

  if (!activeSubject) return;

  activeSubject.set({ ...zActiveSubject });
  await activeSubject.save();
};

// Not-tested
const deleteActiveSubject = async (
  serial: ZActiveSubjectDelete['params']['serial']
) => {
  const activeSubject = await ActiveSubject.destroy({
    where: { serial },
  });
  return activeSubject;
};

export {
  getActiveSubject,
  getActiveSubjects,
  createActiveSubject,
  updateActiveSubject,
  deleteActiveSubject,
};
