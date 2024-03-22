import { IconRefresh } from '@tabler/icons-react';
import { FC } from 'react';


//import { useTranslation } from 'next-i18next';
import { useTranslation } from 'next-export-i18n';

interface Props {
  onRegenerate: () => void;
}

export const Regenerate: FC<Props> = ({ onRegenerate }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed bottom-4 left-0 right-0 ml-auto mr-auto w-full px-2 sm:absolute sm:bottom-8 sm:left-[280px] sm:w-1/2 lg:left-[200px]">
      <div className="mb-4 text-center text-red-500">
        {t('chat.Sorry_there_was_an_error')}
      </div>
      <button
        className="flex h-12 gap-2 w-full items-center justify-center rounded-lg border border-b-neutral-300 bg-neutral-100 text-sm font-semibold text-neutral-500 dark:border-none dark:bg-[#252525] dark:text-neutral-200"
        onClick={onRegenerate}
      >
        <IconRefresh />
        <div>{t('chat.Regenerate_response')}</div>
      </button>
    </div>
  );
};
