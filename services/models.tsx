import { OPENAI_API_TYPE, OPENAI_API_VERSION, OPENAI_ORGANIZATION } from '@/utils/app/const';

import { OpenAIModel, OpenAIModelID, OpenAIModels } from '@/types/openai';

export async function getAPIModels(key: string, apiHost: string) {

  try {
    //console.log('try get model');
    //console.log('key: ', key, ' apiHost: ', apiHost);

    let url = `${apiHost}/v1/models`;
    if (OPENAI_API_TYPE === 'azure') {
      url = `${apiHost}/openai/deployments?api-version=${OPENAI_API_VERSION}`;
    }
    //console.log('befor fetch model ... ');

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

    //console.log('after fetch model ... ', response);

    if (response.status === 401) {
      return new Response(response.body, {
        status: 500,
        headers: response.headers,
      });
    } else if (response.status !== 200) {
      console.error(
        `OpenAI API returned an error ${
          response.status
        }: ${await response.text()}`,
      );
      throw new Error('OpenAI API returned an error');
    }

    const json = await response.json();

    //console.log('fetch json: ', json)

    const models: OpenAIModel[] = json.data
      .map((model: any) => {
        const model_name = (OPENAI_API_TYPE === 'azure') ? model.model : model.id;
        for (const [key, value] of Object.entries(OpenAIModelID)) {
          {
            let model_id = model.id
            let owned_by = model.owned_by
            const parts = model.id.split("--");
            if (parts.length > 1) {
              owned_by = parts[0]
              model_id = parts[1]
            }
            //console.log('res model: ', model_id);
            return {
              id: `[${owned_by}] ${model_id}`,
              name: model_id,
              owned_by: owned_by,
              tokenLimit: model.tokenLimit ? model.tokenLimit : 4000,
            };
          }
        }
      })
      .filter(Boolean);

    console.log('pack model: ', models);
    return models
    return new Response(JSON.stringify(models), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

