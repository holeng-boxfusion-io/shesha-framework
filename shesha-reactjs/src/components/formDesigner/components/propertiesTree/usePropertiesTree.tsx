import { EventDataNode } from 'antd/lib/tree';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useDeepCompareEffect, usePrevious } from 'react-use';
import { useMetadataDispatcher } from '../../../../providers';
import { IDataNode, UpdateTreeMode } from './models';
import { convertGQLStringToArray, getTreeFromProperties, updateTreeData } from './utils';

interface IPropertiesTreeHookState {
  treeData?: IDataNode[];
  selectedKeys?: string[];
}

export const usePropertiesTree = (entityType: string, value: string) => {
  const [state, setState] = useState<IPropertiesTreeHookState>({ treeData: [], selectedKeys: [] });
  const { getMetadata: fetchMeta } = useMetadataDispatcher();

  const { selectedKeys, treeData } = state;

  console.log('Logs:: usePropertiesTree entityType', entityType);
  console.log('Logs:: usePropertiesTree value', value);
  console.log('Logs:: usePropertiesTree selectedKeys', selectedKeys);
  console.log('Logs:: usePropertiesTree convertGQLStringToArray', convertGQLStringToArray(value));
  console.log('Logs:: usePropertiesTree ======================================');

  const propertiesMap = useRef(new Map<string, IDataNode[]>());

  const previousEntityType = usePrevious(entityType);

  useEffect(() => {
    if (entityType && previousEntityType !== entityType) {
      setNodes(null, entityType, null, 'reset');
    }
  }, [entityType]);

  useDeepCompareEffect(() => {
    if (!entityType) return;

    console.log('Logs:: usePropertiesTree useDeepCompareEffect');

    if (selectedKeys?.length === 0 || !selectedKeys) {
      setState(prev => ({ ...prev, selectedKeys: convertGQLStringToArray(value) }));
    }
  }, [value, entityType]);

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

  const setNodeChildren = (key: string, modelType: string, children: IDataNode[], mode: UpdateTreeMode) => {
    if (!propertiesMap?.current?.has(modelType)) {
      propertiesMap?.current.set(modelType, children);
    }

    propertiesMap?.current.set(modelType, children);

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
    }));
  };

  const onLoadData = ({ key, entityType: _entityType, dataType, children }: EventDataNode<IDataNode>) =>
    new Promise<void>(resolve => {
      if (children || dataType !== 'entity') {
        resolve();
        return;
      }

      if (propertiesMap?.current?.has(_entityType)) {
        setNodeChildren(key, _entityType, propertiesMap?.current?.get(_entityType), 'update');
        resolve();
      } else {
        setNodes(key, _entityType, resolve, 'update');
      }
    });

  return { selectedKeys, treeData, setNodeChildren, onLoadData };
};
