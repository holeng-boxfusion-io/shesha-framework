import { Input, Tabs, Tree } from 'antd';
import _ from 'lodash';
import React, { useMemo } from 'react';
import { FC, useState } from 'react';
import PropertiesCode from './codeEditor';
import { IDataNode, IPropertiesTreeProps, IPropertiesTreeState } from './models';
import { usePropertiesTree } from './usePropertiesTree';
import { convertToGqlString, findSearchInTarget } from './utils';
import './styles.less';
import { getIconByPropertyMetadata } from '../../../../utils/metadata';

const { TabPane } = Tabs;

const PropertiesTree: FC<IPropertiesTreeProps> = ({ entityType, onChange, value }) => {
  const [{ expandedKeys, autoExpandParent, value: localValue, searchValue }, setState] = useState<IPropertiesTreeState>(
    {}
  );
  const { treeData, onLoadData, selectedKeys } = usePropertiesTree(entityType, value);

  console.log('Logs:: PropertiesTree selectedKeys', selectedKeys);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const _expandedKeys: string[] = [];

    const loop = (data: IDataNode[]) => {
      data.forEach(item => {
        if (item.key.toLowerCase().includes(value.toLowerCase())) {
          _expandedKeys.push(item.key);
        }
        if (item.children) {
          loop(item.children);
        }
      });
    };

    loop(treeData);

    setState(prev => ({
      ...prev,
      expandedKeys: _expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    }));
  };

  const onCheck = (
    checked: string[]
    // info: CheckInfo<IDataNode>
  ) => {
    const selectedKeysToGQl = convertToGqlString(checked);

    if (checked?.length) {
      if (onChange) {
        onChange(selectedKeysToGQl);
        setState(prev => ({ ...prev, value: selectedKeysToGQl }));
      }
    }
  };

  const onExpand = (_expandedKeys: React.Key[]) => {
    setState(prev => ({
      ...prev,
      expandedKeys: _expandedKeys,
      autoExpandParent: false,
    }));
  };

  const memoizedTreeData = useMemo(() => {
    if (!searchValue?.trim()) return treeData;

    const loop = (data: IDataNode[]): IDataNode[] =>
      data.map(({ path, ...item }) => {
        const index = path?.toLocaleLowerCase().indexOf(searchValue?.toLocaleLowerCase());
        const beforeStr = path.substring(0, index);
        const afterStr = path.slice(index + searchValue.length);

        const searchedKey =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="search-value">
                <strong>{findSearchInTarget(searchValue, path)}</strong>
              </span>
              {afterStr}
            </span>
          ) : (
            <span>{path}</span>
          );

        const title = (
          <span>
            {getIconByPropertyMetadata({ dataType: item?.dataType })} {searchedKey}
          </span>
        );

        if (item?.children) {
          return { path, ...item, title, children: loop(item?.children) };
        }

        return {
          path,
          ...item,
          title,
        };
      });

    return loop(treeData);
  }, [searchValue, treeData]);

  return (
    <div className="properties-tree">
      <Tabs>
        <TabPane tab="Properties" key="properties" tabKey="properties">
          <Input.Search style={{ marginBottom: 8 }} placeholder="Search" onChange={handleSearchChange} />

          <Tree
            loadData={onLoadData}
            treeData={memoizedTreeData}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            showLine
            checkable
            checkedKeys={[
              'DateOfBirth',
              'EmailAddress1',
              'EmailAddress2',
              // 'Photo',
              'Photo.Category',
              'Photo.CreationTime',
              'Photo.ParentFile',
              'Photo.ParentFile.OwnerId',
              'Photo.ParentFile.OwnerType',
              'Photo.ParentFile.IsDeleted',
              'Photo.ParentFile.Id',
              'Gender',
              'HomeNumber',
              'MiddleName',
              'Title',
              'WorkAddress',
            ]}
            // defaultExpandedKeys={['Photo']}
            onExpand={onExpand}
            onSelect={(keys, info) => {
              console.log('LOGS:: onSelect keys, info', keys, info);
            }}
            onCheck={(checked, info) => {
              if (Array.isArray(checked)) {
                onCheck(checked as string[]);
                console.log('LOGS:: onCheck checked, info', checked, info);
              }
            }}
          />
        </TabPane>
        <TabPane tab="Code Editor" key="code" tabKey="code">
          <PropertiesCode value={value} option="markdown" />
        </TabPane>
      </Tabs>
    </div>
  );
};

PropertiesTree.displayName = 'PropertiesTree';

export { PropertiesTree };

export default PropertiesTree;
