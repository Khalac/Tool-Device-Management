import axios from 'axios'
export const urlToFile = async (url: string) => {
  try {
    let response = await axios.get(url, { responseType: 'blob' })
    const name = url.split('/').pop() || 'downloaded_file'
    const blob = response.data
    const file = new File([blob], name, { type: blob.type })
    return file
  } catch (error) {
    throw new Error(`Failed to fetch file from URL: ${url}`)
  }
}
