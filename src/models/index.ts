import User from './user';
import Admin from './admin';

// Default FK is <table_name>_id
User.hasOne(Admin);
Admin.belongsTo(User);

export { User, Admin };
