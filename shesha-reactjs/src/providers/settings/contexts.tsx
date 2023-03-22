import { createContext } from 'react';
import { ISettingIdentifier } from './models';

export interface ILoadSettingPayload {
  module: string;
  name: string;
}

export interface ISettingsStateContext {

}

export interface ISettingsActionsContext {
  getSetting: (settingId: ISettingIdentifier) => Promise<any>;
}

export interface ISettingsContext extends ISettingsStateContext, ISettingsActionsContext {

}

/** initial state */
export const SETTINGS_CONTEXT_INITIAL_STATE: ISettingsStateContext = {

};

export const SettingsContext = createContext<ISettingsActionsContext>(undefined);