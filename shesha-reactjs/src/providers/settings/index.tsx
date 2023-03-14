import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import useThunkReducer from '../../hooks/thunkReducer';
import { SETTINGS_CONTEXT_INITIAL_STATE, SettingsContext, ISettingsContext } from './contexts';
import { ISettingIdentifier, ISettingsDictionary } from './models';
import reducer from './reducer';
import { settingsGetValue } from '../../apis/settings';
import { useSheshaApplication } from '../..';
import { IErrorInfo } from '../../interfaces/errorInfo';

export interface ISettingsProviderProps {

}

const SettingsProvider: FC<ISettingsProviderProps> = ({ children }) => {
    const [state, _dispatch] = useThunkReducer(reducer, SETTINGS_CONTEXT_INITIAL_STATE);
    const settings = useRef<ISettingsDictionary>({});

    const { backendUrl, httpHeaders } = useSheshaApplication();

    const makeFormLoadingKey = (payload: ISettingIdentifier): string => {
        const { module, name } = payload;
        return `${module}:${name}`.toLowerCase();
    }

    const getSetting = (settingId: ISettingIdentifier): Promise<any> => {
        if (!settingId || !settingId.name)
            return Promise.reject('settingId is not specified');

        // create a key
        const key = makeFormLoadingKey(settingId);

        const loadedValue = settings.current[key];
        if (loadedValue) return loadedValue; // todo: check for rejection

        const settingPromise = settingsGetValue({ name: settingId.name, module: settingId.module }, { base: backendUrl, headers: httpHeaders })
            .then(response => {
                return response.success
                    ? response.result
                    : null;
            })

        settings.current[key] = settingPromise;

        return settingPromise;
    };


    const contextValue: ISettingsContext = {
        ...state,
        getSetting
    };

    return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
}

function useSettings(require: boolean = true) {
    const context = useContext(SettingsContext);

    if (context === undefined && require) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }

    return context;
}

export interface SettingValueLoadingState<TValue = any> {
    loadingState: LoadingState;
    value?: TValue;
    error?: IErrorInfo;
}

export type LoadingState = 'waiting' | 'loading' | 'ready' | 'failed';

const useSettingValue = <TValue = any>(settingId: ISettingIdentifier): SettingValueLoadingState<TValue> => {
    const settings = useSettings();
    const [state, setState] = useState<SettingValueLoadingState>({ loadingState: 'waiting' });

    useEffect(() => {
        settings.getSetting(settingId).then(response => {
            setState(prev => ({ ...prev, error: null, value: response as TValue, loadingState: 'ready' }));
        });
    }, [settingId?.module, settingId?.name]);

    return state;
}

export { SettingsProvider, useSettings, useSettingValue };