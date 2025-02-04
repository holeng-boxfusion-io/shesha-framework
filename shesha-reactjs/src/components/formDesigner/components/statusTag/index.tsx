import { ArrowsAltOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import React from 'react';
import { useGlobalState, useFormData } from '../../../../providers';
import { evaluateString, validateConfigurableComponentSettings } from '../../../../formDesignerUtils';
import { IConfigurableFormComponent, IToolboxComponent } from '../../../../interfaces/formDesigner';
import { useForm } from '../../../../providers/form';
import { executeCustomExpression } from '../../../../providers/form/utils';
import StatusTag, { DEFAULT_STATUS_TAG_MAPPINGS, IStatusTagProps as ITagProps } from '../../../statusTag';
import ConfigurableFormItem from '../formItem';
import { getSettings } from './settings';
import ConditionalWrap from 'components/conditionalWrapper';

export interface IStatusTagProps extends Omit<ITagProps, 'mappings' | 'style'>, IConfigurableFormComponent {
  colorCodeEvaluator?: string;
  overrideCodeEvaluator?: string;
  valueCodeEvaluator?: string;
  mappings?: string;
  valueSource?: 'form' | 'manual';
}

const StatusTagComponent: IToolboxComponent<IStatusTagProps> = {
  type: 'statusTag',
  name: 'Status Tag',
  isInput: true,
  icon: <ArrowsAltOutlined />,
  factory: (model: IStatusTagProps) => {
    const { formMode } = useForm();
    const { globalState } = useGlobalState();
    const { data } = useFormData();

    console.log('LOG:: StatusTagComponent data', data);
    console.log('LOG:: StatusTagComponent globalState', globalState);
    console.log('LOG:: StatusTagComponent formMode', formMode);
    console.log('LOG:: StatusTagComponent model', model);

    const getExpressionExecutor = (expression: string) => {
      if (!expression) {
        return null;
      }

      // tslint:disable-next-line:function-constructor
      const func = new Function('data', 'formMode', expression);

      return func(data, formMode);
    };

    const { colorCodeEvaluator, overrideCodeEvaluator, valueCodeEvaluator, override, value, color } = model;

    const allEmpty =
      [colorCodeEvaluator, overrideCodeEvaluator, valueCodeEvaluator, override, value, color].filter(Boolean)
        ?.length === 0;

    const getValueByExpression = (expression: string = '') => {
      return expression?.includes('{{') ? evaluateString(expression, data) : expression;
    };

    if (allEmpty) {
      return <Alert type="info" message="Status tag not configured properly" />;
    }

    const evaluatedOverrideByExpression = getValueByExpression(override);
    const localValueByExpression = getValueByExpression(value as string);
    const localColorByExpression = getValueByExpression(color);

    const computedColorByCode = getExpressionExecutor(colorCodeEvaluator) || '';
    const computedOverrideByCode = getExpressionExecutor(overrideCodeEvaluator) || '';
    const computedValueByCode = getExpressionExecutor(valueCodeEvaluator) || '';

    const allEvaluationEmpty =
      [
        evaluatedOverrideByExpression,
        localValueByExpression,
        localColorByExpression,
        computedColorByCode,
        computedOverrideByCode,
        computedValueByCode,
      ].filter(Boolean)?.length === 0;

    const getParsedMappings = () => {
      try {
        return JSON.parse(model?.mappings);
      } catch (error) {
        return null;
      }
    };

    const props: ITagProps = {
      override: computedOverrideByCode || evaluatedOverrideByExpression,
      // value: computedValue || localValueByExpression,
      value: allEvaluationEmpty ? 1000 : computedValueByCode || localValueByExpression,
      color: computedColorByCode || localColorByExpression,
      mappings: getParsedMappings(),
    };

    const isVisibleByCondition = executeCustomExpression(model.customVisibility, true, data, globalState);

    if (!isVisibleByCondition && formMode !== 'designer') return null;

    return (
      <ConditionalWrap
        condition={model?.valueSource === 'form'}
        wrap={(children) => <ConfigurableFormItem model={model}>{children}</ConfigurableFormItem>}
      >
        <StatusTag {...props} />
      </ConditionalWrap>
    );
  },
  settingsFormMarkup: getSettings(),
  validateSettings: (model) => validateConfigurableComponentSettings(getSettings(), model),
  migrator: (m) =>
    m.add<IStatusTagProps>(0, (prev) => ({
      ...prev,
      valueSource: 'manual',
      value: null,
      color: null,
    })),
  initModel: (model) => ({
    mappings: JSON.stringify(DEFAULT_STATUS_TAG_MAPPINGS, null, 2) as any,
    ...model,
  }),
};

export default StatusTagComponent;
