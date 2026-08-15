import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
    BelongsTo,
    UpdatedAt,
    CreatedAt,
} from 'sequelize-typescript';

import { UserModel } from '@/user/models/user.model';

interface EmailVerification {
    id?: string;
    user_id: string;
    code_hash: string;
    expires_at: Date;
    attempts: number;
    verified_at?: Date | null;
    created_at?: Date | null;
    updated_at?: Date | null;
}

@Table({
    tableName: 'Email_Verifications',
    underscored: true,
    timestamps: true,
})
export class EmailVerificationModel extends Model<EmailVerification> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @ForeignKey(() => UserModel)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare user_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare code_hash: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare expires_at: Date;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    })
    declare attempts: number;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare verified_at: Date | null;

    @CreatedAt
    declare created_at: Date;

    @UpdatedAt
    declare updated_at: Date;

    @BelongsTo(() => UserModel, {
        foreignKey: 'user_id',
        as: 'user',
    })
    declare user: UserModel;
}
