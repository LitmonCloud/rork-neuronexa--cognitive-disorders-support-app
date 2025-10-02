export interface CaregiverInvite {
  id: string;
  patientId: string;
  code: string;
  expiresAt: Date;
  redeemedAt?: Date;
  redeemedBy?: string;
  createdAt: Date;
}

export interface InviteValidationResult {
  valid: boolean;
  error?: 'expired' | 'invalid' | 'already_used' | 'network_error';
  errorMessage?: string;
  invite?: CaregiverInvite;
}

export interface GenerateInviteResult {
  success: boolean;
  invite?: CaregiverInvite;
  error?: string;
}

export interface RedeemInviteResult {
  success: boolean;
  patientId?: string;
  error?: string;
}
