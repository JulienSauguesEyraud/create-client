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
  `${toResourcePath(resourceName)}/show?id=${encodeURIComponent(id)}`;

export const toResourceEditPath = (resourceName: string, id: string): string =>
  `${toResourcePath(resourceName)}/edit?id=${encodeURIComponent(id)}`;

export const redirectToResourcePath = (
  resourceName: string,
  success?: "deleted"
) =>
  goto(
    success
      ? `${toResourcePath(resourceName)}?success=${encodeURIComponent(success)}`
      : toResourcePath(resourceName)
  );

export const redirectToResourceShowPath = (
  resourceName: string,
  id: string,
  success?: "created" | "updated"
) =>
  goto(
    success
      ? `${toResourceShowPath(resourceName, id)}&success=${encodeURIComponent(success)}`
      : toResourceShowPath(resourceName, id)
  );

export const redirectToResourceEditPath = (resourceName: string, id: string) =>
  goto(toResourceEditPath(resourceName, id));
