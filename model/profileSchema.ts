// models/Verification.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db'; // Adjust this path as needed

interface VerificationAttributes {
  id?: number;
  username: string;
  email: string;
  phoneNumber: string;
  expiresAt?: Date;
}

interface VerificationCreationAttributes
  extends Optional<VerificationAttributes, 'id'> {}

class UserProfile
  extends Model<VerificationAttributes, VerificationCreationAttributes>
  implements VerificationAttributes
{
  public id!: number;
  public username!: string;
  public email!: string;
  public phoneNumber!: string;
  public expiresAt!: Date;
}

UserProfile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
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
    modelName: 'UserProfile',
    tableName: 'userprofile', // Change to your preferred table name
    timestamps: false, // Disable timestamps if not needed
  }
);

export default UserProfile;
