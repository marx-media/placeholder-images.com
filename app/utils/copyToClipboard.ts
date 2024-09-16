export const copyToClipboard = async (text: string): Promise<void> => {
  const toast = useToast()
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      toast.add({ title: 'Copied to clipboard', timeout: 2000 })
    } catch (err) {
      console.error('Failed to copy text to clipboard', err)
    }
  } else {
    console.error('Clipboard API is not supported in this browser.')
  }
}
