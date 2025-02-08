import {
    ListItem,
} from "@/app/components/ui-lib";
import Locale from "@/app/locales";
import {
    useAppConfig,
} from "@/app/store";

type Params = {
};

export function OnlyCustomModelsSwitch({}: Params) {
    const config = useAppConfig();
    const updateConfig = config.update;

    return (
        <ListItem
            title={Locale.Settings.Access.OnlyCustomModel.Title}
            subTitle={Locale.Settings.Access.OnlyCustomModel.SubTitle}
        >
            <input
                aria-label={Locale.Settings.Access.OnlyCustomModel.Title}
                type="checkbox"
                checked={config.OnlyCustomModel}
                onChange={(e) => {
                    updateConfig(
                        (config) => (config.OnlyCustomModel = e.currentTarget.checked),
                    );
                }}
            ></input>
        </ListItem>
    )
}