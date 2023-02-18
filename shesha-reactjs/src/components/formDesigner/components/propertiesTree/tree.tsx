import { Input, Tabs, Tree } from 'antd';
import { EventDataNode } from 'antd/lib/tree';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { FC, useState } from 'react';
import { usePrevious } from 'react-use';
import { IModelMetadata } from '../../../../interfaces/metadata';
import { useMetadataDispatcher } from '../../../../providers';
import { getIconByPropertyMetadata } from '../../../../utils/metadata';
import PropertiesCode from './codeEditor';
import { IDataNode, IPropertiesTreeProps, IPropertiesTreeState, UpdateTreeMode } from './models';
import { convertToGqlString, getParentKey, updateTreeData } from './utils';

const { TabPane } = Tabs;

const PropertiesTree: FC<IPropertiesTreeProps> = ({ entityType, onChange, value, removeOuterCurlyBraces = true }) => {
  const [{ treeData, propertiesMap, expandedKeys, autoExpandParent, value: localValue }, setState] = useState<
    IPropertiesTreeState
  >({
    treeData: [],
    propertiesMap: new Map(),
  });
  const { getMetadata: fetchMeta } = useMetadataDispatcher();

  const getTreeFromProperties = (properties: IModelMetadata['properties']): IDataNode[] => {
    return properties?.map<IDataNode>(metaData => {
      const { path, dataType, entityType: _entityType, dataFormat } = metaData;

      // TODO:: Also check dataFormat. Arrays have dataFormat === 'entity'
      return {
        title: (
          <span>
            {getIconByPropertyMetadata(metaData)} {path}
          </span>
        ),
        key: path,
        path,
        dataFormat,
        dataType: dataType as any,
        entityType: _entityType,
        children: null,
        isLeaf: dataType !== 'entity',
      };
    });
  };

  const setNodes = (
    key: string,
    modelType: string,
    resolve?: (value: void | PromiseLike<void>) => void,
    mode?: UpdateTreeMode
  ) => {
    fetchMeta({ modelType }).then(meta => {
      const children = getTreeFromProperties(meta?.properties);

      setNodeChildren(key, modelType, children, mode);

      if (typeof resolve === 'function') {
        resolve();
      }
    });
  };

  const previousEntityType = usePrevious(entityType);

  useEffect(() => {}, [value, entityType]);

  useEffect(() => {
    if (entityType && previousEntityType !== entityType) {
      setNodes(null, entityType, null, 'reset');
    }
  }, [entityType]);

  const onLoadData = ({ key, entityType: _entityType, dataType, children }: EventDataNode<IDataNode>) =>
    new Promise<void>(resolve => {
      if (children || dataType !== 'entity') {
        resolve();
        return;
      }

      if (propertiesMap?.has(_entityType)) {
        setNodeChildren(key, _entityType, propertiesMap?.get(_entityType), 'update');
        resolve();
      } else {
        setNodes(key, _entityType, resolve, 'update');
      }
    });

  const setNodeChildren = (key: string, modelType: string, children: IDataNode[], mode: UpdateTreeMode) => {
    const localMap = new Map(propertiesMap);

    if (!localMap?.has(modelType)) {
      localMap.set(modelType, children);
    }

    localMap.set(modelType, children);

    const incomingTreeData =
      mode === 'reset' || !key
        ? children
        : updateTreeData(
            key,
            modelType,
            treeData,
            children
              ?.filter((x, index) => {
                if (index !== 0 && children[index - 1].key === x.key) {
                  // TODO:: Fix weird issue
                  // When the entityName === Shesha.Core.Person, the FullName property gets rendered twice, causing an issue.
                  // This is just a hack for now
                  return false;
                }
                return true;
              })
              ?.map(child => ({
                ...child,
                key: `${key}.${child?.key}`,
              }))
          );

    setState(prev => ({
      ...prev,
      treeData: incomingTreeData,
      propertiesMap: localMap,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newExpandedKeys = treeData
      .map(item => {
        if (item?.key?.indexOf(value) > -1) {
          return getParentKey(item.key, []);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    setState(prev => ({
      ...prev,
      expandedKeys: newExpandedKeys,
      searchValue: value,
      autoExpandParent: true,
    }));
  };

  const onCheck = (
    checked: string[]
    // info: CheckInfo<IDataNode>
  ) => {
    const selectedKeysToGQl = convertToGqlString(checked, removeOuterCurlyBraces);

    if (checked?.length) {
      if (onChange) {
        onChange(selectedKeysToGQl);
        setState(prev => ({ ...prev, value: selectedKeysToGQl }));
      }
    }
  };

  return (
    <div>
      <Tabs>
        <TabPane tab="Properties" key="properties" tabKey="properties">
          <Input.Search style={{ marginBottom: 8 }} placeholder="Search" onChange={handleSearchChange} />

          <Tree
            loadData={onLoadData}
            treeData={treeData}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            showLine
            checkable
            onExpand={expandedKeys => {
              setState(prev => ({ ...prev, expandedKeys }));
            }}
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
          <PropertiesCode value={localValue} />
        </TabPane>
      </Tabs>
    </div>
  );
};

PropertiesTree.displayName = 'PropertiesTree';

export { PropertiesTree };

export default PropertiesTree;
