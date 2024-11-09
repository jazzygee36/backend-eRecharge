// models/Verification.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db'; // Adjust this path as needed

interface VerificationAttributes {
  id?: number;
  userId: number; // Reference to User model
  phoneNumber: string;
  code: string;
  expiresAt: Date;
}

interface VerificationCreationAttributes
  extends Optional<VerificationAttributes, 'id'> {}

class Verification
  extends Model<VerificationAttributes, VerificationCreationAttributes>
  implements VerificationAttributes
{
  public id!: number;
  public userId!: number;
  public phoneNumber!: string;
  public code!: string;
  public expiresAt!: Date;
}

Verification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Verification',
    tableName: 'verifications', // Change to your preferred table name
    timestamps: false, // Disable timestamps if not needed
  }
);

export default Verification;
