import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayNotEmpty,
    ArrayUnique,
    IsArray,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
} from 'class-validator';

import { ReminderChannel, ReminderOffsetDays } from '@/common/enum';

export class UpsertReminderSettingsDto {
    @ApiProperty({ example: true })
    @IsNotEmpty()
    @IsBoolean()
    is_enabled!: boolean;

    @ApiProperty({
        example: [
            ReminderOffsetDays.SevenDaysBefore,
            ReminderOffsetDays.ThreeDaysBefore,
            ReminderOffsetDays.OneDayBefore,
            ReminderOffsetDays.DueDay,
        ],
        enum: ReminderOffsetDays,
        isArray: true,
        description: 'Days before the due date to send a reminder.',
    })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsEnum(ReminderOffsetDays, { each: true })
    remind_before_days!: ReminderOffsetDays[];

    @ApiProperty({
        example: [ReminderChannel.Email],
        enum: ReminderChannel,
        isArray: true,
    })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsEnum(ReminderChannel, { each: true })
    channels!: ReminderChannel[];
}
