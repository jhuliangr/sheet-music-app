export async function get<Type>(url: string): Promise<Type> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json() as Promise<Type>;
}
