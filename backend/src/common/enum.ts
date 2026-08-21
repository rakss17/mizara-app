export enum UserStatus {
    Unverified = 'unverified',
}

export enum VerificationCodeType {
    EmailVerification = 'Email Verification',
    PasswordReset = 'Password Reset',
}

export enum RecurringPaymentType {
    Subscription = 'Subscription',
    Bills = 'Bills',
}

export enum RecurringPaymentSortBy {
    DueDate = 'due_date',
    Amount = 'amount',
    Name = 'name',
}

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}
