// === Utils === //
import { useAsync } from 'react-async-hook'
import { request } from 'umi'

const useABTest = () => {
  const data = useAsync(() => request(`${IMAGE_ROOT}/index.json`))
  if (data.loading || data.status === 'error') return {}
  return data?.result?.data
}

export default useABTest
