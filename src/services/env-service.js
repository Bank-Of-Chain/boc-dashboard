import isEqual from 'lodash/isEqual'

export const isProEnv = env => {
  return isEqual(env, 'pr-sg')
}
