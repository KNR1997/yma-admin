import Label from '@/components/ui/label';
import Select from '@/components/ui/select/select';
import { gradeOptions } from '@/constants';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ActionMeta } from 'react-select';

type Props = {
  onGradeFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  className?: string;
  enableGrade?: boolean;
};

export default function CourseFilter({
  onGradeFilter,
  className,
  enableGrade,
}: Props) {
  const { locale } = useRouter();
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0',
        className,
      )}
    >
      {enableGrade && (
        <div className="w-full">
          <Label>{t('common:filter-by-group')}</Label>
          <Select
            options={gradeOptions}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.value}
            placeholder={t('common:filter-by-group-placeholder')}
            onChange={onGradeFilter}
            isClearable={true}
          />
        </div>
      )}
    </div>
  );
}
