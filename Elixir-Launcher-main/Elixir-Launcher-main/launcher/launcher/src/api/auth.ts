import axios, { AxiosError, AxiosResponse } from "axios";
import endpoints, { isDev } from "./endpoints";

export interface AuthResponse {
  accessToken: string;
  success: boolean;
  character: {
    rarity: string;
    templateId: string;
  };
  user: {
    accountId: string;
    discordId: string;
    username: string;
    hasFL: boolean;
    banned: boolean;
    created: string;
  };
  athena: {
    XP: number;
    Level: number;
  };
  common_core: {
    VBucks: number;
  };
}

interface ExchangeCodeResponse {
  code: string;
  success: boolean;
}

export const createAccessToken = async (
  code: string
): Promise<ResponseOrError<AuthResponse>> => {
  const response: AxiosResponse<AuthResponse> | AxiosError<AuthResponse> =
    await axios
      .post(endpoints(isDev).POST_ACCESS_TOKEN_ENDPOINT, {
        exchange_code: code,
      })
      .catch(() => new AxiosError<AuthResponse>());

  if (response instanceof Error) {
    return {
      success: false,
      data: response.response?.data!,
    };
  }

  return {
    success: true,
    data: response.data,
  };
};

export const createExchangeCode = async (
  access_token: string
): Promise<ResponseOrError<ExchangeCodeResponse>> => {
  const response:
    | AxiosResponse<ExchangeCodeResponse>
    | AxiosError<ExchangeCodeResponse> = await axios
    .post(
      endpoints(isDev).POST_EXCHANGE_CODE_ENDPOINT,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
    .catch(() => new AxiosError<ExchangeCodeResponse>());

  if (response instanceof Error) {
    return {
      success: false,
      data: response.response?.data!,
    };
  }

  return {
    success: true,
    data: response.data,
  };
};

export const getDiscordUri = async (): Promise<ResponseOrError<string>> => {
  const response: AxiosResponse<string> | AxiosError<string> = await axios
    .get(endpoints(isDev).GET_DISCORD_URI_ENDPOINT)
    .catch(() => new AxiosError<string>());

  if (response instanceof Error) {
    return {
      success: false,
      data: response.response?.data!,
    };
  }

  return {
    success: true,
    data: response.data,
  };
};
