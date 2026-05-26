import { goto } from "$app/navigation";

export const decodeRouteParam = (value: string | undefined): string | null => {
  if (!value) {
    return null;
  }

  return decodeURIComponent(value);
};

export const toResourcePath = (resourceName: string): string => `/${resourceName}`;

export const toResourceCreatePath = (resourceName: string): string =>
  `${toResourcePath(resourceName)}/create`;

export const toResourceShowPath = (resourceName: string, id: string): string =>
  `${toResourcePath(resourceName)}/show/${encodeURIComponent(id)}`;

export const toResourceEditPath = (resourceName: string, id: string): string =>
  `${toResourcePath(resourceName)}/edit/${encodeURIComponent(id)}`;

export const redirectToResourcePath = (resourceName: string) =>
  goto(toResourcePath(resourceName));

export const redirectToResourceEditPath = (resourceName: string, id: string) =>
  goto(toResourceEditPath(resourceName, id));
