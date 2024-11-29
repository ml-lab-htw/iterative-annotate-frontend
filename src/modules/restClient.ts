export const apiIp = "http://141.45.161.106";
export const port = 8888;
/*
export const apiIp = "http://localhost";
export const port = 8000;
*/
export const basePath = `${apiIp}:${port}`;

export async function fetchData(url: string, method: string = 'GET', data: any = null) {
  const fullUrl = `${basePath}/${url}`;
  const headers = new Headers({
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Content-Type": "application/json",
    "Cache-Control": "no-cache"
  });

  const options: RequestInit = {
    method,
    headers,
    body: method !== 'GET' ? JSON.stringify(data) : null,
    cache: 'no-store',
  };

  const response = await fetch(fullUrl, options);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  try{
    return await response.json();
  } catch (e:any){
    throw new Error(`JSON return conversion Error: ${e}`);
  }
}

export async function fetchFormData(url: string, data: FormData){
  const fullUrl = `${basePath}/${url}`;
  const headers = new Headers({
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br"
  });

  const options: RequestInit = {
    method: 'POST',
    body: data,
    headers: headers,
    cache: 'no-store',
  };

  const response = await fetch(fullUrl, options);
  if (!response.ok){
    throw new Error('Request was aborted');
  }

  try{
    return await response.json();
  } catch (e:any){
    throw new Error(`JSON return conversion Error: ${e}`);
  }

}