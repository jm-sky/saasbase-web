export const settings = {
  // Common settings translations
  pageTitle: 'Settings',
  title: 'Settings',
  description: 'Manage your account settings and set e-mail preferences.',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  confirm: 'Confirm',
  success: 'Success',
  error: 'Error',
  loading: 'Loading...',

  profile: {
    title: 'Profile',
    description: 'This is how others will see you on the site.',
    updateProfile: 'Update Profile',
    resetForm: 'Reset Form',
    public: 'Public',
    user: {
      firstName: 'First Name',
      firstNameDescription: 'This is your public first name.',
      lastName: 'Last Name',
      lastNameDescription: 'This is your public last name.',
      email: 'Email',
      phone: 'Phone',
      birthDate: 'Birth Date',
      description: 'Description',
      bio: 'Bio',
      location: 'Location',
      position: 'Position',
      website: 'Website',
      socialLinks: {
        facebook: 'Facebook',
        instagram: 'Instagram',
        twitter: 'Twitter',
        linkedin: 'LinkedIn',
        youtube: 'YouTube',
      },
      descriptionPlaceholder: 'Tell us about yourself',
      isPublicProfile: 'Set public profile',
      publicFields: {
        email: 'Public Email',
        phone: 'Public Phone',
        birthDate: 'Public Birth Date',
      },
    },
    failedToUpdate: 'Failed to update profile',
    profileImage: {
      title: 'Profile Image',
      description: 'Upload a new profile image. Supported formats: JPG, PNG, GIF',
      maxSize: 'Maximum file size: 5MB',
      uploadImage: 'Upload Image',
      removeImage: 'Remove Image',
      failedToUpload: 'Failed to upload image',
      failedToRemove: 'Failed to remove image',
      success: 'Profile image updated successfully',
    },
    skills: {
      title: 'Skills',
      description: 'Manage your skills',
      noSkills: 'No skills found',
    }
  },

  // Account section
  account: {
    title: 'Account',
    sessions: {
      title: 'Active Sessions',
      description: 'Manage active sessions on different devices',
      currentSession: 'Current Session',
      device: 'Device',
      location: 'Location',
      lastActive: 'Last Active',
      terminate: 'Terminate Session',
      terminateAll: 'Terminate All Other Sessions',
      terminateConfirm: 'Are you sure you want to terminate this session?',
      terminateAllConfirm: 'Are you sure you want to terminate all other sessions?'
    },
    devices: {
      title: 'Trusted Devices',
      description: 'Manage devices that can access your account',
      deviceName: 'Device Name',
      lastUsed: 'Last Used',
      remove: 'Remove Device',
      removeConfirm: 'Are you sure you want to remove this device?'
    },
    logs: {
      title: 'Activity History',
      description: 'Browse your account activity history',
      date: 'Date',
      action: 'Action',
      ip: 'IP Address',
      noLogs: 'No activity history'
    },
    delete: {
      title: 'Delete Account',
      description: 'Permanently delete your account and all associated data',
      warning: 'This action cannot be undone. All your data will be permanently deleted.',
      confirmText: 'Type "DELETE" to confirm',
      confirmPlaceholder: 'DELETE',
      success: 'Account has been successfully deleted'
    },
    invitations: {
      title: 'Application Invitations',
      description: 'Manage application invitations',
      status: 'Status',
      invitedBy: 'Invited by',
      date: 'Invitation Date',
      accept: 'Accept',
      decline: 'Decline',
      noInvitations: 'No pending invitations'
    }
  },

  // Authentication section
  authentication: {
    title: 'Authentication',
    apiKeys: {
      title: 'API Keys',
      description: 'Manage API keys for external integrations',
      create: 'Create New API Key',
      name: 'Key Name',
      created: 'Created',
      lastUsed: 'Last Used',
      expires: 'Expires',
      never: 'Never',
      revoke: 'Revoke',
      revokeConfirm: 'Are you sure you want to revoke this API key?',
      copy: 'Copy Key',
      copied: 'Copied to clipboard',
      newKey: 'New API Key',
      keyWarning: 'Remember to copy your API key now. You won\'t be able to see it again!'
    },
    mfa: {
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      enable: 'Enable 2FA',
      disable: 'Disable 2FA',
      setup: 'Setup 2FA',
      verify: 'Verify Code',
      recoveryCodes: 'Recovery Codes',
      downloadCodes: 'Download Recovery Codes',
      codesWarning: 'Store these recovery codes in a safe place. You can use them to access your account if you lose your 2FA device.',
      qrCode: 'Scan QR Code',
      manualCode: 'Manual Entry Code',
      enterCode: 'Enter the 6-digit code from your authenticator app'
    }
  },

  // Preferences section
  preferences: {
    title: 'Preferences',
    appearance: {
      title: 'Appearance',
      description: 'Customize the application appearance',
      theme: 'Theme',
      language: 'Language',
      timezone: 'Timezone',
      dateFormat: 'Date Format',
      timeFormat: 'Time Format',
      system: 'System',
      light: 'Light',
      dark: 'Dark'
    },
    notifications: {
      title: 'Notifications',
      description: 'Manage notification preferences',
      email: 'Email Notifications',
      push: 'Push Notifications',
      inApp: 'In-App Notifications',
      categories: {
        security: 'Security',
        updates: 'Updates',
        marketing: 'Marketing',
        system: 'System'
      },
      frequency: {
        immediate: 'Immediate',
        daily: 'Daily Digest',
        weekly: 'Weekly Digest',
        never: 'Never'
      }
    }
  }
}
