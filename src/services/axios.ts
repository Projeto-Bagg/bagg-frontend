import { default as instance } from 'axios';
import { parseISO } from 'date-fns';
import { getCookie, setCookie } from 'cookies-next';

const isoDateFormat =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

function isIsoDateString(value: any): boolean {
  return value && typeof value === 'string' && isoDateFormat.test(value);
}

export function handleDates(body: any) {
  if (body === null || body === undefined || typeof body !== 'object') return body;

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIsoDateString(value)) body[key] = parseISO(value);
    else if (typeof value === 'object') handleDates(value);
  }
}

const axios = instance.create({
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  baseURL:
    process.env.NODE_ENV === 'production'
      ? `https://bagg-api.azurewebsites.net/`
      : 'http://localhost:3001/',
});

axios.interceptors.request.use((config) => {
  const token = getCookie('bagg.sessionToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (originalResponse) => {
    handleDates(originalResponse.data);
    return originalResponse;
  },
  async (error) => {
    const accessToken = getCookie('bagg.sessionToken');

    if (error.response.status === 401 && accessToken) {
      const refreshToken = getCookie('bagg.refreshToken');

      const response = await axios.post('/auth/refresh', {
        refreshToken,
      });

      setCookie('bagg.sessionToken', response.data.accessToken);
      setCookie('bagg.refreshToken', response.data.refreshToken);

      return axios(error.config);
    }
  },
);

export default axios;
