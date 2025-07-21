export const forceDownloadFile = async (url: string, filename?: string) => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const blob = await response.blob()

    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl

    const finalFilename = filename || url.split('/').pop() || 'download'
    link.download = finalFilename

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Download failed:', error)
    window.open(url, '_blank')
  }
}

export const extractFilename = (url: string): string => {
  return url.split('/').pop()?.split('?')[0] || 'attachment'
}
