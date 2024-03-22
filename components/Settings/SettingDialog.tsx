import { FC, useContext, useEffect, useReducer, useRef } from 'react';


//import { useTranslation } from 'next-i18next';
import { useTranslation } from 'next-export-i18n';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { getSettings, saveSettings } from '@/utils/app/settings';

import { Settings } from '@/types/settings';

import { changeTheme } from '@/services/theme';

import HomeContext from '@/pages/api/home/home.context';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const SettingDialog: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const settings: Settings = getSettings();
  const { state, dispatch } = useCreateReducer<Settings>({
    initialState: settings,
  });
  const { dispatch: homeDispatch } = useContext(HomeContext);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        window.addEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      window.removeEventListener('mouseup', handleMouseUp);
      onClose();
    };

    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [onClose]);

  const handleSave = () => {
    changeTheme(homeDispatch, state.theme);
    homeDispatch({ field: 'apiHost', value: state.apiHost });
    saveSettings(state);
  };

  const handleRestore = () => {
    state.apiHost = 'https://api-chat.observerkei.top';
    homeDispatch({ field: 'apiHost', value: state.apiHost });
    saveSettings(state);
  };

  // Render nothing if the dialog is not open.
  if (!open) {
    return <></>;
  }

  // Render the dialog.
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="fixed inset-0 z-10 overflow-hidden">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          />

          <div
            ref={modalRef}
            className="dark:border-netural-400 inline-block max-h-[400px] transform overflow-y-auto rounded-lg border border-gray-300 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#202123] sm:my-8 sm:max-h-[600px] sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
            role="dialog"
          >
            <div className="text-lg pb-4 font-bold text-black dark:text-neutral-200">
              {t('settings.Settings')}
            </div>

            <div className="text-sm font-bold mb-2 text-black dark:text-neutral-200">
              {t('settings.Theme')}
            </div>

            <select
              className="w-full rounded-lg shadow cursor-pointer p-2 text-neutral-700 bg-transparent dark:text-neutral-200 "
              value={state.theme}
              onChange={(event) =>
                dispatch({ field: 'theme', value: event.target.value })
              }
            >
              <option className='dark:bg-neutral-800' value="system-default">{t('settings.System_default')}</option>
              <option className='dark:bg-neutral-800' value="dark">{t('settings.Dark_mode')}</option>
              <option className='dark:bg-neutral-800' value="light">{t('settings.Light_mode')}</option>
            </select>

            <div className="text-sm pt-2 mb-2 p-2items-center w-full ">

              <div className="text-sm  font-bold mb-2 text-black dark:text-neutral-200">
                {t('settings.API_Host')}
              </div>

              <div className="flex items-center flex-grow">
                <input
                  className="w-full cursor-pointer  rounded-lg shadow  bg-transparent p-2 text-neutral-700 dark:text-neutral-200"
                  value={state.apiHost}
                  onChange={(event) =>
                    dispatch({ field: 'apiHost', value: event.target.value })
                  }
                />

                <button
                  type="button"
                  className="px-4 py-2 rounded-lg shadow  text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:hover:text-black dark:border-neutral-800 dark:border-opacity-50 dark:bg-back dark:text-white dark:hover:bg-neutral-300 ml-2"
                  onClick={handleRestore}
                >
                  ⟳
                </button>
              </div>
            </div>

            <button
              type="button"
              className="w-full px-4 py-2 mt-6 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
              onClick={() => {
                handleSave();
                onClose();
              }}
            >
              {t('settings.Save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
