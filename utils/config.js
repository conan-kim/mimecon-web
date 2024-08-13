export const isDev = process.env.NEXT_PUBLIC_ENVIRONMENT === "development";
const config = {
  API_URL: isDev
    ? process.env.NEXT_PUBLIC_DEV_API_URL
    : process.env.NEXT_PUBLIC_PROD_API_URL,
  WEB_URL: isDev
    ? process.env.NEXT_PUBLIC_DEV_WEB_URL
    : process.env.NEXT_PUBLIC_PROD_WEB_URL,
  WSS_STT_URL: isDev
    ? process.env.NEXT_PUBLIC_DEV_WSS_STT_URL
    : process.env.NEXT_PUBLIC_PROD_WSS_STT_URL,
  WS_CONNECT_APP_ID: process.env.NEXT_PUBLIC_WS_CONNECT_APP_ID,
  WS_CONNECT_SYNAPSES_ID: process.env.NEXT_PUBLIC_WS_CONNECT_SYNAPSES_ID,
  WS_CONNECT_OWNER: process.env.NEXT_PUBLIC_WS_CONNECT_OWNER,
  WS_CONNECT_MODEL_NAME: process.env.NEXT_PUBLIC_WS_CONNECT_MODEL_NAME,
};

export default config;
