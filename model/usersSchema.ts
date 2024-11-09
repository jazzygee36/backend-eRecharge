// models/User.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db'; // Adjust this path as needed

interface UserAttributes {
  id?: number;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  isVerified: boolean; // Make this required for clarity
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public phoneNumber!: string;
  public isVerified!: boolean; // Made required
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      // Optional validation for phone number format
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Default value
    },
    // googleId: {
    //   type: DataTypes.STRING,
    //   unique: true,
    // },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'erechargeusers',
    timestamps: true,
  }
);

export default User;
