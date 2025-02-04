import React, { FC } from 'react';
import { Page, ShaSpin } from '../';
import IndexTableFull, { IIndexTableFullProps } from '../indexTableFull';
import DataTableProvider from '../../providers/dataTable';
import { TableColumnsFluentSyntax } from '../../providers/dataTable/interfaces';
import { useDataTableFluentColumns } from '../../hooks';

export interface ISimpleIndexPageProps extends Omit<IIndexTableFullProps, 'id'> {
  /** Type of entity */
  entityType: string;
  columns: TableColumnsFluentSyntax;
  /**
   * Page title
   */
  title: string;

  loading?: boolean;
}

const TableWithControls: FC<ISimpleIndexPageProps> = ({ loading = false, ...props }) => {
  return (
    <Page noPadding>
      <ShaSpin spinning={loading}>
        <IndexTableFull header={props.title} {...props} />
      </ShaSpin>
    </Page>
  );
};

const SimpleIndexPagePlain: FC<ISimpleIndexPageProps> = props => {
  const configurableColumns = useDataTableFluentColumns(props.columns);

  return (
    <DataTableProvider
      sourceType='Entity'
      entityType={props.entityType}
      configurableColumns={configurableColumns}
      dataFetchingMode='paging'
    >
      <TableWithControls {...props} />
    </DataTableProvider>
  );
};

export default SimpleIndexPagePlain;
