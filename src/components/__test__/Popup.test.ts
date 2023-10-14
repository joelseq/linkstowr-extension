import '@testing-library/jest-dom';
import {render, fireEvent, screen} from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import {setupServer} from 'msw/node';
import {ResponseComposition, rest, RestContext, RestRequest} from 'msw';
import Popup from '../Popup.svelte';

const TEST_TAB_URL = 'https://www.obsidian.md';
const DEFAULT_API_URL = 'http://localhost:8000';
const CUSTOM_API_URL = 'https://customserver.com';
const TEST_TOKEN = 'lshelf_XXXXXXX_XXXXXXXXXXXXXX';
const TEST_LINK_TITLE = 'Title of link';
const TEST_LINK_NOTE = 'A memorable note for my link';

import.meta.env.VITE_API_URL = DEFAULT_API_URL;

let requestObj: RestRequest | null = null;

const handler = (
  req: RestRequest,
  res: ResponseComposition,
  ctx: RestContext,
) => {
  requestObj = req;
  return res(ctx.status(200));
};

const server = setupServer(
  rest.post(`${DEFAULT_API_URL}/api/links`, handler),
  rest.post(`${CUSTOM_API_URL}/api/links`, handler),
);

type SyncStorage = {
  lsToken?: string | null | undefined;
  customAPIURL?: string | null | undefined;
};

let syncStorage: SyncStorage = {};

const addToken = () => {
  syncStorage.lsToken = TEST_TOKEN;
};

const addCustomUrl = () => {
  syncStorage.customAPIURL = CUSTOM_API_URL;
};

vi.stubGlobal('chrome', {
  tabs: {
    query: async (_, callback) => {
      await callback([{url: TEST_TAB_URL}]);
    },
  },
  storage: {
    sync: {
      get: (key: string) => {
        return Promise.resolve({
          [key]: syncStorage[key],
        });
      },
      remove: (key: string) => {
        delete syncStorage[key];
        return Promise.resolve();
      },
      set: (input: {[key: string]: string}) => {
        Object.keys(input).forEach((k) => {
          syncStorage[k] = input[k];
        });
        return Promise.resolve();
      },
    },
  },
});

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  // Reset the chrome storage before each test
  syncStorage = {};

  vi.useFakeTimers();
  vi.resetAllMocks();
});

const saveLink = async () => {
  const titleEl: HTMLInputElement = screen.getByLabelText('Title');
  const noteEl: HTMLTextAreaElement = screen.getByLabelText('Note');

  userEvent.type(titleEl, TEST_LINK_TITLE);
  await vi.runAllTimersAsync();
  userEvent.type(noteEl, TEST_LINK_NOTE);
  await vi.runAllTimersAsync();
  fireEvent.click(screen.getByText('Save Link'));
  await vi.runAllTimersAsync();
};

test('shows the access token input by default at the start', () => {
  render(Popup);

  const accessTokenInput = screen.getByLabelText('Access Token');
  expect(accessTokenInput).toBeInTheDocument();
});

test('shows the save link form when there is an access token', async () => {
  addToken();

  render(Popup);
  await vi.runAllTimersAsync();

  expect(screen.getByLabelText('Title')).toBeInTheDocument();
  expect(screen.getByLabelText('Note')).toBeInTheDocument();
});

test('saves a link', async () => {
  addToken();

  render(Popup);
  await vi.runAllTimersAsync();

  await saveLink();

  expect(requestObj.url.toString()).toBe(`${DEFAULT_API_URL}/api/links`);
  const body = await requestObj.json();
  expect(body).toEqual({
    title: TEST_LINK_TITLE,
    note: TEST_LINK_NOTE,
    url: TEST_TAB_URL,
  });
});

test('saves a custom server url', async () => {
  addToken();

  render(Popup);
  await vi.runAllTimersAsync();

  const settingsEl = screen.getByLabelText('Toggle Settings');
  fireEvent.click(settingsEl);
  await vi.runAllTimersAsync();

  const inputEl: HTMLInputElement = screen.getByLabelText('Custom Server URL:');

  // Handles bad input
  userEvent.type(inputEl, 'badurl');
  await vi.runAllTimersAsync();
  fireEvent.click(screen.getByText('Save URL'));
  await vi.runAllTimersAsync();
  expect(inputEl.validity.valid).toBe(false);

  // Handles good input
  userEvent.clear(inputEl);
  await vi.runAllTimersAsync();
  userEvent.type(inputEl, CUSTOM_API_URL);
  await vi.runAllTimersAsync();
  fireEvent.click(screen.getByText('Save URL'));
  await vi.runAllTimersAsync();

  expect(inputEl).not.toBeInTheDocument();

  await saveLink();

  expect(requestObj.url.toString()).toBe(`${CUSTOM_API_URL}/api/links`);
});

test('loads with a custom server url', async () => {
  addToken();
  addCustomUrl();

  render(Popup);
  await vi.runAllTimersAsync();

  await saveLink();

  expect(requestObj.url.toString()).toBe(`${CUSTOM_API_URL}/api/links`);
});

test('clears a previously saved custom server url', async () => {
  addToken();
  addCustomUrl();

  render(Popup);
  await vi.runAllTimersAsync();

  const settingsEl = screen.getByLabelText('Toggle Settings');
  fireEvent.click(settingsEl);
  await vi.runAllTimersAsync();

  const inputEl: HTMLInputElement = screen.getByLabelText('Custom Server URL:');
  expect(inputEl.value).toBe(CUSTOM_API_URL);

  userEvent.clear(inputEl);
  await vi.runAllTimersAsync();
  fireEvent.click(screen.getByText('Save URL'));
  await vi.runAllTimersAsync();

  await saveLink();

  expect(requestObj.url.toString()).toBe(`${DEFAULT_API_URL}/api/links`);
});
