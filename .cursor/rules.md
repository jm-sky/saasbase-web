# Cursor Rules

## Code Organization Rules

1. When moving files:
   - Always verify and fix imports in the moved files
   - Check for any linter errors related to imports
   - Ensure all dependencies are properly installed
   - Update any files that import from the old location
   - Test the functionality after moving

2. Domain Organization:
   - Keep domain-related code together in their respective domain folders
   - Composables should be placed in `domain/[domain-name]/composables/`
   - Services should be placed in `domain/[domain-name]/services/`
   - Types should be placed in `domain/[domain-name]/types/`
   - Store files should be placed in `domain/[domain-name]/store/`

3. Library Organization:
   - All utility functions should be placed in `src/lib/`
   - API-related code should be in `src/lib/api/`
   - General utilities should be in `src/lib/utils/`
   - Each utility should be in its own file with a clear purpose 
