'use client'  

import { useMemo } from 'react';

//import { useTranslation } from 'next-i18next';
import { useTranslation } from 'next-export-i18n';

import { ErrorMessage } from '@/types/error';

const useErrorService = () => {
  const { t } = useTranslation();

  return {
    getModelsError: useMemo(
      () => (error: any) => {
        return !error
          ? null
          : ({
              title: t('chat.Error_fetching_models'),
              code: error.status || 'unknown',
              messageLines: error.statusText
                ? [error.statusText]
                : [
                    t(
                      'chat.Make_sure_your_OpenAI_API_key_is_set_in_the_bottom_left_of_the_sidebar',
                    ),
                    t(
                      'chat.If_you_completed_this_step_OpenAI_may_be_experiencing_issues',
                    ),
                  ],
            } as ErrorMessage);
      },
      [t],
    ),
  };
};

export default useErrorService;
