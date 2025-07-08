export type TIdentityConfirmationType = 'trustedProfile' | 'ksef' | 'eDelivery' | 'bank'

export type TIdentityConfirmationStatus =
  | 'verified'
  | 'unverified'
  | 'invalidXml'
  | 'invalidSignature'

export enum SignatureType {
  ASIC_E = 'asic-e',
  CAdES = 'cades',
  PAdES = 'pades',
  UNKNOWN = 'unknown',
  XAdES = 'xades',
}

export interface ISignerIdentity {
  firstName?: string
  lastName?: string
  pesel?: string
  middleName?: string | null
  trustedProfileId?: string | null
  epuapUsername?: string | null
}

export interface ICertificate {
  issuer: string
  serialNumber: string
  validFrom?: string | null
  validTo?: string | null
  subject?: string | null
}

export interface IGenericSignatureDetails {
  valid: boolean
  trustedCA: boolean
  signerIdentity?: ISignerIdentity
  certificate?: ICertificate
}

export interface IGenericSignaturesVerificationResult {
  valid: boolean
  type: SignatureType
  signatures: IGenericSignatureDetails[]
  error?: string | null
}

export interface IIdentityConfirmationResponse {
  status: TIdentityConfirmationStatus
  confirmed: boolean
  errors?: Record<string, string[]> | null
  signatureInfo: IGenericSignatureDetails
}
