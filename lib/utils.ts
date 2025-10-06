type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[]
  | Record<string, boolean | undefined | null>

function toVal(mix: ClassValue): string {
  let str = ""

  if (typeof mix === "string" || typeof mix === "number") {
    str += mix
  } else if (typeof mix === "object") {
    if (Array.isArray(mix)) {
      for (let k = 0; k < mix.length; k++) {
        if (mix[k]) {
          const y = toVal(mix[k])
          if (y) {
            str && (str += " ")
            str += y
          }
        }
      }
    } else {
      for (const k in mix) {
        if (mix[k]) {
          str && (str += " ")
          str += k
        }
      }
    }
  }

  return str
}

function clsx(...inputs: ClassValue[]): string {
  let str = ""
  for (let i = 0; i < inputs.length; i++) {
    const tmp = inputs[i]
    if (tmp) {
      const x = toVal(tmp)
      if (x) {
        str && (str += " ")
        str += x
      }
    }
  }
  return str
}

function twMerge(...classLists: string[]): string {
  const classes = classLists.join(" ").split(" ").filter(Boolean)
  const classMap = new Map<string, string>()

  for (const cls of classes) {
    // Extract the prefix (e.g., 'text', 'bg', 'p', 'mt')
    const match = cls.match(/^([a-z]+)-/)
    const prefix = match ? match[1] : cls

    // Store the class, overwriting previous ones with the same prefix
    classMap.set(prefix, cls)
  }

  return Array.from(classMap.values()).join(" ")
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs))
}

export type { ClassValue }

type VariantConfig = Record<string, Record<string, string>>
type CompoundVariant = Record<string, string | boolean> & { class: string }

interface CVAOptions {
  variants?: VariantConfig
  defaultVariants?: Record<string, string>
  compoundVariants?: CompoundVariant[]
}

export function cva(base: string, options?: CVAOptions) {
  return (props?: Record<string, string | boolean | undefined> & { className?: string }) => {
    if (!options) return cn(base, props?.className)

    const { variants, defaultVariants, compoundVariants } = options
    const classes: string[] = [base]

    if (variants) {
      for (const [variantKey, variantValue] of Object.entries(variants)) {
        const value = props?.[variantKey] ?? defaultVariants?.[variantKey]
        if (value && typeof value === "string") {
          classes.push(variantValue[value] || "")
        }
      }
    }

    if (compoundVariants) {
      for (const compound of compoundVariants) {
        let matches = true
        for (const [key, value] of Object.entries(compound)) {
          if (key === "class") continue
          if (props?.[key] !== value) {
            matches = false
            break
          }
        }
        if (matches) {
          classes.push(compound.class)
        }
      }
    }

    return cn(...classes, props?.className)
  }
}

export type VariantProps<T extends (...args: any) => any> = Partial<Record<string, string | boolean | undefined>>
