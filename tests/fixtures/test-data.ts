/**
 * Data Factories - Generate test data with sensible defaults for HCC
 */

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
