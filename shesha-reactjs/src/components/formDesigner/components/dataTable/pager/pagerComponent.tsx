import { IToolboxComponent } from '../../../../../interfaces';
import { IConfigurableFormComponent } from '../../../../../providers/form/models';
import { ControlOutlined } from '@ant-design/icons';
import { getSettings } from './settingsForm';
import { ITablePagerProps, TablePager, useFormComponentStatesHelpers } from '../../../../../';
import React from 'react';
import { validateConfigurableComponentSettings } from '../../../../../providers/form/utils';

export interface IPagerComponentProps extends ITablePagerProps, IConfigurableFormComponent {}

const PagerComponent: IToolboxComponent<IPagerComponentProps> = {
  type: 'datatable.pager',
  name: 'Table Pager',
  icon: <ControlOutlined />,
  factory: (model: IPagerComponentProps) => {
    const { isComponentHidden } = useFormComponentStatesHelpers();

    if (isComponentHidden(model)) return null;

    return <TablePager {...model} />;
  },
  initModel: (model: IPagerComponentProps) => {
    return {
      ...model,
      showSizeChanger: true,
      showTotalItems: true,
      defaultPageSize: 10,
      items: [],
    };
  },
  settingsFormMarkup: context => getSettings(context),
  validateSettings: model => validateConfigurableComponentSettings(getSettings(model), model),
};

export default PagerComponent;
