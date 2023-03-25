// Unit tests for the utils/helpers.ts file

import { Op } from 'sequelize';
import { getPagination, querifyStringFields } from '../utils/helpers';
import { ZSubjectFind } from '../validator/subject.validator';
import { ZStudyClassFind } from '../validator/studyClass.validator';

// This was made with the help of Github Copilot (first time using it)
describe('getPagination() function unit tests', () => {
  test('should return an object with offset and limit', () => {
    const obj = getPagination({ page: 1, size: 10 });

    expect(obj).toHaveProperty('offset');
    expect(obj).toHaveProperty('limit');

    expect(obj.offset).toBe(0);
    expect(obj.limit).toBe(10);
  });
});

describe('querifyStringFields() function unit tests', () => {
  test('Try on Subject model', () => {
    // You can do it like this:
    const { query } = ZSubjectFind.parse({
      query: { name: 'test', subjectId: '123' },
    });

    const querified = querifyStringFields(query, ZSubjectFind.shape.query);

    expect(querified.name).toStrictEqual({ [Op.like]: '%test%' });

    // subjectId is ZodString, that's why it is "querified".
    expect(querified.subjectId).toStrictEqual({ [Op.like]: '%123%' });
    expect(querified.page).toBe(1);
    expect(querified.size).toBe(10);
  });

  test('Try on StudyClass model', () => {
    // or like this:
    const query = ZStudyClassFind.shape.query.parse({
      educationType: 'Literature',
      studyYear: '1',
      classId: '123',
    });

    const querified = querifyStringFields(query, ZStudyClassFind.shape.query);

    // Enums stay the same.
    expect(querified.educationType).toStrictEqual('Literature');
    expect(querified.studyYear).toStrictEqual('1');
    expect(querified.classId).toStrictEqual({ [Op.like]: '%123%' });
  });
});
