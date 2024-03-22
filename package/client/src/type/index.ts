export interface LayerType {
  title: string
  key: string
  type: string
  style: string
  group: boolean
  children: LayerType[]
  input: boolean
}

export interface AntdTreeInterface {
  title: string | JSX.Element
  key: string
  children: AntdTreeInterface[]
}

export interface DataQueryHookInterface<T> {
  status: 'pending' | 'error' | 'success'
  data: T | null
  error: string | null
}
