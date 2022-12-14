const api = 'http://localhost:3001/api'; // localhost

const headerBuilder = (header: any, form: any) => ({
  ...{ header },
  ...(form ? { 'Content-Type': 'application/json' } : null),
});

const handler = async (res: any) => {
  if (!res.ok) {
    throw (await res.json());
  } else { return res.json(); }
};

const get = (endpoint: string) => fetch(api + endpoint, {
  method: 'GET',
}).then(handler);

const post = (endpoint: string, form: any = null, header = null) => fetch(api + endpoint, {
  method: 'POST',
  body: JSON.stringify(form),
  headers: headerBuilder(header, form),
}).then(handler);

export {
  api, get, post,
};
