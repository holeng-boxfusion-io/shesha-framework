import React from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import { GroupOutlined } from '@ant-design/icons';
import ComponentsContainer, { ICommonContainerProps } from '../../componentsContainer';
import { getStyle, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { getSettings } from './settingsForm';
import { useFormData } from '../../../../providers';
import { useFormComponentStatesHelpers } from '../../../../providers/form/useFormComponentStatesHelpers';

export type ContainerDirection = 'horizontal' | 'vertical';

export interface IContainerComponentProps extends IConfigurableFormComponent, ICommonContainerProps {
  className?: string;
  wrapperStyle?: string;
  components: IConfigurableFormComponent[]; // Only important for fluent API
}

const ContainerComponent: IToolboxComponent<IContainerComponentProps> = {
  type: 'container',
  name: 'Container',
  icon: <GroupOutlined />,
  factory: (model: IContainerComponentProps) => {
    const { data: formData } = useFormData();
    const { isComponentHidden } = useFormComponentStatesHelpers();

    if (isComponentHidden(model)) return null;

    const flexAndGridStyles: ICommonContainerProps = {
      display: model?.display,
      flexDirection: model?.flexDirection,
      direction: model?.direction,
      justifyContent: model?.justifyContent,
      alignItems: model?.alignItems,
      alignSelf: model?.alignSelf,
      justifyItems: model?.justifyItems,
      textJustify: model?.textJustify,
      justifySelf: model?.justifySelf,
      noDefaultStyling: model?.noDefaultStyling,
      gridColumnsCount: model?.gridColumnsCount,
      flexWrap: model?.flexWrap,
      gap: model?.gap,
    };

    return (
      <ComponentsContainer
        containerId={model.id}
        {...flexAndGridStyles}
        // display={model?.display}
        // direction={model.direction}
        // justifyContent={model.direction === 'horizontal' ? model?.justifyContent : null}
        // alignItems={model.direction === 'horizontal' ? model?.alignItems : null}
        // justifyItems={model.direction === 'horizontal' ? model?.justifyItems : null}
        className={model.className}
        wrapperStyle={getStyle(model?.wrapperStyle, formData)}
        style={getStyle(model?.style, formData)}
        dynamicComponents={model?.isDynamic ? model?.components?.map(c => ({ ...c, readOnly: model?.readOnly })) : []}
      />
    );
  },
  settingsFormMarkup: data => getSettings(data),
  validateSettings: model => validateConfigurableComponentSettings(getSettings(model), model),
  initModel: (model: IContainerComponentProps) => {
    const customProps: IContainerComponentProps = {
      ...model,
      direction: 'vertical',
      justifyContent: 'left',
      display: 'block',
      flexWrap: 'wrap',
    };

    return customProps;
  },
};

export default ContainerComponent;
