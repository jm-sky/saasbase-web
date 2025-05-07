import startCase from 'lodash-es/startCase'
import { useI18n } from 'vue-i18n'

export const useTranslate = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { t, te } = useI18n()

  const tr = (text: string): string => {
    if (te(text)) return t(text)

    return startCase(text.split('.').at(-1))
  }

  return tr
}
