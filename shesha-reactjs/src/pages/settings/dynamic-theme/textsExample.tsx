import React, { FC } from 'react';
import { Space, Typography } from 'antd';
import { GenericText } from '../../../components/formDesigner/components/text/typography';

const TextsExample: FC = () => {
  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <GenericText textType={'span'}>Default text</GenericText>

      <GenericText textType={'span'} contentType="secondary">
        Secondary text
      </GenericText>

      <Typography.Link>Link text</Typography.Link>
    </Space>
  );
};

export default TextsExample;
