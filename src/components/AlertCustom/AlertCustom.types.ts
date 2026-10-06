import { ReactNode } from 'react'

export interface IAlert {
  isVisible: boolean
  variant?: string
  titulo?: ReactNode
  children?: ReactNode
}
