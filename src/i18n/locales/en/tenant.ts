export const tenant = {
  title: 'Tenant',
  tenantDetails: 'Tenant Details',
  fields: {
    name: 'Name',
    slug: 'Slug',
    vatId: 'VAT ID',
    regon: 'REGON',
    taxId: 'Tax ID',
    email: 'Email',
    phone: 'Phone',
    website: 'Website',
    country: 'Country',
    description: 'Description',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    deletedAt: 'Deleted At',
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
      visible: 'Visible',
      publicName: 'Public Name',
      websiteUrl: 'Website URL',
      industry: 'Industry',
      locationCity: 'City',
      locationCountry: 'Country',
      description: 'Description',
      publicLogo: 'Public Logo',
      bannerImage: 'Banner Image',
      socialLinks: 'Social Links',
      address: 'Address'
    },
    save: 'Save',
    show: {
      error: 'Failed to load public profile'
    }
  },
}
