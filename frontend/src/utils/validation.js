/**
 * OMNIFIT Ecosystem - Form Validation Utilities
 * Provides consistent, logical validation for forms across all user portals.
 */

// Basic email validation regex conforming to standard RFC-like web address formats
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

// Names: English alphabets, accents, spaces, hyphens, and apostrophes (min 2 chars, max 60 chars)
export const NAME_REGEX = /^[a-zA-Z\s'.-]{2,60}$/;

// Phone: allows optional +, country code, spaces, hyphens, parentheses, but must have 7 to 15 digits
export const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

/**
 * Validates a person's name or title
 */
export const validateName = (name, fieldLabel = 'Full Name') => {
    if (!name || !name.trim()) {
        return { valid: false, message: `Please enter your ${fieldLabel}.` };
    }
    const trimmed = name.trim();
    if (trimmed.length < 2) {
        return { valid: false, message: `${fieldLabel} must be at least 2 characters long.` };
    }
    if (trimmed.length > 60) {
        return { valid: false, message: `${fieldLabel} must not exceed 60 characters.` };
    }
    if (!NAME_REGEX.test(trimmed)) {
        return { valid: false, message: `${fieldLabel} should contain only letters, spaces, hyphens, or apostrophes.` };
    }
    return { valid: true };
};

/**
 * Validates an email address
 */
export const validateEmail = (email) => {
    if (!email || !email.trim()) {
        return { valid: false, message: 'Please enter your Email address.' };
    }
    const trimmed = email.trim();
    if (!EMAIL_REGEX.test(trimmed)) {
        return { valid: false, message: 'Please enter a valid Email address format.' };
    }
    return { valid: true };
};

/**
 * Validates a telephone number
 */
export const validatePhone = (phone, isRequired = false, isIndian = false) => {
    if (!phone || !phone.trim()) {
        if (isRequired) {
            return { valid: false, message: 'Please enter a contact phone number.' };
        }
        return { valid: true };
    }

    const trimmed = phone.trim();
    if (!PHONE_REGEX.test(trimmed)) {
        return { valid: false, message: 'Please enter a valid phone number format.' };
    }

    const digitsOnly = trimmed.replace(/\D/g, '');
    if (isIndian) {
        // If Indian number (+91 or without), check if ends in 10 digits
        if (digitsOnly.length < 10 || digitsOnly.length > 12) {
            return { valid: false, message: 'Indian phone number must be 10 digits.' };
        }
    } else {
        if (digitsOnly.length < 7 || digitsOnly.length > 15) {
            return { valid: false, message: 'Phone number must contain between 7 and 15 digits.' };
        }
    }

    return { valid: true };
};

/**
 * Validates numeric ranges with custom bounds and units
 */
export const validateNumericRange = (value, fieldName, min, max, unit = '') => {
    if (value === '' || value === null || value === undefined) {
        return { valid: true }; // optional if empty, use validateRequired for mandatory
    }
    const num = Number(value);
    if (isNaN(num)) {
        return { valid: false, message: `${fieldName} must be a valid number.` };
    }
    if (min >= 0 && num < 0) {
        return { valid: false, message: `${fieldName} cannot be a negative value.` };
    }
    if (num < min || num > max) {
        const unitSuffix = unit ? ` ${unit}` : '';
        return { valid: false, message: `${fieldName} must be between ${min}${unitSuffix} and ${max}${unitSuffix}.` };
    }
    return { valid: true };
};

/**
 * Validates date of birth (must not be in future and within realistic human age bounds)
 */
export const validateDateOfBirth = (dobString, minAge = 12, maxAge = 120) => {
    if (!dobString) {
        return { valid: true };
    }

    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) {
        return { valid: false, message: 'Please enter a valid date of birth.' };
    }

    const today = new Date();
    if (dob > today) {
        return { valid: false, message: 'Date of birth cannot be in the future.' };
    }

    let calculatedAge = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        calculatedAge--;
    }

    if (calculatedAge < minAge) {
        return { valid: false, message: `Member must be at least ${minAge} years old to register.` };
    }
    if (calculatedAge > maxAge) {
        return { valid: false, message: `Please enter a realistic date of birth (maximum ${maxAge} years).` };
    }

    return { valid: true, calculatedAge };
};

/**
 * Validates future appointment date (cannot be earlier than today)
 */
export const validateAppointmentDate = (dateString) => {
    if (!dateString) {
        return { valid: false, message: 'Please select an appointment date.' };
    }
    const selectedDate = new Date(dateString);
    if (isNaN(selectedDate.getTime())) {
        return { valid: false, message: 'Please enter a valid appointment date.' };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parse selected date string as local date
    const [year, month, day] = dateString.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day);

    if (targetDate < today) {
        return { valid: false, message: 'Appointment date cannot be in the past.' };
    }
    return { valid: true };
};

/**
 * Validates generic text length & whitespace
 */
export const validateText = (text, fieldName, minLength = 2, maxLength = 1000) => {
    if (!text || !text.trim()) {
        return { valid: false, message: `Please enter ${fieldName}.` };
    }
    const trimmed = text.trim();
    if (trimmed.length < minLength) {
        return { valid: false, message: `${fieldName} must be at least ${minLength} characters.` };
    }
    if (trimmed.length > maxLength) {
        return { valid: false, message: `${fieldName} cannot exceed ${maxLength} characters.` };
    }
    return { valid: true, value: trimmed };
};
