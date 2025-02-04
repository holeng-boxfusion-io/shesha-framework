import React from 'react';
import { Story, Meta } from '@storybook/react';
import FormDesigner from './formDesigner';
import { MetadataDispatcherProvider } from '../../providers';
import { addStory } from '../../stories/utils';
import { FormIdentifier, FormMode } from '../../providers/form/models';
import StoryApp from '../storyBookApp';

export default {
  title: 'Components/Temp/FormDesigner',
  component: FormDesigner,
} as Meta;

export interface IFormDesignerStoryProps {
  formId: FormIdentifier;
  mode?: FormMode;
}

// Create a master template for mapping args to render the Button component
const DesignerTemplate: Story<IFormDesignerStoryProps> = ({ formId }) => (
  <StoryApp>
    <MetadataDispatcherProvider>
      <FormDesigner formId={formId} />
    </MetadataDispatcherProvider>
  </StoryApp>
);

export const TestMap = addStory(DesignerTemplate, {
  formId: 'a91902be-ca79-4230-a7a5-9084db9b2295',
  // formId: {
  //   name: 'test-wizard-form',
  //   module: 'Shesha',
  // },
  // mode: 'readonly',
});

export const OrderDetails = addStory(DesignerTemplate, {
  formId: 'a9624689-59f5-45fd-9185-c82037b8fe25',
});

export const ColumnSettings = addStory(DesignerTemplate, {
  formId: 'e56015be-ea87-4d6a-8f67-d69462d4a94e',
});

export const BedFilter = addStory(DesignerTemplate, {
  formId: '7065cf3a-a8ec-494e-b2c8-273274b86d1f',
});

export const CustomFunctions = addStory(DesignerTemplate, {
  formId: '30c5cd95-e96d-4023-b213-94b1531ec6d9',
});

export const FormDetails = addStory(DesignerTemplate, {
  formId: 'ac80013a-c02b-433b-b813-877422747a74',
});

export const FormsIndex = addStory(DesignerTemplate, {
  formId: {
    name: 'forms',
    module: 'shesha',
  },
});

export const OrganisationEdit = addStory(DesignerTemplate, {
  formId: {
    name: 'organisation-edit',
    module: 'Test Module',
    version: 1,
  },
});

export const PersonEdit = addStory(DesignerTemplate, {
  formId: {
    name: 'person-edit',
    module: 'Test Module',
    version: 7
  }
});

export const PersonDetails = addStory(DesignerTemplate, {
  formId: {
    name: 'person-details',
    module: 'Test Module',
    version: 1
  }
});

export const PermissionEdit = addStory(DesignerTemplate, {
  formId: 'AFF750FD-1AC6-45C9-B478-B98DB7DE8CD0'
  /*{
    name: 'permission-edit',
    module: 'Test Module'
  }*/
});

export const DatatableInlineEdit = addStory(DesignerTemplate, {
  formId: 'd9e57701-5328-4395-8d71-580fd21d2d0e'
});

export const TableLayout = addStory(DesignerTemplate, {
  formId: '27961719-f092-4c9c-9617-1af59f1e3c11'
});

export const IdBug = addStory(DesignerTemplate, {
  formId: '26a5e494-a632-468e-aec8-401a192c56f0'
});

export const InMemoryTable = addStory(DesignerTemplate, {
  formId: 'c2773e2b-6cd8-4892-ad30-7b92e5132229'
});

export const TableProps = addStory(DesignerTemplate, {
  formId: 'e9f6a715-cbe2-42c0-844f-fe97b5b8f476'
});

//TestModule/ivan-test-form
export const IvanTestForm = addStory(DesignerTemplate, {
  formId: 'b752f15b-5a26-4c22-9ea1-8ec8b6b4ce5d'
});

