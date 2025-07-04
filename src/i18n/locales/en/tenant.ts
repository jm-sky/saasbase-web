export const tenant = {
  title: 'Tenant',
  tenantDetails: 'Tenant Details',
  fields: {
    country: 'Country',
    name: 'Name',
    slug: 'Slug',
    vatId: 'VAT ID',
    regon: 'REGON',
    taxId: 'Tax ID',
    email: 'Email',
    phone: 'Phone',
    website: 'Website',
    visible: 'Visible',
    publicName: 'Public Name',
    industry: 'Industry',
    locationCity: 'City',
    locationCountry: 'Country',
    description: 'Description',
    publicLogo: 'Public Logo',
    bannerImage: 'Banner Image',
    socialLinks: 'Social Links',
    address: 'Address',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    deletedAt: 'Deleted At',
  },
  create: {
    title: 'Create Tenant',
    companyInfo: 'Company Info',
    otherDetails: 'Other Details',
    address: 'Address',
    bankAccount: 'Bank Account',
    success: 'Tenant created successfully',
    error: 'Failed to create tenant',
  },
  welcome: {
    title: 'Welcome to the tenant',
    description: 'Please select a plan to get started',
  },
  add: {
    title: 'Add Tenant',
    description: 'Add a new tenant to the system.',
  },
  delete: {
    success: 'Tenant deleted successfully',
    error: 'Failed to delete tenant',
    confirm: 'Are you sure you want to delete this tenant?',
  },
  addresses: {
    add: {
      title: 'Add Address',
      description: 'Add a new address to the tenant.',
    },
    edit: {
      title: 'Edit Address',
      description: 'Edit an existing address of the tenant.',
    },
  },
  invitations: {
    title: 'Invitations',
    process: {
      title: 'Invitation',
      info: 'You have been invited to join {tenant} as {role}.',
      description: 'You can accept or decline the invitation.',
      loading: 'Loading invitation...',
      invalidEmail: 'Invalid email address',
      load: {
        error: 'Failed to load invitation',
      },
    },
    accept: {
      button: 'Accept',
      success: 'Invitation accepted',
      successDescription: 'You have been added to the tenant.',
      error: 'Failed to accept invitation',
    },
    decline: {
      button: 'Decline',
      success: 'Invitation declined',
      successDescription: 'You have been removed from the tenant.',
      error: 'Failed to decline invitation',
    },
    status: {
      pending: 'Pending',
      accepted: 'Accepted',
      rejected: 'Rejected',
    },
    send: {
      title: 'Send Invitation',
      description: 'Send an invitation to a user to join the tenant.',
      email: 'Email',
      role: 'Role',
      send: 'Send',
      cancel: 'Cancel',
      success: 'Invitation sent successfully',
      error: 'Failed to send invitation',
      confirm: 'Are you sure you want to send this invitation?',
      submit: 'Send Invitation',
    },
    list: {
      title: 'Invitations',
      description: 'List of invitations to the tenant.',
      email: 'Email',
      role: 'Role',
      invitedBy: 'Invited by',
      status: 'Status',
      expires: 'Expires',
      acceptedAt: 'Accepted At',
      expiresAt: 'Expires At',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
      deletedAt: 'Deleted At',
      empty: 'No invitations',
      loading: 'Loading invitations...',
      error: 'Failed to load invitations',
    },
    delete: {
      success: 'Invitation deleted successfully',
      error: 'Failed to delete invitation',
      confirm: 'Are you sure you want to delete this invitation?',
    },
  },
  overview: {
    title: 'Overview',
    description: 'Overview of the tenant',
  },
  organizationUnits: {
    title: 'Organization Units',
    description: 'Organization units of the tenant',
    technical: {
      unassigned: 'Unassigned',
      'former-employees': 'Former Employees',
    },
    fields: {
      name: 'Name',
      code: 'Code',
      description: 'Description',
      isActive: 'Active',
      parent: 'Parent',
      user: 'User',
      position: 'Position',
      role: 'Role',
    },
    add: {
      title: 'Add Organization Unit',
      description: 'Add a new organization unit to the tenant.',
      error: 'Failed to add organization unit',
    },
    edit: {
      title: 'Edit Organization Unit',
      description: 'Edit an existing organization unit of the tenant.',
      error: 'Failed to edit organization unit',
    },
    delete: {
      title: 'Delete Organization Unit',
      description: 'Delete an existing organization unit of the tenant.',
      error: 'Failed to delete organization unit',
      confirm: 'Are you sure you want to delete this organization unit?',
    },
    assignUser: {
      title: 'Assign User to Organization Unit',
      description: 'Assign a user to an organization unit of the tenant.',
      error: 'Failed to assign user to organization unit',
    },
  },
  logs: {
    title: 'Logs',
  },
  branding: {
    title: 'Branding',
    fields: {
      colorPrimary: 'Primary Color',
      colorSecondary: 'Secondary Color',
      shortName: 'Short Name',
      theme: 'Theme',
      pdfAccentColor: 'PDF Accent Color',
      emailSignatureHtml: 'Email Signature',
      logo: 'Logo',
      favicon: 'Favicon',
      customFont: 'Custom Font',
      pdfLogo: 'PDF Logo',
      emailHeaderImage: 'Email Header Image'
    }
  },
  billing: {
    title: 'Billing',
    overview: {
      title: 'Overview',
      currentPlan: {
        title: 'Current Plan',
        noPlan: 'No active plan',
        selectPlan: 'Please select a plan to get started',
        changePlan: 'Change Plan'
      },
      usage: {
        title: 'Usage',
        storage: 'Storage',
        users: 'Users',
        apiCalls: 'API Calls'
      },
      paymentMethod: {
        title: 'Payment Method',
        update: 'Update'
      }
    },
    plans: {
      title: 'Plans',
      description: 'Available plans to choose from',
      monthly: 'Monthly',
      yearly: 'Yearly',
      save: 'Save 20%',
      mostPopular: 'Most Popular',
      currentPlan: 'Current Plan',
      selectPlan: 'Select Plan',
      perMonth: 'per month',
      perYear: 'per year'
    },
    history: {
      title: 'History',
      date: 'Date',
      description: 'Description',
      amount: 'Amount',
      status: 'Status',
      invoice: 'Invoice',
      download: 'Download',
      noHistory: 'No billing history',
      noHistoryDescription: 'Your billing history will appear here once you make your first payment.',
      statuses: {
        paid: 'Paid',
        pending: 'Pending',
        failed: 'Failed'
      }
    }
  },
  integrations: {
    title: 'Integrations',
    types: {
      azureAi: {
        title: 'Azure Intelligence Studio',
        description: 'Powerful OCR and AI services for document processing.',
      },
      ksef: {
        title: 'KSeF',
        description: 'Krajowy System e-Faktur (KSeF) integration.',
      },
      eDelivery: {
        title: 'e-Delivery',
        description: 'e-Delivery integration.',
      },
      s3: {
        title: 'S3 Storage',
        description: 'Object storage integration for backups and files.',
      },
      regonApi: {
        title: 'REGON API',
        description: 'Business registry integration for company data verification.',
      },
      googleCalendar: {
        title: 'Google Calendar',
        description: 'Calendar integration for scheduling and events.',
      },
      microsoftCalendar: {
        title: 'Microsoft Calendar',
        description: 'Microsoft 365 Calendar integration (Exchange/Outlook).',
      },
      jira: {
        title: 'JIRA',
        description: 'Project tracking and issue management integration.',
      },
    },
    fields: {
      appId: 'App ID',
      appSecret: 'App Secret',
      clientId: 'Client ID',
      clientSecret: 'Client Secret',
      domain: 'Domain',
      email: 'Email',
      password: 'Password',
      username: 'Username',
      apiKey: 'API Key',
      apiSecret: 'API Secret',
      apiToken: 'API Token',
      apiUrl: 'API URL',
      endpoint: 'Endpoint',
      accessKey: 'Access Key',
      secretKey: 'Secret Key',
      bucket: 'Bucket',
      tenantId: 'Tenant ID',
    },
    configure: 'Configure',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    deleteConfirm: 'Are you sure you want to delete this integration?',
    deleteSuccess: 'Integration deleted successfully',
  },
  settings: {
    title: 'Settings',
    fields: {
      currency: 'Currency',
      require2fa: 'Require users to use 2FA',
      contractors: {
        fetchLogo: 'Try fetch logo for new contracts'
      }
    },
    save: 'Save'
  },
  publicProfile: {
    title: 'Public Profile',
    fields: {
      country: 'Country',
      name: 'Name',
      slug: 'Slug',
      vatId: 'VAT ID',
      regon: 'REGON',
      taxId: 'Tax ID',
      email: 'Email',
      phone: 'Phone',
      website: 'Website',
      visible: 'Visible',
      publicName: 'Public Name',
      industry: 'Industry',
      locationCity: 'City',
      locationCountry: 'Country',
      description: 'Description',
      publicLogo: 'Public Logo',
      bannerImage: 'Banner Image',
      socialLinks: 'Social Links',
      address: 'Address',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
      deletedAt: 'Deleted At',
    },
    save: 'Save',
    show: {
      error: 'Failed to load public profile'
    }
  },
}
