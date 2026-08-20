import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';

// Requires an explicit 'Z' or +HH:mm/-HH:mm offset so the client's intended
// instant is unambiguous, rather than relying on the server's local timezone.
// TODO: once UserSettings.preferred_timezone exists, accept a naive local
// value here instead and resolve it server-side using the user's stored IANA
// timezone, rather than trusting a client-supplied offset.
const ISO_8601_WITH_OFFSET_REGEX =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

export function IsDateStringWithOffset(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isDateStringWithOffset',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: unknown) {
                    if (typeof value !== 'string') return false;
                    if (!ISO_8601_WITH_OFFSET_REGEX.test(value)) return false;

                    return !isNaN(Date.parse(value));
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be an ISO 8601 date-time string with an explicit UTC offset or 'Z' (e.g. 2026-09-01T00:00:00+08:00 or 2026-09-01T00:00:00Z)`;
                },
            },
        });
    };
}
