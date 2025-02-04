import { createAction } from 'redux-actions';
import IRequestHeaders from '../../interfaces/requestHeaders';
import { IToolboxComponentGroup } from 'interfaces';

export enum SheshaApplicationActionEnums {
  SetRequestHeaders = 'SET_REQUEST_HEADERS',
  SetBackendUrl = 'SET_BACKEND_URL',
  SetSetToolboxComponents = 'SET_TOOLBOX_COMPONENTS',
  UpdateToolboxComponentGroups = 'UPDATE_TOOLBOX_COMPONENT_GROUPS',
}

export const setHeadersAction = createAction<IRequestHeaders, IRequestHeaders>(
  SheshaApplicationActionEnums.SetRequestHeaders,
  (p) => p
);

export const setBackendUrlAction = createAction<string, string>(SheshaApplicationActionEnums.SetBackendUrl, (p) => p);

export const updateToolboxComponentGroupsAction = createAction<IToolboxComponentGroup[], IToolboxComponentGroup[]>(
  SheshaApplicationActionEnums.UpdateToolboxComponentGroups,
  (p) => p
);
