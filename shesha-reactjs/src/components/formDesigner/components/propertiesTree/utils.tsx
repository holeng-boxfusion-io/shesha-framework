import { IAnyObject } from '../../../../interfaces/anyObject';
import { IDataNode } from './models';
import { graphQlQueryToJson } from 'graphql-query-to-json';
import { IModelMetadata } from '../../../../interfaces/metadata';
import { getIconByPropertyMetadata } from '../../../../utils/metadata';
import React from 'react';
import _ from 'lodash';

// It's just a simple demo. You can use tree map to optimize update perf.
export const updateTreeData = (
  key: React.Key,
  entityType: string,
  list: IDataNode[],
  children: IDataNode[]
): IDataNode[] =>
  list?.map(node => {
    if (node?.key === key) {
      const newNode = {
        ...node,
        children,
      };

      return newNode;
    }

    if (node.children) {
      return {
        ...node,
        children: updateTreeData(key, entityType, node.children, children),
      };
    }
    return node;
  });

export const getParentKey = (key: React.Key, tree: IDataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

export const convertToGqlString = (
  elements: string[],
  removeOuterCurlyBraces = true,
  noColons = true,
  noCommas = true
) => {
  const result = {};
  for (const element of elements) {
    let current = result;
    const parts = element.split('.');
    for (const part of parts) {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
  }
  let gqlString = JSON.stringify(result, null, 2)
    .replace(/"([^"]+)": {}/g, '$1')
    .replace(/"([^"]+)":/g, noColons ? '$1' : '$1:')
    .replace(/"/g, '');

  if (removeOuterCurlyBraces) {
    gqlString = gqlString.replace(/^{/, '').replace(/}$/, '');
  }

  if (noCommas) {
    gqlString = gqlString.replace(/,/g, '');
  }

  return gqlString;
};

const jsonToDotNotationArray = (obj: IAnyObject) => {
  const keys: string[] = [];

  function traverse(node: IAnyObject, path = '') {
    for (const key in node) {
      const newPath = path ? `${path}.${key}` : key;
      keys.push(newPath);
      if (typeof node[key] === 'object' && node[key] !== null) {
        traverse(node[key], newPath);
      }
    }
  }

  traverse(obj);

  return keys;
};

export const convertGQLStringToArray = (gqlString: string): string[] => {
  if (!gqlString) return [];

  let _gqlString = !gqlString?.trim().startsWith('{') ? `{ ${gqlString}` : gqlString;

  if (!gqlString?.trim().endsWith('}')) {
    _gqlString = `${_gqlString} }`;
  }

  const result = graphQlQueryToJson(_gqlString);

  return jsonToDotNotationArray(result)
    ?.map<string>(element => {
      if (element === 'query') return null;

      if (element?.startsWith('query.')) return element?.replace('query.', '');

      return element;
    })
    ?.filter(Boolean);
};

export const getTreeFromProperties = (properties: IModelMetadata['properties']): IDataNode[] =>
  properties?.map<IDataNode>(metaData => {
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

export const findSearchInTarget = (search: string, target: string): string | null => {
  const index = target.toLowerCase().indexOf(search.toLowerCase());
  if (index === -1) {
    return null; // search string not found in target string
  }

  const matchedString = target.slice(index, index + search.length);
  if (matchedString === search) {
    // search string found in target string with same casing
    return matchedString;
  }

  // search string found in target string with different casing,
  // return the matched string with the casing from the target string
  const regex = new RegExp(search, 'i');
  const match = target.match(regex);
  if (match !== null) {
    return match[0];
  }

  // if no match is found, return null
  return null;
};
