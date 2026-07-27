# Numbering Templates Frontend Architecture Plan

## 1. Types & Interfaces

```typescript
// types/numberingTemplate.ts
export interface NumberingTemplate {
  id: string;
  tenantId?: string;
  name: string;
  invoiceType: InvoiceType;
  format: string;
  nextNumber: number;
  resetPeriod: ResetPeriod;
  prefix: string;
  suffix: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export const InvoiceType = {
  Basic: 'basic',
  BasicCorrection: 'basic-correction',
  AdvancePayment: 'advance-payment',
  AdvancePaymentCorrection: 'advance-payment-correction',
  Export: 'export',
  ExportCorrection: 'export-correction',
  Settlement: 'settlement',
  SettlementCorrection: 'settlement-correction',
  Proforma: 'proforma',
  Ue: 'ue',
  UeCorrection: 'ue-correction',
  DebitNote: 'debit-note',
  DebitNoteCorrection: 'debit-note-correction',
  Import: 'import',
  ImportCorrection: 'import-correction'
} as const;

export type InvoiceType = typeof InvoiceType[keyof typeof InvoiceType];

export const ResetPeriod = {
  Monthly: 'monthly',
  Yearly: 'yearly',
  Never: 'never'
} as const;

export type ResetPeriod = typeof ResetPeriod[keyof typeof ResetPeriod];

export interface NumberingTemplateForm {
  name: string;
  invoiceType: InvoiceType;
  format: string;
  nextNumber: number;
  resetPeriod: ResetPeriod;
  prefix: string;
  suffix: string;
}

export interface InvoiceTypeGroup {
  key: string;
  label: string;
  baseType: InvoiceType;
  correctionType?: InvoiceType;
  templates: {
    base: NumberingTemplate[];
    correction: NumberingTemplate[];
  };
}

export interface FormatElement {
  id: string;
  type: 'year4' | 'year2' | 'month' | 'number3' | 'number4' | 'text';
  value: string;
  placeholder: string;
}

// API response types
export interface NumberingTemplatesResponse {
  data: NumberingTemplate[];
  meta?: {
    total: number;
    perPage: number;
    currentPage: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}
```

## 2. Service Layer

```typescript
// services/numberingTemplateService.ts
// TODO: Update with actual API wrapper structure from your repo
export class NumberingTemplateService {
  private endpoint = 'numbering-templates'; // Will use /api/v1/numbering-templates

  async getAll(): Promise<NumberingTemplate[]> {
    const response = await api.get<NumberingTemplatesResponse>(this.endpoint);
    return response.data.data;
  }

  async getById(id: string): Promise<NumberingTemplate> {
    const response = await api.get<{ data: NumberingTemplate }>(`${this.endpoint}/${id}`);
    return response.data.data;
  }

  async create(data: NumberingTemplateForm): Promise<NumberingTemplate> {
    const response = await api.post<{ data: NumberingTemplate }>(this.endpoint, data);
    return response.data.data;
  }

  async update(id: string, data: Partial<NumberingTemplateForm>): Promise<NumberingTemplate> {
    const response = await api.put<{ data: NumberingTemplate }>(`${this.endpoint}/${id}`, data);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`);
  }

  async setAsDefault(id: string): Promise<void> {
    await api.post(`${this.endpoint}/${id}/set-default`);
  }

  async previewNumber(templateData: Partial<NumberingTemplateForm>): Promise<string> {
    const response = await api.post<{ preview: string }>(`${this.endpoint}/preview`, templateData);
    return response.data.preview;
  }

  async validateFormat(format: string): Promise<{ isValid: boolean; errors: string[] }> {
    const response = await api.post<{ isValid: boolean; errors: string[] }>(`${this.endpoint}/validate-format`, { format });
    return response.data;
  }
}
```

## 3. State Management (with React Query)

```typescript
// hooks/useNumberingTemplates.ts
export const useNumberingTemplates = () => {
  return useQuery({
    queryKey: ['numberingTemplates'],
    queryFn: () => numberingTemplateService.getAll(),
    select: (templates) => groupTemplatesByInvoiceType(templates)
  });
};

export const useCreateNumberingTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: NumberingTemplateForm) => numberingTemplateService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['numberingTemplates'] });
      toast.success(t('numberingTemplate.actions.create.success'));
    },
    onError: (error) => {
      toast.error(t('numberingTemplate.actions.create.error'));
    }
  });
};

export const useUpdateNumberingTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NumberingTemplateForm> }) => 
      numberingTemplateService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['numberingTemplates'] });
      toast.success(t('numberingTemplate.actions.update.success'));
    },
    onError: () => {
      toast.error(t('numberingTemplate.actions.update.error'));
    }
  });
};

export const useDeleteNumberingTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => numberingTemplateService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['numberingTemplates'] });
      toast.success(t('numberingTemplate.actions.delete.success'));
    },
    onError: () => {
      toast.error(t('numberingTemplate.actions.delete.error'));
    }
  });
};

export const useSetAsDefaultTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => numberingTemplateService.setAsDefault(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['numberingTemplates'] });
      toast.success(t('numberingTemplate.actions.setDefault.success'));
    },
    onError: () => {
      toast.error(t('numberingTemplate.actions.setDefault.error'));
    }
  });
};

export const useNumberPreview = (templateData: Partial<NumberingTemplateForm>) => {
  return useQuery({
    queryKey: ['numberPreview', templateData],
    queryFn: () => numberingTemplateService.previewNumber(templateData),
    enabled: !!templateData.format && templateData.format.length > 0,
    refetchOnWindowFocus: false
  });
};
```

## 4. Utility Functions

```typescript
// utils/numberingTemplateUtils.ts
export const INVOICE_TYPE_GROUPS: Record<string, { 
  baseType: InvoiceType; 
  correctionType?: InvoiceType; 
  labelKey: string 
}> = {
  basic: {
    baseType: InvoiceType.Basic,
    correctionType: InvoiceType.BasicCorrection,
    labelKey: 'numberingTemplate.groups.basic'
  },
  advancePayment: {
    baseType: InvoiceType.AdvancePayment,
    correctionType: InvoiceType.AdvancePaymentCorrection,
    labelKey: 'numberingTemplate.groups.advancePayment'
  },
  export: {
    baseType: InvoiceType.Export,
    correctionType: InvoiceType.ExportCorrection,
    labelKey: 'numberingTemplate.groups.export'
  },
  settlement: {
    baseType: InvoiceType.Settlement,
    correctionType: InvoiceType.SettlementCorrection,
    labelKey: 'numberingTemplate.groups.settlement'
  },
  ue: {
    baseType: InvoiceType.Ue,
    correctionType: InvoiceType.UeCorrection,
    labelKey: 'numberingTemplate.groups.ue'
  },
  debitNote: {
    baseType: InvoiceType.DebitNote,
    correctionType: InvoiceType.DebitNoteCorrection,
    labelKey: 'numberingTemplate.groups.debitNote'
  },
  import: {
    baseType: InvoiceType.Import,
    correctionType: InvoiceType.ImportCorrection,
    labelKey: 'numberingTemplate.groups.import'
  },
  proforma: {
    baseType: InvoiceType.Proforma,
    labelKey: 'numberingTemplate.groups.proforma'
  }
};

export const groupTemplatesByInvoiceType = (templates: NumberingTemplate[]): InvoiceTypeGroup[] => {
  const groups: InvoiceTypeGroup[] = [];

  Object.entries(INVOICE_TYPE_GROUPS).forEach(([key, config]) => {
    const baseTemplates = templates.filter(t => t.invoiceType === config.baseType);
    const correctionTemplates = config.correctionType 
      ? templates.filter(t => t.invoiceType === config.correctionType)
      : [];

    groups.push({
      key,
      label: config.labelKey,
      baseType: config.baseType,
      correctionType: config.correctionType,
      templates: {
        base: baseTemplates,
        correction: correctionTemplates
      }
    });
  });

  return groups;
};

export const FORMAT_ELEMENTS: FormatElement[] = [
  { id: 'year4', type: 'year4', value: 'YYYY', placeholder: '2024' },
  { id: 'year2', type: 'year2', value: 'YY', placeholder: '24' },
  { id: 'month', type: 'month', value: 'MM', placeholder: '01' },
  { id: 'number3', type: 'number3', value: 'NNN', placeholder: '001' },
  { id: 'number4', type: 'number4', value: 'NNNN', placeholder: '0001' }
];

export const validateFormat = (format: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Must contain at least one number placeholder
  if (!format.includes('NNN') && !format.includes('NNNN')) {
    errors.push('numberingTemplate.validation.missingNumberPlaceholder');
  }
  
  // Check for invalid placeholders
  const validPlaceholders = ['YYYY', 'YY', 'MM', 'NNN', 'NNNN'];
  const placeholderRegex = /[A-Z]{2,4}/g;
  const foundPlaceholders = format.match(placeholderRegex) || [];
  
  foundPlaceholders.forEach(placeholder => {
    if (!validPlaceholders.includes(placeholder)) {
      errors.push(`numberingTemplate.validation.invalidPlaceholder`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};
```

## 5. Component Architecture

```
pages/NumberingTemplatesPage.tsx
├── components/
│   ├── NumberingTemplatesTabs.tsx
│   ├── InvoiceTypeGroup.tsx
│   │   ├── InvoiceTypeSection.tsx
│   │   │   ├── TemplateList.tsx
│   │   │   │   ├── TemplateCard.tsx
│   │   │   │   └── AddTemplateButton.tsx
│   │   │   └── TemplateFormModal.tsx
│   │   │       ├── FormatBuilder.tsx
│   │   │       │   ├── FormatElementPalette.tsx
│   │   │       │   ├── FormatCanvas.tsx
│   │   │       │   └── FormatPreview.tsx
│   │   │       └── TemplateForm.tsx
│   │   └── DeleteConfirmModal.tsx
│   └── shared/
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── DragAndDrop.tsx
```

## 6. i18n Structure

```json
{
  "numberingTemplate": {
    "title": "Numbering Templates",
    "subtitle": "Manage invoice numbering templates for different invoice types",
    
    "groups": {
      "basic": "Basic Invoices",
      "advancePayment": "Advance Payment",
      "export": "Export",
      "settlement": "Settlement",
      "ue": "EU Sales",
      "debitNote": "Debit Notes", 
      "import": "Import",
      "proforma": "Proforma"
    },
    
    "types": {
      "basic": "Basic Invoice",
      "basic-correction": "Basic Correction",
      "advance-payment": "Advance Payment",
      "advance-payment-correction": "Advance Payment Correction",
      "export": "Export Invoice",
      "export-correction": "Export Correction",
      "settlement": "Settlement Invoice", 
      "settlement-correction": "Settlement Correction",
      "proforma": "Proforma",
      "ue": "EU Sales Invoice",
      "ue-correction": "EU Sales Correction",
      "debit-note": "Debit Note",
      "debit-note-correction": "Debit Note Correction",
      "import": "Import Invoice",
      "import-correction": "Import Correction"
    },
    
    "form": {
      "name": "Template Name",
      "namePlaceholder": "Enter template name",
      "invoiceType": "Invoice Type",
      "format": "Number Format",
      "formatHelp": "Use placeholders: YYYY (year), MM (month), NNN/NNNN (numbers)",
      "nextNumber": "Next Number",
      "resetPeriod": "Reset Period",
      "prefix": "Prefix",
      "suffix": "Suffix",
      "prefixPlaceholder": "Optional prefix",
      "suffixPlaceholder": "Optional suffix"
    },
    
    "resetPeriods": {
      "monthly": "Monthly",
      "yearly": "Yearly", 
      "never": "Never"
    },
    
    "formatBuilder": {
      "title": "Format Builder",
      "palette": "Drag elements to build format",
      "canvas": "Format Pattern",
      "preview": "Preview",
      "elements": {
        "year4": "Year (YYYY)",
        "year2": "Year (YY)", 
        "month": "Month (MM)",
        "number3": "Number (NNN)",
        "number4": "Number (NNNN)",
        "text": "Custom Text"
      }
    },
    
    "actions": {
      "add": "Add Template",
      "edit": "Edit Template", 
      "delete": "Delete Template",
      "setDefault": "Set as Default",
      "clone": "Clone Template",
      "save": "Save",
      "cancel": "Cancel",
      
      "create": {
        "success": "Template created successfully",
        "error": "Failed to create template"
      },
      "update": {
        "success": "Template updated successfully", 
        "error": "Failed to update template"
      },
      "delete": {
        "confirm": "Are you sure you want to delete this template?",
        "confirmDescription": "This action cannot be undone",
        "success": "Template deleted successfully",
        "error": "Failed to delete template"
      },
      "setDefault": {
        "success": "Default template updated successfully",
        "error": "Failed to set default template"
      }
    },
    
    "validation": {
      "nameRequired": "Template name is required",
      "nameMinLength": "Template name must be at least 3 characters",
      "formatRequired": "Format is required",
      "missingNumberPlaceholder": "Format must contain at least one number placeholder (NNN or NNNN)",
      "invalidPlaceholder": "Invalid placeholder found in format",
      "nextNumberMin": "Next number must be greater than 0",
      "nextNumberRequired": "Next number is required"
    },
    
    "states": {
      "noTemplates": "No templates found",
      "addFirstTemplate": "Add your first template",
      "default": "Default",
      "loading": "Loading templates...",
      "error": "Failed to load templates"
    }
  }
}
```

## 7. Implementation Priority

### Phase 1: Core Functionality
1. Basic CRUD operations
2. Simple tabbed interface grouped by invoice type
3. Set as default functionality
4. Basic form validation

### Phase 2: Enhanced UX
1. Format builder with drag & drop
2. Live number preview
3. Template cloning
4. Advanced validation

### Phase 3: Polish
1. Search and filtering
2. Bulk operations
3. Enhanced animations
4. Mobile responsive design

## Next Steps

1. Start with TypeScript types and service layer
2. Implement basic page structure with tabs
3. Create template cards and basic CRUD
4. Add format builder component
5. Implement drag & drop functionality
6. Add comprehensive validation and error handling
