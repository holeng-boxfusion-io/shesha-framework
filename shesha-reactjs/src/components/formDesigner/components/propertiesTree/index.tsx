import React from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import { NodeExpandOutlined } from '@ant-design/icons';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { MetadataProvider, useForm } from '../../../../providers';
import { getSettings } from './settings';
import PropertiesTree from './tree';
import ConfigurableFormItem from '../formItem';

export interface IPropertiesTreeProps extends IConfigurableFormComponent {
  entityType: { id: string };
  // entityType: string;
}

const PropertiesTreeComponent: IToolboxComponent<IPropertiesTreeProps> = {
  type: 'propertiesTree',
  name: 'Properties Tree',
  icon: <NodeExpandOutlined />,
  factory: (model: IPropertiesTreeProps) => {
    const { isComponentHidden } = useForm();

    const isHidden = isComponentHidden(model);

    if (isHidden) return null;

    const modelType = model?.entityType?.id || 'Shesha.Core.Person';
    // const entityType = model?.entityType || 'Shesha.Core.Person';

    // if (modelType) {
    //   return (
    //     <MetadataProvider modelType={modelType}>
    //       <PropertiesTree entityType={modelType} />
    //     </MetadataProvider>
    //   );
    // }

    return (
      <ConfigurableFormItem model={{ ...model, hideLabel: true }}>
        <PropertiesTree entityType={modelType} />
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: data => getSettings(data),
  validateSettings: model => validateConfigurableComponentSettings(getSettings(model), model),
};

export default PropertiesTreeComponent;
