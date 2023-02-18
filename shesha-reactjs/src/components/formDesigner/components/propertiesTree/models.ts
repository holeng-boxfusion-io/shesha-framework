import { ReactNode } from 'react';
type DataTypes =
  | 'guid'
  | 'string'
  | 'number'
  | 'date'
  | 'time'
  | 'date-time'
  | 'entity'
  | 'file'
  | 'reference-list-item'
  | 'boolean'
  | 'array'
  | 'object'
  | 'object-reference'
  | 'specification';

export interface IDataNode {
  key: string;
  dataType: DataTypes;
  path: string;
  dataFormat?: string;
  entityType: string;
  title: ReactNode;
  isLeaf?: boolean;
  children?: IDataNode[];
}

export interface IPropertiesTreeState {
  searchValue?: string;
  autoExpandParent?: boolean;
  expandedKeys?: React.Key[];
  treeData?: IDataNode[];
  propertiesMap?: Map<string, IDataNode[]>;
  value?: string;
}

export interface IPropertiesTreeProps {
  /**
   * The name of the entity to fetch properties against
   */
  entityType: string;
  value?: string;
  onChange?: (value: string) => void;

  /**
   * Whether the generated GQL query should have outer curly braces
   */
  removeOuterCurlyBraces?: boolean;
}

export type UpdateTreeMode = 'reset' | 'update';
