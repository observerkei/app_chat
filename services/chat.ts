'use client'
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/utils/app/const';
import { OpenAIError, OpenAIStream } from '@/utils/server';

import { ChatBody, Message } from '@/types/chat';

import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';

export const config = {
  runtime: 'edge',
};

async function fetchWasm(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch Wasm file: ${response.statusText}`);
  }
  const wasmBytes = await response.arrayBuffer();
  return wasmBytes;
}

const getAPIChat = async (req: Request): Promise<Response> => {
  console.log('try chat...');
  try {
    const sendMessagesSignal = req.signal;
    const { model, messages, key, prompt, temperature, apiHost } = (await req.json()) as ChatBody;

    console.log('chat get api Host: ', apiHost)
    console.log('chat model: ', JSON.stringify(model))
    
    const wasm = await fetchWasm('/tiktoken_bg.wasm');

    await init((imports) => WebAssembly.instantiate(wasm, imports));
    const encoding = new Tiktoken(
      tiktokenModel.bpe_ranks,
      tiktokenModel.special_tokens,
      tiktokenModel.pat_str,
    );

    let promptToSend = prompt;
    if (!promptToSend) {
      promptToSend = DEFAULT_SYSTEM_PROMPT;
    }

    let temperatureToUse = temperature;
    if (temperatureToUse == null) {
      temperatureToUse = DEFAULT_TEMPERATURE;
    }

    const prompt_tokens = encoding.encode(promptToSend);

    let tokenCount = prompt_tokens.length;
    let messagesToSend: Message[] = [];

    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      const tokens = encoding.encode(message.content);

      if (tokenCount + tokens.length + 1000 > model.tokenLimit) {
        break;
      }
      tokenCount += tokens.length;
      messagesToSend = [message, ...messagesToSend];
    }

    encoding.free();

    const stream = await OpenAIStream(model, 
      promptToSend, 
      temperatureToUse, 
      key, 
      messagesToSend,
      apiHost,
      sendMessagesSignal);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    if (error instanceof OpenAIError) {
      return new Response('Error', { status: 500, statusText: error.message });
    } else {
      return new Response('Error', { status: 500 });
    }
  }
};

export default getAPIChat;
