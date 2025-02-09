import {
    ListItem,
} from "@/app/components/ui-lib";
import Locale from "@/app/locales";
import {
    useAppConfig,
} from "@/app/store";
import { ChatGPTApi } from "@/app/client/platforms/openai";

export const updateCustomModels = (config: any, updateModelsHandle: any) => {
    const api = new ChatGPTApi();

    setTimeout((async () => {
        const models = await api.models(false);
        let customModels = "";
        let isFirst = true;
        for (const model of models) {
            if (isFirst) {
                isFirst = false;
            } else {
                customModels += ','
            }
            customModels += model.name;
        }
        // console.log(`customModels: ${customModels}`)
        updateModelsHandle(config, customModels);
    }), 200);
};


type Params = {
    config: any;
    updateModelsHandle: any;
};

export function AutoGetModelsSwitch({
    config,
    updateModelsHandle,
}: Params) {
    const updateConfig = config.update;

    return (
        <ListItem
            title={Locale.Settings.Access.AotuCustomModel.Title}
            subTitle={Locale.Settings.Access.AotuCustomModel.SubTitle}
        >
            <input
                aria-label={Locale.Settings.Access.AotuCustomModel.Title}
                type="checkbox"
                checked={config.autoGetModels}
                onChange={(e) => {
                    updateConfig(
                        (config: any) => (config.autoGetModels = e.currentTarget.checked),
                    );
                    if (e.currentTarget.checked) {
                        updateCustomModels(config, updateModelsHandle);
                    }
                }}
            ></input>
        </ListItem>
    )
}