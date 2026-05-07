'use client'
import { Editor } from '@tinymce/tinymce-react'
import type { IAllProps } from '@tinymce/tinymce-react'

export type TinyProps = IAllProps

export default function TinyEditor(props: TinyProps) {
  return <Editor {...props} />
}