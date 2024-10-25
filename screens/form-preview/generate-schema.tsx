import { z, ZodTypeAny } from 'zod'
import { FormFieldType } from '@/types'

type FormFieldOrGroup = FormFieldType | FormFieldType[]

export const generateZodSchema = (
  formFields: FormFieldOrGroup[],
): z.ZodObject<any> => {
  const schemaObject: Record<string, z.ZodTypeAny> = {}

  const processField = (field: FormFieldType): void => {
    if (field.variant === 'Label') return

    let fieldSchema: z.ZodTypeAny

    switch (field.variant) {
      case 'Checkbox':
        fieldSchema = z.boolean().default(true)
        break
      case 'Date Picker':
        fieldSchema = z.coerce.date()
        break
      case 'Input':
        if (field.type === 'email') {
          fieldSchema = z.string().email()
        } else if (field.type === 'number') {
          fieldSchema = z.coerce.number()
        } else {
          fieldSchema = z.string()
        }
        break
      case 'Slider':
        fieldSchema = z.coerce.number()
      case 'Number':
        fieldSchema = z.coerce.number()
        break
      case 'Switch':
        fieldSchema = z.boolean()
        break
      case 'Tags Input':
      case 'Multi Select':
        fieldSchema = z
          .array(z.string())
          .nonempty('Please select at least one item')
        break
      default:
        fieldSchema = z.string()
    }

    if (field.min !== undefined && 'min' in fieldSchema) {
      fieldSchema = (fieldSchema as any).min(
        field.min,
        `Must be at least ${field.min}`,
      )
    }
    if (field.max !== undefined && 'max' in fieldSchema) {
      fieldSchema = (fieldSchema as any).max(
        field.max,
        `Must be at most ${field.max}`,
      )
    }

    if (field.required !== true) {
      fieldSchema = fieldSchema.optional()
    }

    schemaObject[field.name] = fieldSchema as ZodTypeAny
  }

  formFields.flat().forEach(processField)

  return z.object(schemaObject)
}
