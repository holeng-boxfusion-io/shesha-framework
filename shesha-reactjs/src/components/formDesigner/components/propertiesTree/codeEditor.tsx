import React, { FC } from 'react';
import CodeEditor from '../codeEditor/codeEditor';

interface IPropertiesCodeProps {
  value?: string;
}

const PropertiesCode: FC<IPropertiesCodeProps> = ({ value }) => {
  return (
    <CodeEditor
      readOnly
      value={value}
      language="graphqlschema"
      mode="inline"
      name="propertiesCode"
      type={''}
      id={''}
      label=""
      description="This is the GQL Query that will be sent to the server"
    />
  );
};

PropertiesCode.displayName = 'PropertiesCode';

export { PropertiesCode };

export default PropertiesCode;
