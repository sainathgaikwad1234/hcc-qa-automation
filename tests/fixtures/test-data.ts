/**
 * Data Factories - Generate test data with sensible defaults for HCC
 */

/** Returns a string of n random lowercase letters (for names that must be letters/hyphens/apostrophes only). */
export function randomLetters(n: number): string {
  return Array.from({ length: n }, () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 26))
  ).join('');
}

/** Returns a unique phone number in (XXX) XXX-XXXX format for Add User form (avoids duplicate-phone validation). */
export function uniquePhoneNumber(): string {
  const suffix = Date.now().toString().slice(-7).padStart(7, '0');
  return `(555) ${suffix.slice(0, 3)}-${suffix.slice(3)}`;
}

export const createPatient = (overrides: Partial<Patient> = {}): Patient => {
  const timestamp = Date.now();
  return {
    firstName: 'Test',
    lastName: `Patient${timestamp}`,
    email: `test-patient-${timestamp}@hcc.com`,
    phone: '555-000-0000',
    dateOfBirth: '1990-01-01',
    status: 'active',
    ...overrides,
  };
};

/** Client data for Create Client form (e.g. Clients → Add Client). DOB in MM/DD/YYYY for US date inputs. */
export function createClientForForm(overrides: {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  zip?: string;
} = {}): {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  zip: string;
} {
  const suffix = randomLetters(6);
  const timestamp = Date.now();
  return {
    firstName: 'Test',
    lastName: `Client${suffix}`,
    dateOfBirth: '01/01/1990',
    email: `e2e-client-${timestamp}@mailinator.com`,
    phone: uniquePhoneNumber(),
    addressLine1: '123 Test St',
    city: 'Denver',
    zip: '80202',
    ...overrides,
  };
}

export const createClinician = (overrides: Partial<Clinician> = {}): Clinician => {
  const timestamp = Date.now();
  return {
    firstName: 'Test',
    lastName: `Clinician${timestamp}`,
    email: `test-clinician-${timestamp}@hcc.com`,
    role: 'counselor',
    status: 'active',
    ...overrides,
  };
};

/** Clinician-like data for Add User form: first/last name are letters-only (app validation); phone is unique. */
export function createUserForAddUserForm(overrides: { email?: string; phone?: string } = {}): {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
} {
  const suffix = randomLetters(6);
  const timestamp = Date.now();
  return {
    firstName: 'Test',
    lastName: `User${suffix}`,
    email: `e2e-user-${timestamp}@hcc.com`,
    phone: uniquePhoneNumber(),
    ...overrides,
  };
}

export const createAppointment = (overrides: Partial<Appointment> = {}): Appointment => {
  const timestamp = Date.now();
  return {
    id: `apt-${timestamp}`,
    patientName: 'Test Patient',
    clinicianName: 'Test Clinician',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: 60,
    type: 'individual',
    status: 'scheduled',
    ...overrides,
  };
};

// Type definitions
export type Patient = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  status: 'active' | 'inactive' | 'pending';
};

export type Clinician = {
  firstName: string;
  lastName: string;
  email: string;
  role: 'counselor' | 'clinician' | 'admin';
  status: 'active' | 'inactive';
};

export type Appointment = {
  id: string;
  patientName: string;
  clinicianName: string;
  date: string;
  time: string;
  duration: number;
  type: 'individual' | 'group' | 'family';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
};
