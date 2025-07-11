# GitHub Workflows

## Deployment Configuration

### Server Configuration
Each server requires the following GitHub variables and secrets:

#### Madeyski.org Server
Variables:
- `SSH_HOST_STAGING_MADEYSKI` - Server hostname (e.g., `saasbase.madeyski.org`)
- `SSH_PORT_STAGING_MADEYSKI` - SSH port (e.g., `22`)
- `ENV_STAGING_MADEYSKI` - Environment variables (see format below)

Secrets:
- `SSH_USER_STAGING_MADEYSKI` - SSH username (e.g., `deploy`)
- `SSH_KEY_STAGING_MADEYSKI` - SSH private key (the full private key text)
- `SSH_TARGET_STAGING_MADEYSKI` - Target directory path (e.g., `/var/www/saasbase/dist`)

#### OVH Server
Variables:
- `SSH_HOST_STAGING_OVH` - Server hostname (e.g., `saasbase.ovh`)
- `SSH_PORT_STAGING_OVH` - SSH port (e.g., `22`)
- `ENV_STAGING_OVH` - Environment variables (see format below)

Secrets:
- `SSH_USER_STAGING_OVH` - SSH username (e.g., `deploy`)
- `SSH_KEY_STAGING_OVH` - SSH private key (the full private key text)
- `SSH_TARGET_STAGING_OVH` - Target directory path (e.g., `/var/www/saasbase/dist`)


### Environment Variables Format
The `ENV_*` variables should contain environment configuration in the following format:

```
VITE_APP_DOMAIN=saasbase.ovh
VITE_API_URL=https://api.saasbase.ovh
VITE_PUSHER_APP_KEY=your-pusher-key
VITE_PUSHER_HOST=ws.saasbase.ovh
VITE_RECAPCHA_KEY=your-recaptcha-key
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-key
```

Required variables:
- `ENV_STAGING_MADEYSKI` - Environment variables for madeyski.org server
- `ENV_STAGING_OVH` - Environment variables for saasbase.ovh server

### Workflow Triggers
- Automatic deployment on push to `main` branch
- Manual deployment through workflow dispatch with server selection

### Build Process
1. Builds the app with server-specific environment variables
2. Generates version.json with commit hash and build date
3. Uploads build artifacts
4. Deploys to selected server(s) via SCP
