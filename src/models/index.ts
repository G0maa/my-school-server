import User from './user';
import Admin from './admin';
import Student from './student';

// One-To-One Relationships
// User.hasOne(Admin);
// Admin.belongsTo(User);

// User.hasOne(Student);
// Student.belongsTo(User);

export { User, Admin, Student };
