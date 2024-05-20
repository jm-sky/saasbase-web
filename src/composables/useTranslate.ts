import startCase from 'lodash/startCase';
import { useI18n } from 'vue-i18n';

export const useTranslate = () => {
  const { t, te } = useI18n();

  const tr = (text: string): string => {
    if (te(text)) return t(text);

    return startCase(text);
  };

  return tr;
};
