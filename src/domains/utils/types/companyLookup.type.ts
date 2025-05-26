export interface ICompanyPerson {
  name?: string
  nip?: string
  pesel?: string
}

export interface ICompanyLookupResponse {
  name: string
  vatId: string
  country?: string
  regon?: string
  krs?: string
  address?: string
  workingAddress?: string
  accountNumbers?: string[]
  vatStatus: string
  hasVirtualAccounts: boolean
  representatives: ICompanyPerson[]
  authorizedClerks: ICompanyPerson[]
  partners: ICompanyPerson[]
  registrationLegalDate?: string
}
