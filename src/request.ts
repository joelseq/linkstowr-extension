export async function post(url: string, body: any = {}) {
  return await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
}
