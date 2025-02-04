import React, { useMemo } from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { FormIdentifier, IConfigurableFormComponent } from '../../../../providers/form/models';
import { EllipsisOutlined } from '@ant-design/icons';
import ConfigurableFormItem from '../formItem';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { EntityPicker } from '../../..';
import { Alert } from 'antd';
import { useForm } from '../../../../providers';
import { DataTypes } from '../../../../interfaces/dataTypes';
import { IConfigurableColumnsProps } from '../../../../providers/datatableColumnsConfigurator/models';
import { migrateV0toV1 } from './migrations/migrate-v1';
import { ITableViewProps } from '../../../../providers/tableViewSelectorConfigurator/models';
import { entityPickerSettings } from './settingsForm';
import { migrateDynamicExpression } from 'designer-components/_common-migrations/migrateUseExpression';

export interface IEntityPickerComponentProps extends IConfigurableFormComponent {
  placeholder?: string;
  items: IConfigurableColumnsProps[];
  hideBorder?: boolean;
  disabled?: boolean;
  useRawValues?: boolean;
  mode?: 'single' | 'multiple' | 'tags';
  entityType: string;
  filters?: object;
  title?: string;
  displayEntityKey?: string;
  allowNewRecord?: boolean;
  modalFormId?: FormIdentifier;
  modalTitle?: string;
  showModalFooter?: boolean;
  onSuccessRedirectUrl?: string;
  submitHttpVerb?: 'POST' | 'PUT';
  modalWidth?: number | string | 'custom';
  customWidth?: number;
  widthUnits?: string;
}

const EntityPickerComponent: IToolboxComponent<IEntityPickerComponentProps> = {
  type: 'entityPicker',
  isInput: true,
  isOutput: true,
  name: 'Entity Picker',
  icon: <EllipsisOutlined />,
  dataTypeSupported: ({ dataType }) => dataType === DataTypes.entityReference,
  factory: (model: IEntityPickerComponentProps) => {
    const { filters, modalWidth, customWidth, widthUnits } = model;
    const { formMode, isComponentDisabled } = useForm();

    const isReadOnly = model.readOnly || formMode === 'readonly';

    const disabled = isComponentDisabled(model);

    if (formMode === 'designer' && !model.entityType) {
      return (
        <Alert
          showIcon
          message="EntityPicker not configured properly"
          description="Please make sure that you've specified 'entityType' property."
          type="warning"
        />
      );
    }

    const entityPickerFilter = useMemo<ITableViewProps[]>(() => {
      return [
        {
          defaultSelected: true,
          expression: { ...filters },
          id: 'uZ4sjEhzO7joxO6kUvwdb',
          name: 'entity Picker',
          selected: true,
          sortOrder: 0,
        },
      ];
    }, [filters]);

    const width = modalWidth === 'custom' && customWidth ? `${customWidth}${widthUnits}` : modalWidth;

    return (
      <ConfigurableFormItem model={model} initialValue={model.defaultValue}>
        <EntityPicker
          formId={model.id}
          disabled={disabled}
          readOnly={isReadOnly}
          displayEntityKey={model.displayEntityKey}
          entityType={model.entityType}
          filters={entityPickerFilter}
          useRawValues={model.useRawValues}
          mode={model.mode}
          addNewRecordsProps={
            model.allowNewRecord
              ? {
                modalFormId: model.modalFormId,
                modalTitle: model.modalTitle,
                showModalFooter: model.showModalFooter,
                submitHttpVerb: model.submitHttpVerb,
                onSuccessRedirectUrl: model.onSuccessRedirectUrl,
                modalWidth: customWidth ? `${customWidth}${widthUnits}` : modalWidth,
              }
              : undefined
          }
          name={model?.name}
          width={width}
          configurableColumns={model.items ?? []}
        />
      </ConfigurableFormItem>
    );
  },
  migrator: m =>
    m
      .add<IEntityPickerComponentProps>(0, prev => {
        return {
          ...prev,
          items: prev['items'] ?? [],
          mode: prev['mode'] ?? 'single',
          entityType: prev['entityType'],
        };
      })
      .add<IEntityPickerComponentProps>(1, migrateV0toV1)
      .add<IEntityPickerComponentProps>(2, prev => {
        return { ...prev, useRawValues: true };
      })
      .add<IEntityPickerComponentProps>(3, prev => {
        const result = { ...prev };
        const useExpression = Boolean(result['useExpression']);
        delete result['useExpression'];

        if (useExpression) {
          const migratedExpression = migrateDynamicExpression(prev.filters);
          result.filters = migratedExpression;
        }

        return result;
      }),
  settingsFormMarkup: entityPickerSettings,
  validateSettings: model => validateConfigurableComponentSettings(entityPickerSettings, model),
  linkToModelMetadata: (model, metadata): IEntityPickerComponentProps => {
    return {
      ...model,
      entityType: metadata.entityType,
      useRawValues: true,
    };
  },
};

export default EntityPickerComponent;
