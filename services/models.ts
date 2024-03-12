import { OPENAI_API_TYPE, OPENAI_API_VERSION, OPENAI_ORGANIZATION } from '@/utils/app/const';

import { OpenAIModel, OpenAIModelID, OpenAIModels } from '@/types/openai';

export async function getAPIModels(key: string, apiHost: string) {
  try {

    console.log('model use ctx host: ', apiHost);

    let url = `${apiHost}/v1/models`;
    if (OPENAI_API_TYPE === 'azure') {
      url = `${apiHost}/openai/deployments?api-version=${OPENAI_API_VERSION}`;
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(OPENAI_API_TYPE === 'openai' && {
          Authorization: `Bearer ${key ? key : process.env.OPENAI_API_KEY}`
        }),
        ...(OPENAI_API_TYPE === 'azure' && {
          'api-key': `${key ? key : process.env.OPENAI_API_KEY}`
        }),
        ...((OPENAI_API_TYPE === 'openai' && OPENAI_ORGANIZATION) && {
          'OpenAI-Organization': OPENAI_ORGANIZATION,
        }),
      },
    });

    if (response.status === 401) {
      return {data: response.body, status: response.status};
    } else if (response.status !== 200) {
      console.error(
        `OpenAI API returned an error ${
          response.status
        }: ${await response.text()}`,
      );
      return {data: response.body, status: response.status};
    }

    const json = await response.json();

    const models: OpenAIModel[] = json.data
      .map((model: any) => {
        const model_name = (OPENAI_API_TYPE === 'azure') ? model.model : model.id;
        for (const [key, value] of Object.entries(OpenAIModelID)) {
          let model_id = model.id
          let owned_by = model.owned_by
          const parts = model.id.split("--");
          if (parts.length > 1) {
            owned_by = parts[0]
            model_id = parts[1]
          }
          return {
            id: `[${owned_by}] ${model_id}`,
            name: model_id,
            owned_by: owned_by,
            tokenLimit: model.tokenLimit ? model.tokenLimit : 4000,
          };
        }
      })
      .filter(Boolean);
    return { data: models, status: 200};
  } catch (error) {
    return { data: error, status: 500};
  }
};
