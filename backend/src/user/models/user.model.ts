import { Table, Model, IsUUID, PrimaryKey, Default, DataType, Column, UpdatedAt, CreatedAt, DeletedAt } from "sequelize-typescript";

interface User {
    id?: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    created_at?: Date | null,
    updated_at?: Date | null,
    deleted_at?: Date | null
}

@Table({
    tableName: 'Users',
    underscored: true,
    timestamps: true,
    paranoid: true
})
export class UserModel extends Model<User> {
    @IsUUID(4)
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @Column({
    type: DataType.STRING,
    allowNull: false,
    })
    first_name!: string;

    @Column({
    type: DataType.STRING,
    allowNull: false,
    })
    last_name!: string;

    @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    })
    email!: string;

    @Column({
    type: DataType.STRING,
    allowNull: false,
    })
    password!: string;

    @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    })
    is_email_verified!: boolean;

    @CreatedAt
    created_at!: Date;

    @UpdatedAt
    updated_at!: Date;

    @DeletedAt
    deleted_at!: Date;
}