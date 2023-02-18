import { IAnyObject } from './../../../../interfaces/anyObject';
import { IDataNode } from './models';
import { graphQlQueryToJson } from 'graphql-query-to-json';

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

export const convertToGqlString = (elements: string[], removeOuterCurlyBraces = false) => {
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
  let response = JSON.stringify(result, null, 2)
    .replace(/"([^"]+)": {}/g, '$1')
    .replace(/"([^"]+)":/g, '$1')
    // .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, '')
    .replace(/^{/, '{\n  ')
    .replace(/}$/, '\n}');

  if (removeOuterCurlyBraces) {
    response = response?.trim().substring(1, response?.length - 1);
  }

  return response;
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

export const convertGQLStringToArray = (gqlString: string) => {
  const result = graphQlQueryToJson(gqlString);

  const dotNotationArray = jsonToDotNotationArray(result);
};
