// === Utils === //
import { useAsync } from 'react-async-hook'
import axios from 'axios'

// === Constants === //
import { IMAGE_ROOT } from '@/config/config'

const useABTest = () => {
  const data = useAsync(() => axios.get(`${IMAGE_ROOT}/index.json`, { skipErrorHandler: true }))
  if (data.loading || data.status === 'error') return {}
  return data?.result?.data
}

export default useABTest
