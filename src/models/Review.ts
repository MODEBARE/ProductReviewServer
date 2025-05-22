import {
  DataTypes,
  Model,
  Optional
} from 'sequelize';
import { sequelize } from '../config/db';

export interface ReviewAttributes {
  id: number;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  date: Date;
}

// ✅ Mark `id` and `date` as optional at creation
export interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id' | 'date'> {}

export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: number;
  public productId!: number;
  public author!: string;
  public rating!: number;
  public comment!: string;
  public date!: Date;
}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'Review',
    timestamps: false
  }
);
