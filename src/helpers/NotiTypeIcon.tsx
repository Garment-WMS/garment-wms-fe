import { FileDown, FileCheck, FileSearch, FileUp, ClipboardList, Files, type LucideIcon } from 'lucide-react'

export type DocumentType = 
  | 'IMPORT_REQUEST'
  | 'IMPORT_RECEIPT'
  | 'INSPECTION_REQUEST'
  | 'MATERIAL_EXPORT_REQUEST'
  | 'MATERIAL_EXPORT_RECEIPT'
  | 'INVENTORY_REPORT'
  | 'ANY'

interface DocumentTypeIconProps {
  type: DocumentType
  className?: string
}

const iconMap: Record<DocumentType, LucideIcon> = {
  IMPORT_REQUEST: FileDown,
  IMPORT_RECEIPT: FileCheck,
  INSPECTION_REQUEST: FileSearch,
  MATERIAL_EXPORT_REQUEST: FileUp,
  MATERIAL_EXPORT_RECEIPT: FileCheck,
  INVENTORY_REPORT: ClipboardList,
  ANY: Files
}

export function NotiTypeIcon({ type, className }: DocumentTypeIconProps) {
  const Icon = iconMap[type]
  return <Icon className={className} />
}

