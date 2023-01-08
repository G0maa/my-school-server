import {
  Model,
  DataType,
  Table,
  Column,
  AllowNull,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  Unique,
} from 'sequelize-typescript';
import Subject from './subject';
import Teacher from './teacher';

@Table({
  timestamps: false,
  underscored: true,
  modelName: 'subjects_material',
})
class SubjectsMaterial extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  serial!: number;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.STRING(6),
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  subjectId!: string;

  @ForeignKey(() => Teacher)
  @Column({ type: DataType.UUID(), onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  teacherId!: string;

  @AllowNull(false)
  @Column(DataType.STRING(64))
  fileName!: string;

  @AllowNull(false)
  @Unique(true)
  @Column(DataType.STRING(256))
  filePath!: string;
}

export default SubjectsMaterial;
