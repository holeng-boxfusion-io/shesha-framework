import { nanoid } from 'nanoid/non-secure';
import { DesignerToolbarSettings } from '../../../../interfaces/toolbarSettings';

export const getSettings = (data: any) =>
  new DesignerToolbarSettings(data)
    .addSectionSeparator({
      id: 'b8954bf6-f76d-4139-a850-c99bf06c8b69',
      name: 'separator1',
      parentId: 'root',
      label: 'Display',
      title: '',
    })
    .addPropertyAutocomplete({
      id: '5c813b1a-04c5-4658-ac0f-cbcbae6b3bd4',
      name: 'name',
      parentId: 'root',
      label: 'Name',
      validate: { required: true },
    })
    .addSectionSeparator({
      id: 'b8954bf6-f76d-4139-a850-c99bf06c8b69',
      name: 'separator1',
      parentId: 'root',
      label: 'Display',
      title: '',
    })
    .addAutocomplete({
      id: nanoid(),
      name: 'entityType',
      label: 'Entity Type',
      dataSourceType: 'url',
      dataSourceUrl: '/api/services/app/Metadata/TypeAutocomplete',
      useRawValues: false,
    })
    .addTextArea({
      id: '03959ffd-cadb-496c-bf6d-b742f7f6edc6',
      name: 'customVisibility',
      parentId: 'root',
      label: 'Custom Visibility',
      autoSize: false,
      showCount: false,
      allowClear: false,
      description:
        'Enter custom visibility code.  You must return true to show the component. The global variable data is provided, and allows you to access the data of any form component, by using its API key.',
    })
    .toJson();
