import { FC, useContext, useState } from 'react';


//import { useTranslation } from 'next-i18next';
import { useTranslation } from 'next-export-i18n';

import { DEFAULT_TEMPERATURE } from '@/utils/app/const';

import HomeContext from '@/pages/api/home/home.context';

interface Props {
  label: string;
  onChangeTemperature: (temperature: number) => void;
}

export const TemperatureSlider: FC<Props> = ({
  label,
  onChangeTemperature,
}) => {
  const {
    state: { conversations },
  } = useContext(HomeContext);
  const lastConversation = conversations[conversations.length - 1];
  const [temperature, setTemperature] = useState(
    lastConversation?.temperature ?? DEFAULT_TEMPERATURE,
  );
  const { t } = useTranslation();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setTemperature(newValue);
    onChangeTemperature(newValue);
  };

  return (
    <div className="flex flex-col">
      <label className="mb-2 text-left text-neutral-700 dark:text-neutral-400">
        {label}
      </label>
      <span className="text-[12px] text-black/50 dark:text-white/50 text-sm">
        {t(
          'chat.Higher_values_like_0_8_will_make_the_output_more_random_while_lower_values_like_0_2_will_make_it_more_focused_and_deterministic',
        )}
      </span>
      <span className="mt-2 mb-1 text-center text-neutral-900 dark:text-neutral-100">
        {temperature.toFixed(1)}
      </span>
      <input
        className="cursor-pointer"
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={temperature}
        onChange={handleChange}
      />
      <ul className="w mt-2 pb-8 flex justify-between px-[24px] text-neutral-900 dark:text-neutral-100">
        <li className="flex justify-center">
          <span className="absolute">{t('chat.Precise')}</span>
        </li>
        <li className="flex justify-center">
          <span className="absolute">{t('chat.Neutral')}</span>
        </li>
        <li className="flex justify-center">
          <span className="absolute">{t('chat.Creative')}</span>
        </li>
      </ul>
    </div>
  );
};
