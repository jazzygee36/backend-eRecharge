// models/Verification.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db'; // Adjust this path as needed

interface VerificationAttributes {
  id?: number;
  reference: string;
  amount: number;
  status: string;
  expiresAt?: Date;
}

interface VerificationCreationAttributes
  extends Optional<VerificationAttributes, 'id'> {}

class UserPayment
  extends Model<VerificationAttributes, VerificationCreationAttributes>
  implements VerificationAttributes
{
  public id!: number;
  public reference!: string;
  public amount!: number;
  public status!: string;
  public expiresAt!: Date;
}

UserPayment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    reference: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    amount: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    status: {
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
    modelName: 'UserPayment',
    tableName: 'paystackpayment', // Change to your preferred table name
    timestamps: false, // Disable timestamps if not needed
  }
);

export default UserPayment;
