import User from './user';
import Admin from './admin';
import Student from './student';
import Teacher from './teacher';
import ActiveSubject from './activeSubject';
import Subject from './subject';
import UserDetails from './userDetails';
import Grade from './grade';
import Fee from './fee';
import Holiday from './holiday';
import StudyClass from './class';

// Helps in reducing import lines
// in files where you have many imported modules

export {
  User,
  UserDetails,
  Admin,
  Student,
  Teacher,
  Subject,
  StudyClass,
  ActiveSubject,
  Fee,
  Grade,
  Holiday,
};
